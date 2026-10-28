
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { User } from '../models/User.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const authorization = req.headers.authorization
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : ''

    const secret = process.env.JWT_SECRET

    if (!token || !secret || secret.length < 32) {
      return res.status(401).json({
        message: 'Authentication required',
      })
    }

    const payload = jwt.verify(secret ? token : '', secret) as {
      sub: string
    }

    if (!mongoose.isValidObjectId(payload.sub)) {
      return res.status(401).json({ message: 'Invalid user token' })
    }

    const currentUser = await User.findById(payload.sub).select('_id')

    if (!currentUser) {
      return res.status(401).json({ message: 'User not found' })
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
    })
      .select('_id username displayName avatar')
      .sort({ displayName: 1 })
      .limit(100)
      .lean()

    return res.json({
      users: users.map((user) => ({
        id: String(user._id),
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar ?? '',
      })),
    })
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
})

export default router
