

        var style = String($("input[name=style]:checked", "#styles").val());
          var mouse = {
    click: false,
    move: false,
    pos: {x:undefined, y:undefined},
    pos_prev: {x:undefined, y:undefined}
  }
$('#styles input').on('change', function() {style = String($('input[name=style]:checked', '#styles').val());}
);
document.getElementById("styles").onclick = function (){mouse.pos.y = undefined; mouse.pos.x = undefined; mouse.pos_prev.x = undefined; mouse.pos_prev.y = undefined;}

  var dwidth = 2;
  var canvas = document.getElementById("drawboard");
  var chatBox = document.getElementById("chat");
  canvas.width = 700;
  canvas.height = 550;
  var context = canvas.getContext("2d");
// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
if (e.touches.length > 1) {mouse.pos_prev.x = undefined; mouse.pos_prev.y = undefined; clearTimeout(timer); return true;}
else  {var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}}, false);
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
var stuff = document.getElementById("stuff")
var slider1 = document.getElementById("slider-1")
document.body.addEventListener("touchstart", function (e) {
  if (e.touches.length > 0){ return true;}
  else if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.touches.length > 1){mouse.click = false; mouse.pos_prev.x = undefined; mouse.pos_prev.y = undefined; return true;}
  else if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.touches.length > 0){return true;}
  else if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.onselectstart = function() {return false;};
stuff.addEventListener("touchstart", function (e) {
  if (e.touches.length > 1){return true;}
  else {
  
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY

  });
  stuff.dispatchEvent(mouseEvent); e.preventDefault();
}}, false);
stuff.addEventListener("touchend", function (e) {
  if (e.touches.length > 0){return true;}
  else {
  var mouseEvent = new MouseEvent("mouseup", {});
  stuff.dispatchEvent(mouseEvent); e.preventDefault();
}}, false);
stuff.addEventListener("touchmove", function (e) {
  if (e.touches.length > 1) {return true;} else {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  stuff.dispatchEvent(mouseEvent); e.preventDefault();
}}, false);
var timer
  canvas.onmousedown = function(e) {
    var rect = canvas.getBoundingClientRect(); if (String(style) !== "line" && String(style) !== "rectangle" && String(style) !== "ellipse") {
    mouse.pos.x = e.clientX - rect.left;
    mouse.pos.y = e.clientY - rect.top;
    clearTimeout(timer); timer = setTimeout(function() {mouse.click = true;}, 0);
  } else { if (mouse.pos_prev.x == undefined && mouse.pos_prev.y == undefined){
    mouse.pos_prev.x = e.clientX - rect.left;
    mouse.pos_prev.y = e.clientY - rect.top; mouse.pos.x = undefined; mouse.pos.y = undefined; return;}
    else if ((!mouse.pos.x) && (!mouse.pos.y)) {
    mouse.pos.x = e.clientX - rect.left;
    mouse.pos.y = e.clientY - rect.top; mouse.click = true; setTimeout( function() {mouse.pos.y = undefined; mouse.pos.x = undefined; mouse.pos_prev.x = undefined; mouse.pos_prev.y = undefined; mouse.click = false;}, 25)
    }}};
  
  canvas.onmouseup = function(e) { if (String(style) !== "line" && String(style) !== "rectangle" && String(style) !== "ellipse") {
    mouse.click = false;
    mouse.pos_prev.x = undefined;
    mouse.pos_prev.y = undefined;
  }};

  canvas.onmousemove = function(e) { if (String(style) !== "line" && String(style) !== "rectangle" && String(style) !== "ellipse") {
   var rect = canvas.getBoundingClientRect(); 
    mouse.pos.x = e.clientX - rect.left;
    mouse.pos.y = e.clientY - rect.top;
    mouse.move = true;
  }};

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
    if (String(line[4]) == "square" || String(line[4]) == "round" || String(line[4]) == "butt"){ if ((line[1].x) && (line[1].y)) {
    context.beginPath();
    context.lineCap = String(line[4]);
    context.lineJoin = "round";
    context.lineWidth = line[3];
    context.strokeStyle = line[2];
    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[1].x, line[1].y);
    context.stroke();
} else if (line[3] > 1){
    context.beginPath();
    context.lineCap = String(line[4]);
    context.lineJoin = "round";
    context.lineWidth = line[3];
    context.strokeStyle = line[2];
    context.moveTo(line[0].x, line[0].y);
    context.lineTo(line[0].x, line[0].y + .01);
    context.stroke();

  } else 
{
context.fillStyle = line[2];
context.fillRect(line[0].x,line[0].y,1,1); }} else if (String(line[4]) == "spray"){
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
} else if (line[4] == "line"){
  context.beginPath();
  context.strokeStyle = line[2];
  context.lineWidth = line[3];
  context.lineCap = "butt"
  context.moveTo(line[1].x, line[1].y);
    context.lineTo(line[0].x, line[0].y);
     context.stroke();
} else if (line[4] == "rectangle")
{   context.strokeStyle = line[2];
  context.lineWidth = line[3];
  context.lineJoin = "miter";
  context.strokeRect(line[1].x,line[1].y,line[0].x - line[1].x,line[0].y - line[1].y);

}
else if (line[4] == "ellipse"){
  context.beginPath();
  context.strokeStyle = line[2];
  context.lineWidth = line[3];
  ellipse((line[1].x + line[0].x)/2,(line[1].y + line[0].y)/2,line[0].x - line[1].x, line[0].y - line[1].y);
} else if (line[4] == "fill"){ 
var rgb2 = line[2].replace(/[^\d,]/g, '').split(','); var rgba = [Number(rgb2[0]), Number(rgb2[1]), Number(rgb2[2]), 255]; floodFillLinear(canvas, line[0].x, line[0].y, rgba, 40);
}
})

function floodFillLinear(canvas, x, y, fillColor, tolerance) {
	/**
	 * 相关数据准备
	 */
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext("2d");
	var pixelData = context.getImageData(0, 0, canvas.width, canvas.height);
	var pixelsChecked = new Array(width * height);
	var startIdx = (width * y + x) * 4;
	var startColor = [ pixelData.data[startIdx], pixelData.data[startIdx + 1],
			pixelData.data[startIdx + 2], pixelData.data[startIdx + 3] ];
	if (startColor[0] == 0 && startColor[1] == 0 && startColor[2] == 0
			&& startColor[3] == 255) {
		return;
	}
	var ranges = new Queue();

	/**
	 * 算法执行
	 */
	LinearFill(x, y);

	var range;

	while (!ranges.empty()) {
		range = ranges.dequeue();

		var downPxIdx = (width * (range.Y + 1)) + range.startX;
		var upPxIdx = (width * (range.Y - 1)) + range.startX;
		var upY = range.Y - 1;
		var downY = range.Y + 1;

		for (var i = range.startX; i <= range.endX; i++) {
			if (range.Y > 0 && (!pixelsChecked[upPxIdx]) && CheckPixel(upPxIdx)) {
				LinearFill(i, upY);
			}

			if (range.Y < (height - 1) && (!pixelsChecked[downPxIdx])
					&& CheckPixel(downPxIdx)) {
				LinearFill(i, downY);
			}

			downPxIdx++;
			upPxIdx++;
		}
	}

	/**
	 * 将结果进行渲染
	 */
	context.putImageData(pixelData, 0, 0, 0, 0, width, height);

	function LinearFill(x, y) {
		var lFillLoc = x;
		var pxIdx = width * y + x;

		while (true) {
			SetPixel(pxIdx, fillColor);
			pixelsChecked[pxIdx] = true;
			lFillLoc--;
			pxIdx--;
			if (lFillLoc < 0 || (pixelsChecked[pxIdx]) || !CheckPixel(pxIdx)) {
				break;
			}
		}

		lFillLoc++;

		rFillLoc = x;
		pxIdx = (width * y) + x;
		while (true) {
			SetPixel(pxIdx, fillColor);
			pixelsChecked[pxIdx] = true;
			rFillLoc++;
			pxIdx++;
			if (rFillLoc >= width || pixelsChecked[pxIdx] || !CheckPixel(pxIdx)) {
				break;
			}
		}

		rFillLoc--;

		var r = new FloodFillRange(lFillLoc, rFillLoc, y);
		ranges.enqueue(r);
	}

	function SetPixel(pxIdx, color) {
		pixelData.data[pxIdx * 4] = color[0];
		pixelData.data[pxIdx * 4 + 1] = color[1];
		pixelData.data[pxIdx * 4 + 2] = color[2];
		pixelData.data[pxIdx * 4 + 3] = color[3];
	}

	function FloodFillRange(startX, endX, Y) {
		this.startX = startX;
		this.endX = endX;
		this.Y = Y;
	}

	function CheckPixel(px) {
		var red = pixelData.data[px * 4];
		var green = pixelData.data[px * 4 + 1];
		var blue = pixelData.data[px * 4 + 2];
		var alpha = pixelData.data[px * 4 + 3];

		return (red >= (startColor[0] - tolerance)
				&& red <= (startColor[0] + tolerance)
				&& green >= (startColor[1] - tolerance)
				&& green <= (startColor[1] + tolerance)
				&& blue >= (startColor[2] - tolerance)
				&& blue <= (startColor[2] + tolerance)
				&& alpha >= (startColor[3] - tolerance) && alpha <= (startColor[3] + tolerance));
	}
}

function Queue() {
	this.dataStore = [];
}

Queue.prototype = {

	// 向队尾添加一个元素
	enqueue : function(element) {
		this.dataStore.push(element);
	},
	// 删除队首的元素
	dequeue : function() {
		return this.dataStore.shift();
	},
	// 读取队首的元素
	front : function() {
		return this.dataStore[0];
	},
	// 读取队尾的元素
	back : function() {
		return this.dataStore[this.dataStore.length - 1];
	},
	// 显示队列内的所有元素
	toString : function() {
		var retStr = "";
		for (var i = 0; i < this.dataStore.length; ++i) {
			retStr += this.dataStore[i] + "\n";
		}
		return retStr;
	},
	// 判断队列是否为空
	empty : function() {
		if (this.dataStore.length == 0) {
			return true;
		} else {
			return false;
		}
	}

};

function ellipse(cx, cy, w, h){      
    var ctx = canvas.getContext('2d');
    var lx = cx - w/2,
        rx = cx + w/2,
        ty = cy - h/2,
        by = cy + h/2;
    var magic = 0.551784;
    var xmagic = magic*w/2;
    var ymagic = h*magic/2;
    ctx.moveTo(cx,ty);
    ctx.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
    ctx.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
    ctx.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
    ctx.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
    ctx.stroke();
}

function randomPointInRadius(radius) {
  for (;;) {
    var x = Math.random() * 2 - 1;
    var y = Math.random() * 2 - 1;
    if (x * x + y * y <= 1)
      return {x: x * radius, y: y * radius};
  }
}

function getPixelColor(x, y) {
        var pxData = context.getImageData(x,y,1,1);
        $("#slider-1").slider('value',pxData.data[0]);
        $("#slider-2").slider('value',pxData.data[1]);
        $("#slider-3").slider('value',pxData.data[2]);
        r = pxData.data[0];
        g = pxData.data[1];
        b = pxData.data[2];
        cl = 'rgb('+r+','+g+','+b+')';
        pos.color = cl
        drawOnCanvas();
        socket2.emit('update_coords', pos);
    }
  
  
  function drawLoop() {
    if ((mouse.click) && (style == "square" || style == "round" || style == "spray" || style == "butt" || style == "line" || style == "rectangle" || style == "ellipse" || style == "fill")){
      socket.emit("draw_line", { line: [mouse.pos, mouse.pos_prev, cl, dwidth, style] });
      mouse.move = false;
    } else if (mouse.click && style == "color-select") {getPixelColor(mouse.pos.x, mouse.pos.y)}
    
    if (mouse.click && String(style) !== "line" && String(style) !== "rectangle" && String(style) !== "ellipse") {mouse.pos_prev.x = mouse.pos.x; mouse.pos_prev.y = mouse.pos.y;}
    setTimeout(drawLoop, 25);
  }
  
  drawLoop();
  context.fillStyle = 'rgb(255,255,255)';
    context.beginPath();
    context.fillRect(0, 0, drawboard.width, drawboard.height);
    context.closePath();
    context.fill();