
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 4001

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())

app.use('/api/auth', authRouter)

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: 'ATOMOU Auth Service',
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  })
})

async function startServer(): Promise<void> {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`ATOMOU Auth Service running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start ATOMOU Auth Service:', error)
    process.exit(1)
  }
}

void startServer()
