const app = require("express")()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require("next")
const compression = require("compression")

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()
const port = dev ? 3000 : process.env.PORT


const socket = io({
  transports: ['websocket']
})

socket.on('connection', deltaSocket => {
  console.log("SERVER CONNECTED");
  deltaSocket.emit('connected', json({message: "Websocket client connected"}))
})

nextApp
  .prepare()
  .then(() => {
    // const server = express()
    // support gzip
    server.use(compression())

    server.get("*", (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
