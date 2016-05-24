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
    clientY: touch.clientY
  });
  document.body.dispatchEvent(mouseEvent);
}, false);
var socket2 = io('/mousetrack');
 
socket2.on('connect', function () {
  socket2.emit('client_connected', pl);
});
$('body').mousemove(function(event){
  var pos = {
    x: event.pageX + 2,
    y: event.pageY + 2,
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
