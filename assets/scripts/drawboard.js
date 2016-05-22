document.addEventListener("DOMContentLoaded", function() {
	var mouse = {
		click: false,
		move: false,
		pos: {x:0, y:0},
		pos_prev: false
	}
	
	var canvas = document.getElementById("drawboard");
	var chatBox = document.getElementById("chat");
	canvas.width = 700;
	canvas.height = 550;
	var context = canvas.getContext("2d");

	canvas.onmousedown = function(e) {
		mouse.click = true;
	};
	
	canvas.onmouseup = function(e) {
		mouse.click = false;
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

	socket.on("draw_line", function(data) {
		var line = data.line;
		context.beginPath();
		context.lineCap = String(line[4]);
		context.lineJoin = "round";
		context.lineWidth = line[3];
		context.strokeStyle = line[2];
		context.moveTo(line[0].x, line[0].y);
		context.lineTo(line[1].x, line[1].y);
		context.stroke();
	});
	
	
	function drawLoop() {
		if (mouse.click && mouse.move && mouse.pos_prev) {
			socket.emit("draw_line", { line: [mouse.pos, mouse.pos_prev, cl, dwidth, style] });
			mouse.move = false;
		}
		
		mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
		setTimeout(drawLoop, 25);
	}
	
	drawLoop();
	context.fillStyle = 'rgb(255,255,255)';
   	context.beginPath();
   	context.fillRect(0, 0, drawboard.width, drawboard.height);;
   	context.closePath();
   	context.fill();
});
