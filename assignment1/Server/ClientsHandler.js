var ITPpacket = require('./ITPpacketResponse'),
    singleton = require('./Singleton');

// You may need to add some delectation here


module.exports = {

    handleClientJoining: function (sock) {

        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        sock.on('data', readRespond);

        sock.on('close', function (data) {
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        function readRespond(data) {
            console.log('DATA: ' + sock.remoteAddress + ': ' + data);
            sock.write(ITPpacket.getPacket(singleton.getSequenceNumber(), singleton.getTimestamp(), data));
        }

        //
        // Enter your code here
        //
        // you may need to develop some helper functions
        // that are defined outside this export block
    }
};


