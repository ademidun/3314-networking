var net = require('net');
var fs = require('fs');
var ITPpacket = require('./ITPpacketRequest')

var opn = require('opn'); // uncomment this line after you run npm install command

// Enter your code for the client functionality here
// Consider the code given iin unit 7 slide 40 as a base and build upon it
var HOST = '127.0.0.1';
var PORT = 3000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    client.write(`Hi its me! ${client.remotePort}`);
});
client.on('data', function(data) {
    console.log('DATA: ' + data);
    client.destroy();
});
client.on('close', function() {
    console.log('Connection closed');
});