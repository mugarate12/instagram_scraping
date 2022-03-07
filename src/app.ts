
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { errors } from 'celebrate'

import routes from './routes'

dotenv.config()
const app = express()
const server = http.createServer(app)

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

const PORT = !process.env.PORT ? 3333 :  process.env.PORT

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
