
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errors } from 'celebrate'

import constants from './config/constants'
import routes from './routes'
import routines from './routines'

dotenv.config()
const app = express()

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

app.use(express.static(constants.directories.postsImages))

routines()

// celebrate errors
app.use(errors())

export default app
