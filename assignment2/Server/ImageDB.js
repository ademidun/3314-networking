//
// DO NOT change or add any code in this file //
//
let net = require('net'),
    singleton = require('./Singleton'),
    handler = require('./ClientsHandler');

let HOST = '127.0.0.1',
    PORT = 3000;

// Create a imageDB instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection'
// event. The sock object the callback function receives UNIQUE for each connection

net.bytesWritten = 300000;
net.bufferSize = 300000;

singleton.init();

var server = net.createServer();

server.listen(PORT, HOST);
console.log('Server listening on http://' + HOST + ':' + PORT, singleton.getTimestamp());
server.on('connection', function (sock) {
    handler.handleClientJoining(sock);
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});



