var ITPpacket = require('./ITPpacketResponse'),
    singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {

    handleClientJoining: function (sock,server,peerTable,peerId, redirect=false, options={}) {

        sock.on('data', data => {
            if (peerTable.length >= options.maxPeers && !redirect) {
                console.log('about to redirect...')
                this.handleClientJoining(sock, server, peerTable,peerId, true, options);
            }
            readRespond(data, peerTable);
            if (peerTable.length < options.maxPeers) {
                peerTable.push( sock.remoteAddress + ':' + sock.remotePort);
            }

            console.log({peerTable});
        });

        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        function readRespond(data, peerTable) {
            // process the response from the cleint and prepare a response using our ITPpacket.
            // console.log('DATA: ' + sock.remoteAddress + ': ' + data);
            sock.write(ITPpacket.getPacket(singleton.getSequenceNumber(), singleton.getTimestamp(), data, peerTable, sock,server, peerId, options));
        }

        //
        // Enter your code here
        //
        // you may need to develop some helper functions
        // that are defined outside this export block
    }
};


