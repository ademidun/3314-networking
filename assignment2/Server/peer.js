//
// DO NOT change or add any code in this file //
//
let net = require('net'),
    singleton = require('./Singleton'),
    handler = require('./ClientsHandler');
var minimist = require('minimist')

let HOST = '127.0.0.1',
    PORT = 3000;
let peerTable = [];
// Create a imageDB instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection'
// event. The sock object the callback function receives UNIQUE for each connection

net.bytesWritten = 300000;
net.bufferSize = 300000;

singleton.init();


console.log(`This peer address is ${PORT}: ${HOST} located at p${peerTable.length+1}`);

let args = minimist(process.argv);

// parse the arguements used to specify the image we are querying
let peerHost = args['p'];
console.log(peerHost);
if (peerHost) {

    let [peerIPAddress, peerPortNumber] = peerHost.split(':');

    client.connect(peerPortNumber, peerIPAddress, function () {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        client.write(image);
        client.write(ITPpacket.getpacket(image));
    });

    client.on('data', function (data) {

        //read the image sent from the client with the image stored as a binary payload in buf2;


        let bufferSize = data.byteLength;
        let packetResponseMessageType = data.readIntLE(0, 1);
        let packetResponseVersion = data.readIntLE(1, 3);
        let packetResponseSenderID = data.toString('ascii', 4,8);
        let packetResponsePeersCount = data.readIntLE(8, 4);
        let packetResponsePeerPortNumber = data.readIntLE(12, 4);
        let packetResponsePeerIPAddress = data.readIntLE(16, 4);

        /*
        const buf2 = data.slice(16, bufferSize);
        console.log(buf2);

        fs.writeFile('message.jpg', buf2, (err) => {
            if (err) {
                console.log({err});
                throw err;
            }
            console.log('The file has been saved!');
        });

        opn('message.jpg').then(() => {
            // image viewer closed
        });

        */

        console.log({packetResponseMessageType});
        console.log({packetResponseVersion});
        console.log({packetResponseSenderID});
        console.log({packetResponsePeersCount});
        console.log({packetResponsePeerPortNumber});
        console.log({packetResponsePeerIPAddress});

    });

    client.on('close', function () {
        console.log('Connection closed');
    });
}
else {
    var server = net.createServer();

    server.listen(PORT, HOST);

    server.on('connection', function (sock) {
        handler.handleClientJoining(sock, peerTable);
        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });
    });
}





