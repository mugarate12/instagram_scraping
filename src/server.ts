import http from 'http'
import app from './app'

const server = http.createServer(app)
const PORT = !process.env.PORT ? 3333 :  process.env.PORT

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
