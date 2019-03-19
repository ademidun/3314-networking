//
// DO NOT change or add any code in this file //
//
let net = require('net'),
    singleton = require('./Singleton'),
    handler = require('./ClientsHandler');
var minimist = require('minimist')
var ITPpacket = require('../Client/ITPpacketRequest')


let HOST = '127.0.0.1',
    PORT = 3000;
let peerTable = [];
let peersCount = 0;
let peerId = ``;
// Create a imageDB instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection'
// event. The sock object the callback function receives UNIQUE for each connection

net.bytesWritten = 300000;
net.bufferSize = 300000;

singleton.init();

let args = minimist(process.argv);
console.log({args});
let peerIndex = args['i'];
let maxPeers = parseInt(args['n']);
let version = parseInt(args['v']);



// parse the arguements used to specify the image we are querying
let peerHost = args['p'];

if (!peerIndex) {
    if (!peerHost) {
        peerIndex = 1;
    }
    else {
        peerIndex = Math.floor(Math.random() * (20 - 1) ) + 1;
    }

}

peerIndex = parseInt(peerIndex);

let options = {
    maxPeers: maxPeers || 2,
    version: version || 3314,
};

console.log({options});

if (peerHost) {

    console.log({peerHost});
    let [peerIPAddress, peerPortNumber] = peerHost.split(':');

    var client = new net.Socket();
    peersCount += 1;



    client.connect(peerPortNumber, peerIPAddress, function () {
        client.write(ITPpacket.getpacket());
        makeClientServer(client);
    });

    client.on('data', function (data) {

        console.log({peerId});
        let bufferSize = data.byteLength;
        console.log({bufferSize});
        let packetResponseMessageType = data.readIntLE(0, 1);
        let packetResponseVersion = data.readIntLE(1, 3);

        if (packetResponseVersion !== 3314) {
            console.log(`Incorrect version. Expected 3314, got:${packetResponseVersion}`);
            return
        }
        let packetResponseSenderID = data.toString('ascii', 4, 12);
        // note: data.toString() uses a different convention from data.readIntLE()
        // toString(startByte, StopByte) ,readIntLE(startByte, NumofBytesToRead)
        // let [senderIPAddress, senderPortNumber] = peerTable[peerTable.length-1].split(':');

        let packetResponsePeersCount = data.readIntLE(12, 4);
        let packetResponsePeerPortNumber = data.readIntLE(16, 4);
        let packetResponsePeerIPAddress =  data.toString('ascii', 20, 24);

/*

        console.log({packetResponseMessageType});
        console.log({packetResponseVersion});
        console.log({packetResponseSenderID});
        console.log({packetResponsePeersCount});
        console.log({packetResponsePeerPortNumber});
        console.log({packetResponsePeerIPAddress});

*/


        console.log(`Connected to peer ${packetResponseSenderID} at timestamp: ${singleton.getTimestamp()}`,
        `\nThis peer address is ${client.address().address}:${client.address().port}`,
         `located at p${peerIndex}`);
        peerId = `p${peerIndex}:${client.address().port}`;
        //todo: is this the best way to preserve the peerId?
        console.log(`received ACK from ${packetResponseSenderID}`);

        if (packetResponsePeersCount>0) {
            console.log(`which is peered with:`,
                `127.0.0.1:${packetResponsePeerPortNumber}`);
                // `${packetResponsePeerIPAddress}:${packetResponsePeerPortNumber}`)
        }

        if (packetResponseMessageType === 2) {
            console.log('Join redirected, try to connect to the peer above');

        }
    });

    client.on('close', function () {
        console.log('Connection closed');
    });
}

else {

    // todo: dynamically create a port number
    // todo: pass in an arguement to keep track of the peerid
    var server = net.createServer();

    server.listen(PORT, HOST);
    peersCount += 1;
    console.log(`This peer address is ${HOST}:${PORT} located at p${peersCount}`);
    server.on('connection', function (sock) {
        peerId = `p${peerIndex}:${server.address().port}`;
        console.log(`Connected from peer ${sock.remoteAddress}:${sock.remotePort}`);

        handler.handleClientJoining(sock,server, peerTable, peerId, options);
        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });
    });
}


function makeClientServer(clientSocket) {

    console.log(`creating a Clientserver Peer at ${HOST}:${clientSocket.address().port}`);

    let clientServer = net.createServer();

    clientServer.listen(clientSocket.address().port, HOST);
    clientServer.on('connection', function (sock) {
        console.log(`Connected from peer ${sock.remoteAddress}:${sock.remotePort}`);
        handler.handleClientJoining(sock,clientServer, peerTable, peerId, options);
        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });
    });
}


