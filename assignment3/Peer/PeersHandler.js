let net = require('net'),
    cPTPpacket = require('./cPTPmessage'),
    singleton = require('./Singleton');
let ITPpacket = require('../Client/ITPpacketRequest')
let peerTable = {},
    firstPeerIP = {},
    firstPeerPort = {},
    isFull = {};
let peerTableDeclined = {};
let peerTableMessage = {};

module.exports = {
    handleClientJoining: function (sock, maxPeers, sender, peerTable) {
        let peersCount = Object.keys(peerTable).length;
        if (peersCount === maxPeers) {
            declineClient(sock, sender, peerTable);
        } else {
            handleClient(sock, sender, peerTable)
        }
    },

    handleCommunications: function (client, maxPeers, location, peerTable) {
        // get message from server

        client.on('data', (message) => {
            let version = bytes2number(message.slice(0, 3));
            let msgType = bytes2number(message.slice(3, 4));
            let sender = bytes2string(message.slice(4, 8));
            let numberOfPeers = bytes2number(message.slice(8, 12));
            let reserved = bytes2number(message.slice(12, 14));
            let peerPort = bytes2number(message.slice(14, 16));
            let peerIP = bytes2number(message.slice(16, 17)) + '.'
                + bytes2number(message.slice(17, 18)) + '.'
                + bytes2number(message.slice(18, 19)) + '.'
                + bytes2number(message.slice(19, 20));

            peerTableMessage = message;

            if (msgType == 1) {
                isFull[client.remotePort] = false;
                console.log("Connected to peer " + sender + ":" + client.remotePort + " at timestamp: " + singleton.getTimestamp());

                // add the server (the receiver request) into the table
                console.log('peerTable Before');
                console.log({peerTable});
                let receiverPeer = {'port': client.remotePort, 'IP': client.remoteAddress};
                let peersCount = Object.keys(peerTable).length;
                peerTable[peersCount+1] = receiverPeer;
                console.log('peerTable after');
                console.log({peerTable});

                // Now run as a server
                let serverPeer = net.createServer();
                serverPeer.listen(client.localPort, client.localAddress);
                // console.log('This peer address is ' + client.localAddress + ':' + client.localPort + ' located at ' + location);
                console.log('This peer address is ' + client.localAddress + ':' + client.localPort);
                serverPeer.on('connection', function (sock) {

                    console.log({maxPeers});
                    console.log({peerTable});

                    let peersCount = Object.keys(peerTable).length;
                    if (peersCount == maxPeers) {
                        declineClient(sock, location, peerTable);
                    } else {
                        handleClient(sock, location, peerTable)
                    }
                });

                console.log("Received ack from " + sender + ":" + client.remotePort);
                if ((numberOfPeers > 0) && (client.localPort != peerPort)) {

                    if (client.remotePort == 3000) {
                        console.log("  which is peered with: " + peerIP + ":" + peerPort);
                    }
                    else {
                        console.log('client.remotePort', client.remotePort);
                        displayPeerTable(message)
                    }
                }

            } else {
                console.log("Received ack from " + sender + ":" + client.remotePort);
                isFull[client.remotePort] = true;
                if (numberOfPeers > 0);
                    displayPeerTable(message);
                    try {
                        autoJoin(client, peerTableMessage, peerTable, maxPeers);
                    } catch (err) {
                        console.log('autoJoin err', err);
                    }
                console.log("Join redirected, try to connect to the peer above.");

            }
        });
        client.on('end', () => {
            if (isFull[client.remotePort]) {

            }; //process.exit();
        });

    },


};

function autoJoin(client, message, peerTable, maxPeers) {

    // reconnect to the next peer returned in a list from the server
    console.log('autoJoin()');
    client.destroy();

    let peersCount = Object.keys(peerTable).length;

    if (peersCount >= maxPeers) {
        console.log('autoJoin finished, peer table is full');
        return
    }
    console.log({peerTableDeclined});

    if (! (client.remotePort in peerTableDeclined)) {

        // track the peers that have been declined
        peerTableDeclined[client.remotePort] = {IP: client.remoteAddress, port: client.remotePort};
        let numberOfPeers = bytes2number(message.slice(8, 12)); //for some reason changing from 12 to 11 worked

        console.log({numberOfPeers});

        for (let i=0; i< numberOfPeers; i++) {

            let peerPortTemp = bytes2number(message.slice(14+8*i, 16+8*i));
            let peerIPTemp = bytes2number(message.slice(16+8*i, 17+8*i)) + '.'
                + bytes2number(message.slice(17+8*i, 18+8*i)) + '.'
                + bytes2number(message.slice(18+8*i, 19+8*i)) + '.'
                + bytes2number(message.slice(19+8*i, 20+8*i));

            // create new socket for autoJoin
            // let clientPeer = new net.Socket();

            if (! (peerPortTemp in peerTableDeclined)) {
                let clientPeer = new net.Socket();

                clientPeer.connect(peerPortTemp, peerIPTemp, function (socket) {
                // initialize peer table
                let path = __dirname.split("\\");
                let peerLocation = path[path.length - 1];

                clientPeer.write(ITPpacket.getpacket());
                module.exports.handleCommunications(clientPeer, maxPeers, peerLocation, peerTable);

                console.log('autJoin() peerTable');
                console.log({peerTable})
            });
                break;
            }
        }

    }
}

function displayPeerTable (message) {
    let msgType = bytes2number(message.slice(3, 4));
    let sender = bytes2string(message.slice(4, 8));
    let numberOfPeers = bytes2number(message.slice(8, 12)); //for some reason changing from 12 to 11 worked

    for (let i=0; i< numberOfPeers; i++) {
        /*
        if (i==0) {
            console.log({i});
            console.log({msgType});
            console.log({sender});
            console.log({numberOfPeers});
        }
        */

        let peerPortTemp = bytes2number(message.slice(14+8*i, 16+8*i));
        let peerIPTemp = bytes2number(message.slice(16+8*i, 17+8*i)) + '.'
            + bytes2number(message.slice(17+8*i, 18+8*i)) + '.'
            + bytes2number(message.slice(18+8*i, 19+8*i)) + '.'
            + bytes2number(message.slice(19+8*i, 20+8*i));

        let prefix = i===0 ? "  which is peered with" : "  and"
        console.log(prefix+": " + peerIPTemp + ":" + peerPortTemp);
    }
}


function handleClient(sock, sender, peerTable) {
    // accept client request
    addClient(sock, peerTable);

    // send acknowledgment to the client
    cPTPpacket.init(1, sender, peerTable);
    sock.write(cPTPpacket.getPacket());
    sock.end();
}

function declineClient(sock, sender, peerTable) {
    let peerAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('\nPeer table full: ' + peerAddress + ' redirected');

    // send acknowledgment to the client
    cPTPpacket.init(2, sender, peerTable);
    sock.write(cPTPpacket.getPacket());
    sock.end();
}

function addClient(sock, peerTable) {
    let peersCount = Object.keys(peerTable).length;
    let joiningPeer = {'port': sock.remotePort, 'IP': sock.remoteAddress};
    peerTable[++peersCount] = joiningPeer;

    let peerAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('\nConnected from peer ' + peerAddress);
}

function bytes2string(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        if (array[i] > 0)
            result += (String.fromCharCode(array[i]));
    }
    return result;
}

function bytes2number(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result ^= array[array.length - i - 1] << 8 * i;
    }
    return result;
}