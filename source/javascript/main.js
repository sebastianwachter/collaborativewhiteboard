/* global io */
var can = document.getElementById('whiteboard');
var context = can.getContext('2d');
var socket = io();
var paint = false;
var lastX, lastY;
var color = '#000000';
var penWidth = 10;

context.fillStyle = '#ffffff';
context.fillRect(0, 0, can.width, can.height);

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

$('.settings #save').on('click', function () {
  var imgData = can.toDataURL();
  socket.emit('save', imgData);
});

function draw(x, y, dragging) {
  var drawObject= {};
  drawObject.lastX = lastX;
  drawObject.lastY = lastY;
  drawObject.x = x;
  drawObject.y = y;
  drawObject.dragging = dragging;
  drawObject.color = color;
  drawObject.penWidth = penWidth;
  socket.emit('draw', drawObject);
  lastX = x;
  lastY = y;
}

socket.on('remoteDraw', function (remoteDrawObject) {
  if (remoteDrawObject.dragging) {
    context.beginPath();
    context.strokeStyle = remoteDrawObject.color;
    context.lineJoin = 'round';
    context.lineWidth = remoteDrawObject.penWidth;
    context.moveTo(remoteDrawObject.lastX, remoteDrawObject.lastY);
    context.lineTo(remoteDrawObject.x, remoteDrawObject.y);
    context.closePath();
    context.stroke();
  }
});

socket.on('remoteClear', function () {
  context.fillRect(0, 0, can.width, can.height);
});

socket.on('download', function (file) {
  console.log(file);
  window.location.assign(file);
  /*
  $.ajax({
    type: 'GET',
    url: file,
    async: true,
  });
  */
});
