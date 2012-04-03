var argv = require('optimist').usage('Whiteboard\nUsage: $0 -p [port]').demand(['p']).alias('p','port').describe('p','Port to start webserver on').argv;
var express = require('express');
var browserify = require('browserify');
var dnode_ez = require('dnode-ez');
var webapp = express.createServer();
webapp.use(express.static(__dirname + "/static"));
webapp.use(browserify({entry : __dirname + '/browser/whiteboard.js', mount : '/js/whiteboard.js'}));
webapp.listen(argv.p);
var server = dnode_ez();
server.listen(webapp);
server.on('relayCanvasPosition',function(x,y) {
    server.emit('drawCanvasPosition',x,y);
});
server.on('clear',function() {
    server.emit('clearCanvas');
});
