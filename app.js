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
  res.writeHead(200, {
    'Content-Disposition': 'attachment; filename=' + req.params.fileName + '; modification-date="Wed, 12 Feb 1997 25:00:00 -0500"'
  });
  res.render('index');
  /*

  */
  //res.attachment(`/public/saved/${req.params.fileName}`);

  /*
  http.get(app, (response) => {

    response.pipe(res);
  }).on('error', (err) => {
    res.send(500, err.message);
  });
  */
  /*
  require('http').get('http://localhost:1234/', function(response) {
    response.pipe(res);
  }).on('error', function(err) {
    res.send(500, err.message);
  });
  */
  /*
  response.writeHead(200, {
    'Content-Disposition': 'attachment; filename=genome.jpeg; modification-date="Wed, 12 Feb 1997 16:29:51 -0500"'
  });
  */
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
    let shortLocation = `/saved/${randomString.generate(10)}.png`;
    let location = `/public${shortLocation}`;
    fs.writeFile(__dirname + location, buf, () => {
      socket.emit('download', shortLocation);
    });
  });
});

http.listen(3000, () => {
  console.log('server running at :3000');
});
