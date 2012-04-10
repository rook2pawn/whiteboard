var argv = require('optimist')
    .usage('Whiteboard\nUsage: $0 -p [port]')
    .demand(['p'])
    .alias('p','port')
    .describe('p','Port to start webserver on')
    .alias('b','bouncy')
    .describe('b','if enabled, uses bouncy settings').argv;
var express = require('express');
var browserify = require('browserify');
var dnode_ez = require('dnode-ez');
var webapp = express.createServer();


if (argv.b) {
    console.log("Using bouncy settings");
    webapp.use('/whiteboard',express.static(__dirname + "/static_bouncy"));
    webapp.use(browserify({entry : __dirname + '/browser/whiteboard_bouncy.js', mount : '/whiteboard/js/whiteboard.js'}));
} else {
    console.log("Not using bouncy settings");
    webapp.use(express.static(__dirname + "/static"));
    webapp.use(browserify({entry : __dirname + '/browser/whiteboard.js', mount : '/js/whiteboard.js'}));
}
console.log("Listening on " + argv.p);
webapp.listen(argv.p);
var pixels = [];
var server = dnode_ez();
server.listen(webapp);
server.on('relayCanvasPosition',function(x,y) {
    server.emit('drawCanvasPosition',x,y);
    pixels.push({x:x,y:y});
});
server.on('connect',function(remote,conn) {
    console.log("Connect from " + conn.id);
    remote.update(pixels);
});
server.on('clear',function() {
    server.emit('clearCanvas');
    pixels = [];
});
