import { Router } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Message } from '../models/Message.js'
import { User } from '../models/User.js'

const router = Router()

router.get('/:userId', async (req, res) => {
  try {
    const authorization = req.headers.authorization
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : ''

    const secret = process.env.JWT_SECRET

    if (!token || !secret || secret.length < 32) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const payload = jwt.verify(token, secret) as { sub: string }

    if (
      !mongoose.isValidObjectId(payload.sub) ||
      !mongoose.isValidObjectId(req.params.userId)
    ) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const currentUser = await User.findById(payload.sub).select('_id')
    const otherUser = await User.findById(req.params.userId).select('_id')

    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' })
    }

    if (!otherUser) {
      return res.status(404).json({ message: 'Recipient not found' })
    }

    const messages = await Message.find({
      $or: [
        { sender: payload.sub, recipient: req.params.userId },
        { sender: req.params.userId, recipient: payload.sub },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    return res.json({
      messages: messages.reverse().map((message) => ({
        id: String(message._id),
        senderId: String(message.sender),
        recipientId: String(message.recipient),
        text: message.text,
        createdAt: message.createdAt,
      })),
    })
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
})

export default router