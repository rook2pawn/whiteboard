var argv = require('optimist')
    .usage('Whiteboard\nUsage: $0 -p [port]')
    .demand(['p'])
    .alias('p','port')
    .describe('p','Port to start webserver on')
    .argv;

var http = require('http');
var ecstatic = require('ecstatic')(__dirname + "/static");
var ez = require('dnode-ez');
var webapp = http.createServer(ecstatic);

console.log("Listening on " + argv.p);
var pixels = [];
var server = ez();
server.listenWEB(argv.p, webapp);
server.on('relayCanvasPosition',function(x,y,remote,conn) {
    remote.emit('drawCanvasPosition',x,y);
    pixels.push({x:x,y:y});
});
server.on('connect',function(remote,conn) {
    remote.update(pixels);
});
server.on('clear',function(remote,conn) {
    remote.emit('clearCanvas');
    pixels = [];
});
