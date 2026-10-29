import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Message } from './models/Message.js'
import { User } from './models/User.js'

type TokenPayload = {
  sub: string
}

type SendMessageInput = {
  recipientId: string
  text: string
}


export function attachSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://atomou.vercel.app',
      ],
      methods: ['GET', 'POST'],
    },
  })

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      const secret = process.env.JWT_SECRET

      if (typeof token !== 'string' || !secret || secret.length < 32) {
        return next(new Error('Authentication required'))
      }

      const payload = jwt.verify(token, secret) as TokenPayload

      if (!mongoose.isValidObjectId(payload.sub)) {
        return next(new Error('Invalid user'))
      }

      const user = await User.findById(payload.sub).select('_id')

      if (!user) {
        return next(new Error('User not found'))
      }

      socket.data.userId = user.id
      next()
    } catch {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string

    // Each user has a private room for message delivery.
    socket.join(`user:${userId}`)

    socket.on(
      'message:send',
      async (
        input: SendMessageInput,
        acknowledge?: (result: Record<string, unknown>) => void,
      ) => {
        try {
          if (
            !input ||
            typeof input.recipientId !== 'string' ||
            !mongoose.isValidObjectId(input.recipientId) ||
            typeof input.text !== 'string'
          ) {
            acknowledge?.({ success: false, message: 'Invalid message data' })
            return
          }

          const text = input.text.trim()

          if (!text || text.length > 5000) {
            acknowledge?.({
              success: false,
              message: 'Message must contain 1-5000 characters',
            })
            return
          }

          if (input.recipientId === userId) {
            acknowledge?.({
              success: false,
              message: 'You cannot message yourself',
            })
            return
          }

          const recipient = await User.findById(input.recipientId).select('_id')

          if (!recipient) {
            acknowledge?.({ success: false, message: 'Recipient not found' })
            return
          }

          const saved = await Message.create({
            sender: userId,
            recipient: input.recipientId,
            text,
          })

          const message = {
            id: saved.id,
            senderId: userId,
            recipientId: input.recipientId,
            text: saved.text,
            createdAt: saved.createdAt,
          }

          io.to(`user:${userId}`)
            .to(`user:${input.recipientId}`)
            .emit('message:new', message)

          acknowledge?.({ success: true, message })
        } catch (error) {
          console.error('Message send error:', error)
          acknowledge?.({ success: false, message: 'Unable to send message' })
        }
      },
    )
  })

  return io
}
