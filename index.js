var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var path = require("path");

var PORT = process.argv.length <= 2 ? 3331 : process.argv[2];
var drawHistory = [];

app.use("/assets/", express.static(__dirname + "/assets"));

app.get('/', function(request, response){
  response.sendFile(__dirname + "/index.html");
});
draw = io.of('/draw');
draw_players = []
t = 0;
var image;
mousetrack = io.of('/mousetrack')
draw.on("connection", function(socket) {

	console.log("client connected to /draw");
    draw_players.push(socket);
    	setTimeout(function(){socket.emit("image", image)}, 10);
    

    socket.on("image_recieved", function(){ 
    	setTimeout( function(){
			for (var thing in drawHistory) 
			socket.emit("draw_line", { line: drawHistory[thing] } )
		}, 500);
	});
	
	socket.on("draw_line", function(data) {
		drawHistory.push(data.line);
		draw.emit("draw_line", { line: data.line } );
	});
	
	setInterval(function() { 
		var randomClient; 
		if (drawHistory.length >= 3000 && draw_players.length > 0) {
			randomClient = Math.floor(Math.random() * draw_players.length);
			draw_players[randomClient].emit("get_image"); console.log("calling for image"); drawHistory = []; 
			}
		}, 30000); 

	socket.on("send_image", function(dataURL) {
		image = dataURL; console.log("image recieved");});
	
	socket.on('disconnect', function(){
    	console.log('client disconnected from /draw');
    	draw.emit('chat_message', 'user disconnected');
    	var index = draw_players.indexOf(socket);
        if (index != -1) {
            draw_players.splice(index, 1);
        }
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
    mousetrack.emit("send_data", m_players)
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
