/* global io */
var can = document.getElementById('whiteboard');
var context = can.getContext('2d');
var socket = io();
var paint = false;
var lastX, lastY;
var color = '#000000';
var penWidth = 10;

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

$('#whiteboard').mouseup(function () {
  paint = false;
});

$('#whiteboard').mouseleave(function () {
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

can.addEventListener('touchcancel', function () {
  paint = false;
});

$('.settings #colorPicker').on('change', function () {
  color = $(this).val();
});

$('.settings #sizePicker').on('change', function () {
  penWidth = $(this).val();
});

$('.settings #clear').on('click', function () {
  socket.emit('clear');
});

function draw(x, y, dragging) {
  socket.emit('draw', lastX, lastY, x, y, dragging, color, penWidth);
  lastX = x;
  lastY = y;
}

socket.on('remoteDraw', function (remoteLastX, remoteLastY, remoteX, remoteY, remoteDragging, remoteColor, remoteWidth) {
  if (remoteDragging) {
    context.beginPath();
    context.strokeStyle = remoteColor;
    context.lineJoin = 'round';
    context.lineWidth = remoteWidth;
    context.moveTo(remoteLastX, remoteLastY);
    context.lineTo(remoteX, remoteY);
    context.closePath();
    context.stroke();
  }
});

socket.on('remoteClear', function () {
  context.clearRect(0, 0, can.width, can.height);
});
