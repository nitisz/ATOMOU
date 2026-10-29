import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'node:http'
import { connectDatabase } from './config/database.js'
import authRouter from './routes/auth.js'
import messagesRouter from './routes/messages.js'
import { attachSocketServer } from './socket.js'
import usersRouter from './routes/users.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = Number(process.env.PORT) || 4001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://atomou.vercel.app'
  ],
}))


app.use(express.json({ limit: '16kb' }))

app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/users', usersRouter)

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'ATOMOU Auth Service',
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  })
})

attachSocketServer(httpServer)

async function startServer(): Promise<void> {
  try {
    await connectDatabase()

    httpServer.listen(PORT, () => {
      console.log(`ATOMOU Auth Service running at http://localhost:${PORT}`)
      console.log('ATOMOU real-time messaging is enabled')
    })
  } catch (error) {
    console.error('Failed to start ATOMOU Auth Service:', error)
    process.exit(1)
  }
}

void startServer()