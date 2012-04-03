$(window).ready(function() {
    client = require('dnode-ez')();
    client.connect(window.location.port);
    client.on('drawCanvasPosition',function(x,y) { whiteboard.drawPixel(x,y);});
    client.on('clearCanvas',function() { whiteboard.clear();});
});
