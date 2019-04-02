let net = require('net'),
    singleton = require('./Singleton'),
    handler = require('../Server/ClientsHandler');

let HOST = '127.0.0.1',
    PORT = 3001;

// Create a imageDB instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection'
// event. The sock object the callback function receives UNIQUE for each connection

let peersCount = 0;
let peerTable = [];
net.bytesWritten = 300000;
net.bufferSize = 300000;
singleton.init();



module.exports = {

    startServerImageDB: function () {
        let imageDB = net.createServer();
        imageDB.listen(PORT, HOST);
        console.log('ImageDB server is ' + HOST + ':' + PORT);

        imageDB.on('connection', function(sock) {
            peersCount += 1;
            console.log({peersCount});


            let peerAddress = `${sock.address().address}:${sock.address().port}`
            peerTable.push(peerAddress);
            let options = {
                peersCount: peersCount,
                peerTable: peerTable
            };

            handler.handleClientJoining(sock, options); //called for each client joining

        });
    }
}

