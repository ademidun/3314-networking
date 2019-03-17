var ITPpacket = require('./ITPpacketResponse'),
    singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {

    handleClientJoining: function (sock,peerTable, redirect=false) {

        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data', data => {

            if (peerTable.length >= 2 && !redirect) {
                console.log('about to redirect...')
                this.handleClientJoining(sock,true);
            }
            readRespond(data, peerTable);
            if (peerTable.length < 2) {
                peerTable.push( sock.remoteAddress + ':' + sock.remotePort);
            }
        });

        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        function readRespond(data, peerTable) {
            // process the response from the cleint and prepare a response using our ITPpacket.
            console.log('DATA: ' + sock.remoteAddress + ': ' + data);
            sock.write(ITPpacket.getPacket(singleton.getSequenceNumber(), singleton.getTimestamp(), data, peerTable, sock));
        }

        //
        // Enter your code here
        //
        // you may need to develop some helper functions
        // that are defined outside this export block
    }
};


