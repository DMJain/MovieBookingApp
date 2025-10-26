const http = require('http')
const { Server } = require('socket.io')
const expressApplication = require('./app')
const connectMongoDB = require('./models')

const PORT = process.env.PORT ?? 8000

async function init() {
  try {
    await connectMongoDB(process.env.MONGODB_URI)
    console.log(`Mongodb Connected`)

    const server = http.createServer(expressApplication)
    
    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    // Make io available to the app
    expressApplication.set('io', io)

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Join a show room
      socket.on('join-show', (showId) => {
        socket.join(`show-${showId}`)
        console.log(`Socket ${socket.id} joined show-${showId}`)
      })

      // Leave a show room
      socket.on('leave-show', (showId) => {
        socket.leave(`show-${showId}`)
        console.log(`Socket ${socket.id} left show-${showId}`)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (err) {
    console.log(`Error starting server`, err)
    process.exit(1)
  }
}

init()

