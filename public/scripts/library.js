'use strict';
var WhiteBoard = function (options) {
  this.canvasID = options.id;
  this.width = options.brushSize;
  this.socket = options.socket;
  this.color = options.defaultColor;
  this.lastX, this.lastY;
  this.init(this.canvasID);
  return (this.can);
};

WhiteBoard.prototype.init = function (canvasID) {
  var self = this;
  this.pressed = false;
  this.can = document.getElementById(canvasID);
  this.ctx = this.can.getContext('2d');
  var canRect = this.can.getBoundingClientRect();
  this.offset = { top: canRect.top + document.body.scrollTop, left: canRect.left + document.body.scrollLeft };

  this.can.addEventListener('mousedown', this.mouseDown.bind(this), false);
  this.can.addEventListener('mousemove', this.mouseMove.bind(this), false);
  this.can.addEventListener('mouseup', this.mouseUp.bind(this), false);

  this.can.addEventListener('touchstart', this.touchDown.bind(this), false);
  this.can.addEventListener('touchmove', this.touchMove.bind(this), true);
  this.can.addEventListener('touchend', this.touchUp.bind(this), false);
  this.can.addEventListener('touchcancel', this.touchUp.bind(this), false);

  this.socket.on('remoteDraw', function (remoteDrawObject) {
    if (remoteDrawObject.dragging) {
      self.ctx.beginPath();
      self.ctx.strokeStyle = remoteDrawObject.color;
      self.ctx.lineJoin = 'round';
      self.ctx.lineWidth = remoteDrawObject.penWidth;
      self.ctx.moveTo(remoteDrawObject.lastX, remoteDrawObject.lastY);
      self.ctx.lineTo(remoteDrawObject.x, remoteDrawObject.y);
      self.ctx.closePath();
      self.ctx.stroke();
    }
  });

  this.socket.on('remoteClear', function () {
    self.ctx.clearRect(0, 0, this.can.width, this.can.height);
  });
};

WhiteBoard.prototype.mouseDown = function (e) {
  this.pressed = true;
  var currentX = e.pageX - this.offset.left;
  var currentY = e.pageY - this.offset.top;
  this.draw(currentX, currentY, false);
};

WhiteBoard.prototype.mouseMove = function (e) {
  if (this.pressed) {
    var currentX = e.pageX - this.offset.left;
    var currentY = e.pageY - this.offset.top;
    this.draw(currentX, currentY, true);
  }
};

WhiteBoard.prototype.mouseUp = function (e) {
  this.pressed = false;
};

WhiteBoard.prototype.touchDown = function (e) {
  e.preventDefault();
  this.pressed = true;
  var currentX = e.targetTouches[0].pageX - this.offset.left;
  var currentY = e.targetTouches[0].pageY - this.offset.top;
  this.draw(currentX, currentY, false);
};

WhiteBoard.prototype.touchMove = function (e) {
  e.preventDefault();
  if (this.pressed) {
    var currentX = e.targetTouches[0].pageX - this.offset.left;
    var currentY = e.targetTouches[0].pageY - this.offset.top;
    this.draw(currentX, currentY, true);
  }
};

WhiteBoard.prototype.touchUp = function (e) {
  this.pressed = false;
};

WhiteBoard.prototype.clear = function () {
  this.socket.emit('clear');
};

WhiteBoard.prototype.changeColor = function (color) {
  this.color = color;
};

WhiteBoard.prototype.changeBrushSize = function (size) {
  this.width = size;
};

WhiteBoard.prototype.draw = function (x, y, dragging) {
  var drawObject = {};
  drawObject.lastX = this.lastX;
  drawObject.lastY = this.lastY;
  drawObject.x = x;
  drawObject.y = y;
  drawObject.dragging = dragging;
  drawObject.color = this.color;
  drawObject.brushSize = this.width;
  this.socket.emit('draw', drawObject);
  this.lastX = x;
  this.lastY = y;
};