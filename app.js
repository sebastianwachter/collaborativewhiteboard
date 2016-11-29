const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const randomString = require('randomstring');

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/public/saved/:fileName', (req, res) => {
  res.sendFile(`/public/saved/${req.params.fileName}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('draw', (obj) => {
    io.emit('remoteDraw', obj, { for: 'everyone' });
  });

  socket.on('clear', () => {
    io.emit('remoteClear', { for: 'everyone' });
  });

  socket.on('save', (imgData) => {
    let rawData = imgData.replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(rawData, 'base64');
    let location = `/public/saved/${randomString.generate(10)}.png`;
    fs.writeFileSync(__dirname + location, buf);
    socket.emit('download', location);
  });
});

http.listen(3000, () => {
  console.log('server running at :3000');
});
