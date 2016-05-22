
function drawOnCanvas () {
   var rgb =[
       $('#slider-1').slider("value"),
       $('#slider-2').slider("value"),
       $('#slider-3').slider("value")
   ];
   var c = document.getElementById("myCanvas2");
   var ctx = c.getContext("2d");
   var color = "rgb("+ rgb.join(',') + ")" ;
   ctx.fillStyle = color
   ctx.beginPath();
   ctx.fillRect(0, 0, myCanvas2.width, myCanvas2.height);;
   ctx.closePath();
   ctx.fill();
}

function createSlider1(slider) {
   slider.slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 255,
      value: r,
      slide: function( event, ui ) {
        drawOnCanvas();
        r = ui.value;
        cl = 'rgb('+r+','+g+','+b+')';
        pl.color = cl;
      }
  })
}
function createSlider2(slider) {
   slider.slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 255,
      value: g,
      slide: function( event, ui ) {
        drawOnCanvas();
        g = ui.value;
        cl = 'rgb('+r+','+g+','+b+')';
        pl.color = cl;
      }
  })
}
function createSlider3(slider) {
   slider.slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 255,
      value: b,
      slide: function( event, ui ) {
        drawOnCanvas();
        b = ui.value;
        cl = 'rgb('+r+','+g+','+b+')';
        pl.color = cl;
      }
  })
}
function createSlider4(slider) {
   slider.slider({
      orientation: "vertical",
      range: "min",
      min: 1,
      max: 120,
      value: 2,
      slide: function( event, ui ) {
        dwidth = ui.value;
      }
  })
}
$(function() {
    createSlider1($( "#slider-1" ));
    createSlider2($( "#slider-2" ));
    createSlider3($( "#slider-3" ));
    createSlider4($( "#slider-4" ));    
});
