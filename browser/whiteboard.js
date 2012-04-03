$(window).ready(function() {
    client = require('dnode-ez')({update:function(pix) {pix.forEach(function(o){
    whiteboard.drawPixel(o.x,o.y);
})}});
    client.connect(window.location.port);
    client.on('drawCanvasPosition',function(x,y) { whiteboard.drawPixel(x,y);});
    client.on('clearCanvas',function() { whiteboard.clear();});
});
