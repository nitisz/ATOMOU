
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const router = Router()

function createToken(userId: string): string {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters')
  }

  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' })
}

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body ?? {}

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof displayName !== 'string'
    ) {
      return res.status(400).json({
        message: 'Username, email, password and display name are required',
      })
    }

    const cleanUsername = username.trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()
    const cleanDisplayName = displayName.trim()

    if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
      return res.status(400).json({
        message: 'Username must be 3-30 characters: letters, numbers or underscores',
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: 'Enter a valid email address' })
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: 'Password must contain 8-72 characters',
      })
    }

    if (!cleanDisplayName || cleanDisplayName.length > 50) {
      return res.status(400).json({
        message: 'Display name must contain 1-50 characters',
      })
    }

    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    })

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email is already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      displayName: cleanDisplayName,
    })

    const token = createToken(user.id)

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: 'Username or email is already registered',
      })
    }

    console.error('Signup error:', error)
    return res.status(500).json({ message: 'Unable to create account' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {}

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const token = createToken(user.id)

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Unable to log in' })
  }
})

export default router
