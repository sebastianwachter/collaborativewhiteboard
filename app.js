const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('draw', (obj) => {
    io.emit('remoteDraw', obj, { for: 'everyone' });
  });

  socket.on('clear', () => {
    io.emit('remoteClear', { for: 'everyone' });
  });
});

http.listen(3000, () => {
  console.log('server running at :3000');
});
