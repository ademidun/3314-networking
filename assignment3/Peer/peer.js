let net = require('net'),
    singleton = require('./Singleton'),
    handler = require('./PeersHandler');
let peer2peerDB = require('./peer2peerDB');

singleton.init();

let os = require('os');
let ifaces = os.networkInterfaces();
let HOST = '';
let PORT = singleton.getPort(); //get random port number
let maxpeers = 2;
let ITPpacket = require('../Client/ITPpacketRequest')
ITPpacket.init('Swan.jpg');

// get the loaclhost ip address
Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' == iface.family && iface.internal !== false) {
            HOST = iface.address;
        }
    });
});

// get current folder name
let path = __dirname.split("\\");
let peerLocation = path[path.length - 1];

if (process.argv.length > 2) {
    // call as node peer [-p <serverIP>:<port> -n <maxpeers> -v <version>]

    // run as a client
    // this needs more work to properly filter command line arguments
    console.log('running as a client');
    let firstFlag = process.argv[2]; // should be -p
    let hostserverIPandPort = process.argv[3].split(':');
    let secondFlag = process.argv[4]; // should be -n
    maxpeers = process.argv[5] || 2;
    let thirdFlag = process.argv[6]; // should be -v
    let ITPVersion = process.argv[7] || '3314';
    let knownHOST = hostserverIPandPort[0];
    let knownPORT = hostserverIPandPort[1];

    // connect to the known peer address
    let clientPeer = new net.Socket();
    clientPeer.connect(knownPORT, knownHOST, function () {
        // initialize peer table
        let peerTable = {};
        clientPeer.write(ITPpacket.getpacket());
        handler.handleCommunications(clientPeer, maxpeers, peerLocation, peerTable);
    });
} else {
    console.log('running as a server');
    // call as node peer

    // run as a server
    let serverPeer = net.createServer();
    serverPeer.listen(PORT, HOST);
    // console.log('This peer address is ' + HOST + ':' + PORT + ' located at ' + peerLocation);
    console.log('This peer address is ' + HOST + ':' + PORT);

    // initialize peer table
    let peerTable = {};
    serverPeer.on('connection', function (sock) {
        // received connection request
        handler.handleClientJoining(sock, maxpeers, peerLocation, peerTable);
    });

    peer2peerDB.startServerImageDB();
}


