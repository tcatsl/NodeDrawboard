var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");
var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(700, 550)
  , context = canvas.getContext('2d');

var PORT = process.argv.length <= 2 ? 3331 : process.argv[2];
var drawHistory = [];



app.use("/assets/", express.static(__dirname + "/assets"));


app.get('/', function(request, response){
  response.sendFile(__dirname + "/index.html");
});


draw = io.of('/draw');
t = 0;
var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
mousetrack = io.of('/mousetrack')
draw.on("connection", function(socket) {

    	setTimeout(function(){socket.emit("image", image)}, 800);
    

    socket.on("image_recieved", function(){ 
    	setTimeout( function(){
			for (var thing in drawHistory) 
			socket.emit("draw_line", { line: drawHistory[thing] } ); console.log("client connected to /draw");
    

		}, 500);
	});
	
	socket.on("draw_line", function(data) {
		drawHistory.push(data.line);
		draw.emit("draw_line", { line: data.line }); 
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
});


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
};
	
	setInterval(function() {  
		if (drawHistory.length >= 500) {
			image = canvas.toDataURL(); console.log("backing up image"); drawHistory = [];
			}
		}, 60000); 



	
	socket.on('disconnect', function(){
    	console.log('client disconnected from /draw');
    	draw.emit('chat_message', 'user disconnected');
    });
    
    socket.on('chat_message', function(message) {
    	draw.emit('chat_message', message);
    });
});
  m_players = [];

  i = 0;

  mousetrack.on('connection', function(socket) {
  console.log("client connected to /mousetrack");

  socket.on('client_connected', function(data){
    data.id = socket.id;
    m_players[i] = data;
    i++;
    mousetrack.emit("send_data", m_players);
   });

   socket.on('update_coords', function(pos){

     for(var x=0; x < m_players.length; x++)
     {
       if (m_players[x].id == socket.id)
       {
         m_players[x].x = pos.x;
         m_players[x].y = pos.y;
         m_players[x].color = pos.color;
         break;
       }
     }

     mousetrack.emit("send_data", m_players);
   });

   socket.on('disconnect', function()
   {
     var j = 0;
     var n = 0;
     var tmp = [];

     while (n < m_players.length)
     {
       if (m_players[j].id == socket.id)
     	   n++;

     	 if (n < m_players.length)
     	 {
     	   tmp[j] = m_players[n];
     	   j++;
     	   n++;
     	  }
     	}

     	m_players = tmp;
     	i = j;
       mousetrack.emit('send_data', m_players);
       console.log("client disconnected from /mousetrack");
   });
});

http.listen(PORT, function(){
  console.log('listening on localhost:' + PORT);
});
