function draw(t,e,n){socket.emit("draw",lastX,lastY,t,e,n,color,penWidth),lastX=t,lastY=e}var can=document.getElementById("whiteboard"),context=can.getContext("2d"),socket=io(),paint=!1,lastX,lastY,color="#000000",penWidth=10;$("#whiteboard").mousedown(function(t){var e=t.pageX-$(this).offset().left,n=t.pageY-$(this).offset().top;paint=!0,draw(e,n,!1)}),$("#whiteboard").mousemove(function(t){paint&&draw(t.pageX-$(this).offset().left,t.pageY-$(this).offset().top,!0)}),$("#whiteboard").mouseup(function(){paint=!1}),$("#whiteboard").mouseleave(function(){paint=!1}),can.addEventListener("touchstart",function(t){t.preventDefault(),paint=!0,draw(t.targetTouches[0].pageX-$(this).offset().left,t.targetTouches[0].pageY-$(this).offset().top,!1)},!1),can.addEventListener("touchmove",function(t){t.preventDefault(),paint&&draw(t.targetTouches[0].pageX-$(this).offset().left,t.targetTouches[0].pageY-$(this).offset().top,!0)},!0),can.addEventListener("touchend",function(t){t.preventDefault(),paint=!1},!1),can.addEventListener("touchcancel",function(){paint=!1}),$(".settings #colorPicker").on("change",function(){color=$(this).val()}),$(".settings #sizePicker").on("change",function(){penWidth=$(this).val()}),$(".settings #clear").on("click",function(){socket.emit("clear")}),socket.on("remoteDraw",function(t,e,n,o,a,c,i){a&&(context.beginPath(),context.strokeStyle=c,context.lineJoin="round",context.lineWidth=i,context.moveTo(t,e),context.lineTo(n,o),context.closePath(),context.stroke())}),socket.on("remoteClear",function(){context.clearRect(0,0,can.width,can.height)});