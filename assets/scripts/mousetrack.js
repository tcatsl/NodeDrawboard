var name = 'User' + Math.round(Math.random() * 255);
var r = Math.round(Math.random() * 255);
var g = Math.round(Math.random() * 255);
var b = Math.round(Math.random() * 255);
var cl = 'rgb('+r+','+g+','+b+')';
if(name == '') name = 'Anonymous';
var pl = 
{
  id: 0,
  name: name,
  color: cl,
  x: 0,
  y: 0
};
document.body.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
    pageX: touch.pageX,
    pageY: touch.pageY
  });
  document.body.dispatchEvent(mouseEvent);
}, false);
var socket2 = io('/mousetrack');
 
socket2.on('connect', function () {
  socket2.emit('client_connected', pl);
});
var canvas;
var rect;
var pos;
$('body').mousemove(function(event){
canvas = document.getElementById("drawboard");
rect = canvas.getBoundingClientRect();  
pos = {
    x: event.clientX + 2 - rect.left,
    y: event.clientY + 2 - rect.top,
    color: cl
  };
  socket2.emit('update_coords', pos);
});
$('#drawboard').mousedown(function(event){
canvas = document.getElementById("drawboard");
  rect = canvas.getBoundingClientRect();  
  pos = {
    x: event.clientX + 2 - rect.left,
    y: event.clientY + 2 - rect.top,
    color: cl
      };
  socket2.emit('update_coords', pos);
});
socket2.on('send_data', function(data){
  var i=0;
  $('#zone').html('');
  while(i < data.length)
  {
    var me = '';
    if( data[i].id == pl.id ) me = 'You';
    player = '<div class="player" id="p_' + data[i].id + '" style="background: ' + data[i].color + '  ;left:' + data[i].x + 'px;top:' + data[i].y +'px"> ' + me + '</div>';
    $('#zone').append(player);
    i++;
  }
});