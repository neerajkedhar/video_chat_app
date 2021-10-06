const express = require('express')
const app = express()
const http = require('http').createServer(app)

const io = require('socket.io')(http)
const { v4: uuidV4 } = require('uuid')
const PORT = process.env.PORT || 8080
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})