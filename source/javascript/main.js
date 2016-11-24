/* global io */
var can = document.getElementById('whiteboard');
var context = can.getContext('2d');
var socket = io();
var paint = false;
var lastX, lastY;
var color = '#000000';

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

can.addEventListener('touchstart', function (e) {
  e.preventDefault();
  paint = true;
  draw(e.targetTouches[0].pageX - $(this).offset().left, e.targetTouches[0].pageY - $(this).offset().top, false);
}, false);

can.addEventListener('touchmove', function (e) {
  e.preventDefault();
  if (paint) {
    draw(e.targetTouches[0].pageX - $(this).offset().left, e.targetTouches[0].pageY - $(this).offset().top, true);
  }
}, true);

can.addEventListener('touchend', function (e) {
  e.preventDefault();
  paint = false;
}, false);

can.addEventListener('touchcancel', function (e) {
  paint = false;
});

function draw(x, y, dragging) {
  socket.emit('draw', lastX, lastY, x, y, dragging, color);
  lastX = x;
  lastY = y;
}

socket.on('remoteDraw', function (remoteLastX, remoteLastY, remoteX, remoteY, remoteDragging, remoteColor) {
  if (remoteDragging) {
    context.beginPath();
    context.strokeStyle = remoteColor;
    context.lineJoin = 'round';
    context.lineWidth = 10;
    context.moveTo(remoteLastX, remoteLastY);
    context.lineTo(remoteX, remoteY);
    context.closePath();
    context.stroke();
  }
});