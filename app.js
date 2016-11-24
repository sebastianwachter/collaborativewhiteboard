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
  socket.on('draw', function (lastX, lastY, x, y, dragging, color) {
    io.emit('remoteDraw', lastX, lastY, x, y, dragging, color, { for: 'everyone'});
  });
});

http.listen(3000, () => {
  console.log('server running at :3000');
});