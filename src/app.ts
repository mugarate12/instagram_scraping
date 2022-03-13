
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { errors } from 'celebrate'

import init from './database'
import routes from './routes'

dotenv.config()
const app = express()
init()

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['*'],
  exposedHeaders: ['Authorization', 'Content-Type', 'Content-Disposition', 'Access-Control-Allow-Headers', 'Origin', 'Accept', 'X-Requested-With', 'filename'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(express.json())

app.use(routes)

// celebrate errors
app.use(errors())

export default app
