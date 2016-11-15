var express = require("express");
var app = express();
var app2 = express();
var http = require("http").Server(app);
var http2 = require("http").Server(app2);
var io = require("socket.io")(http);
var io2 = require("socket.io")(http2);
var path = require("path");

var PORT = process.argv.length <= 2 ? 3331 : process.argv[2];
var drawHistory = [];

app.use("/assets/", express.static(__dirname + "/assets"));
app2.use("/assets/", express.static(__dirname + "/assets"));

app.get('/', function(request, response){
  response.sendFile(__dirname + "/index.html");
});
app2.get('/', function(request, response){
  response.sendFile(__dirname + "/index2.html");
});

draw = io.of('/draw');
draw2 = io2.of('/draw');
t = 0;
var image = 'data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==;';
mousetrack = io.of('/mousetrack')
mousetrack2 = io2.of('/mousetrack')
draw2.on("connection", function(socket){
		console.log("you connected to /draw2");
		    	setTimeout(function(){socket.emit("image", image)}, 10);
    
    socket.on('pingcheck', function(){socket.emit('pongcheck')});
    socket.on("image_recieved", function(){ 
    	setTimeout( function(){
			for (var thing in drawHistory) 
			socket.emit("draw_line", { line: drawHistory[thing] } );
    

		}, 500);  setTimeout(function(){draw2.emit('chat_message', 'user connected to draw2');}, 3000);
	});
	
		socket.on("send_image", function(dataURL) {
		image = dataURL; console.log("image recieved");});

			socket.on("draw_line", function(data) {
		drawHistory.push(data.line);
		draw.emit("draw_line", { line: data.line }); 
		draw2.emit("draw_line", { line: data.line });
	});
			socket.on('disconnect', function(){
    	console.log('you disconnected from /draw2');
    	draw.emit('chat_message', 'user disconnected');
    	draw2.emit('chat_message', 'user disconnected')
    });
    
    socket.on('chat_message', function(message) {
    	draw.emit('chat_message', message);
    	draw2.emit('chat_message', message);
    });
});

draw.on("connection", function(socket) {

    	setTimeout(function(){socket.emit("image", image)}, 10);
    

    socket.on("image_recieved", function(){ 
    	setTimeout( function(){
			for (var thing in drawHistory) 
			socket.emit("draw_line", { line: drawHistory[thing] } ); console.log("client connected to /draw");
    

		}, 500);
	});
	
	socket.on("draw_line", function(data) {
		drawHistory.push(data.line);
		draw.emit("draw_line", { line: data.line }); 
		draw2.emit("draw_line", { line: data.line });
	});
	
	setInterval(function() {  
		if (drawHistory.length >= 1000) {
			draw2.emit("get_image"); console.log("calling for image");  drawHistory = []; 
			}
		}, 60000); 



	
	socket.on('disconnect', function(){
    	console.log('client disconnected from /draw');
    	draw.emit('chat_message', 'user disconnected');
    	draw2.emit('chat_message', 'user disconnected')
    });
    
    socket.on('chat_message', function(message) {
    	draw.emit('chat_message', message);
    	draw2.emit('chat_message', message);
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
    mousetrack2.emit("send_data", m_players);
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
     mousetrack2.emit("send_data", m_players);
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
       mousetrack2.emit("send_data", m_players);
       console.log("client disconnected from /mousetrack");
   });
});

http2.listen(3332, function(){console.log('listening on localhost:' + 3332);
});
http.listen(PORT, function(){
  console.log('listening on localhost:' + PORT);
});
