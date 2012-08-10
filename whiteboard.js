var client = undefined;

var mousemove = function(evt) {
    if (canvas.mouseDownInCanvas) {
        var canvasx = evt.pageX - canvas.canvasMinX;
        var canvasy = evt.pageY - canvas.canvasMinY;
        client.emit('relayCanvasPosition',canvasx,canvasy);
    }
}
var mousedown = function(evt) {
    if ((evt.pageX > canvas.canvasMinX && evt.pageX < canvas.canvasMaxX) && (evt.pageY > canvas.canvasMinY && evt.pageY < canvas.canvasMaxY)) {
        canvas.mouseDownInCanvas = true;
    }
}

$(window).ready(function() {
    client = require('dnode-ez')({update:function(pix) {pix.forEach(function(o){
    whiteboard.drawPixel(o.x,o.y);
})}});
    client.on('drawCanvasPosition',function(x,y) { whiteboard.drawPixel(x,y);});
    client.on('clearCanvas',function() { whiteboard.clear();});
    client.connectWEB();
});
$('#clear').click(function() {
    client.emit('clear');
});
$(document).mousedown(mousedown);
$(document).mousemove(mousemove);
$(document).mouseup(function(){canvas.mouseDownInCanvas = false;});
var myCanvas = function(canvas) {
    canvas.mouseDownInCanvas = false;
    canvas.canvasMinX = $("#canvas").offset().left;
    canvas.canvasMaxX = canvas.canvasMinX + canvas.width;
    canvas.canvasMinY = $("#canvas").offset().top;
    canvas.canvasMaxY = canvas.canvasMinY + canvas.height;
    var ctx = canvas.getContext('2d');
    var myImageData = ctx.createImageData(canvas.width,canvas.height);
    var pixelArray = myImageData.data;
    for (var i = 0; i < pixelArray.length; i++) {
        if (i%4 == 3) {
            myImageData.data[i] = 255;
        } else {
            myImageData.data[i] = 0;
        }
    }
    ctx.putImageData(myImageData, 0, 0);
    var self = {};
    self.drawPixel = function(x,y) {
        var horiz = canvas.width*4;
        var pos = y*canvas.width*4 + x*4;
        myImageData.data[pos] = Math.floor(Math.random()*255);
        myImageData.data[pos+1] = Math.floor(Math.random()*255);
        myImageData.data[pos+2] = Math.floor(Math.random()*255);
        
        myImageData.data[pos + 3]= myImageData.data[pos];
        myImageData.data[pos + 4] = myImageData.data[pos+1];
        myImageData.data[pos + 5] = myImageData.data[pos+2];
        
        myImageData.data[pos + horiz]= myImageData.data[pos];
        myImageData.data[pos + horiz + 1] = myImageData.data[pos+1];
        myImageData.data[pos + horiz + 2] = myImageData.data[pos+2];
        
        myImageData.data[pos + horiz + 3]= myImageData.data[pos];
        myImageData.data[pos + horiz + 4] = myImageData.data[pos+1];
        myImageData.data[pos + horiz + 5] = myImageData.data[pos+2];
        ctx.putImageData(myImageData,0,0);
    };
    self.clear = function() {
        var pixelArray = myImageData.data;
        for (var i = 0; i < pixelArray.length; i++) {
            if (i%4 == 3) {
                myImageData.data[i] = 255;
            } else {
                myImageData.data[i] = 0;
            }
        }
        ctx.putImageData(myImageData, 0, 0);
    };
    return self;
};
var canvas = $('#canvas').get(0);
var whiteboard = myCanvas(canvas); 
