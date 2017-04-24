/* global io WhiteBoard */

var socket = io();
var options = {
  id: 'whiteboard0',
  width: $('.settings #sizePicker').val(),
  socket: socket,
  color: $('.settings #colorPicker').val()
};
new WhiteBoard(options);

var options2 = {
  id: 'whiteboard1',
  width: $('.settings #sizePicker').val(),
  socket: socket,
  color: $('.settings #colorPicker').val()
};
new WhiteBoard(options2);

var options3 = {
  id: 'whiteboard2',
  width: $('.settings #sizePicker').val(),
  socket: socket,
  color: $('.settings #colorPicker').val()
};
new WhiteBoard(options3);
