/* global io */
var context = document.getElementById('whiteboard').getContext('2d');
var socket = io();
var paint = false;
var lastX, lastY;

$('#whiteboard').mousedown(function (e) {
  var x = e.pageX - $(this).offset().left;
  var y = e.pageY - $(this).offset().top;
  paint = true;
  draw(x, y, false);
});

$('#whiteboard').mousemove(function (e) {
  if (paint) {
    draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
  }
});

$('#whiteboard').mouseup(function (e) {
  paint = false;
});

$('#whiteboard').mouseleave(function (e) {
  paint = false;
});

function draw(x, y, dragging) {
  socket.emit('draw', lastX, lastY, x, y, dragging);
  lastX = x;
  lastY = y;
}

socket.on('remoteDraw', function (remoteLastX, remoteLastY, remoteX, remoteY, remoteDragging) {
  if (remoteDragging) {
    context.beginPath();
    context.strokeStyle = '#ff0000';
    context.lineJoin = 'round';
    context.lineWidth = 10;
    context.moveTo(remoteLastX, remoteLastY);
    context.lineTo(remoteX, remoteY);
    context.closePath();
    context.stroke();
  }
});