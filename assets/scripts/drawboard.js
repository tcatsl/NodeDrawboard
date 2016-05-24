document.addEventListener("DOMContentLoaded", function() {
	var mouse = {
		click: false,
		move: false,
		pos: {x:undefined, y:undefined},
		pos_prev: false
	}



	
	var canvas = document.getElementById("drawboard");
	var chatBox = document.getElementById("chat");
	canvas.width = 700;
	canvas.height = 550;
	var context = canvas.getContext("2d");


// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);

function handleMouseDown(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  // you can change the cursor if you want
  // just remember to handle the mouse up and put it back :)


  // rest of code goes here
}

document.addEventListener('mousedown', handleMouseDown, false);

	canvas.onmousedown = function(e) {
		mouse.click = true;
	};
	
	canvas.onmouseup = function(e) {
		mouse.click = false;
		mouse.pos_prev = undefined;
	};
	
	canvas.onmousemove = function(e) {
		mouse.pos.x = e.pageX;
		mouse.pos.y = e.pageY;
		mouse.move = true;
	};
	socket.on("get_image", function() {
		// get the dataURL in .png format
		var dataURL = document.getElementById("drawboard").toDataURL();
		socket.emit("send_image", dataURL)
	});

	socket.on("image", function(image){
		var img=new Image();	
		img.onload=start;
		img.src=image;
			function start(){
    		context.drawImage(img,0,0)
    		};
    	socket.emit("image_recieved"); 
    	});

	socket.on("draw_line", function draw(data) {
		var line = data.line;
		if (String(line[4]) == "square" || String(line[4]) == "round" || String(line[4]) == "butt"){
		context.beginPath();
		context.lineCap = String(line[4]);
		context.lineJoin = "round";
		context.lineWidth = line[3];
		context.strokeStyle = line[2];
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
		context.stroke();
	} else if (String(line[4]) == "spray"){
 	var line = data.line;
	context.lineWidth = line[3];
  var radius = context.lineWidth / 2;
  var area = radius * radius * Math.PI;
  var dotsPerTick = Math.ceil(area / 30);

  var currentPos = line[0];
  function spray3 () {
    for (var i = 0; i < dotsPerTick; i++) {
      var offset = randomPointInRadius(radius);
      context.fillStyle = line[2]
      context.fillRect(currentPos.x + offset.x,
                  currentPos.y + offset.y, 1, 1);
    }
  }; spray3();
};})

function randomPointInRadius(radius) {
  for (;;) {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    if (x * x + y * y <= 1)
      return {x: x * radius, y: y * radius};
  }
}

	
	
	function drawLoop() {
		if (mouse.click) {
			socket.emit("draw_line", { line: [mouse.pos, mouse.pos_prev, cl, dwidth, style] });
			mouse.move = false;
		}
		
		if (mouse.click) {mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};};
		setTimeout(drawLoop, 25);
	}
	
	drawLoop();
	context.fillStyle = 'rgb(255,255,255)';
   	context.beginPath();
   	context.fillRect(0, 0, drawboard.width, drawboard.height);;
   	context.closePath();
   	context.fill();
});
