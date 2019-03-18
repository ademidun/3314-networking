var net = require('net');
var fs = require('fs');
var ITPpacket = require('./ITPpacketRequest')

var opn = require('opn'); // uncomment this line after you run npm install command
var minimist = require('minimist')
// Enter your code for the client functionality here
// Consider the code given iin unit 7 slide 40 as a base and build upon it

// node GetImage.js -s 127.0.0.1:3000 -q swan.jpg -v 4

var HOST = '127.0.0.1';
var PORT = 3000;

var client = new net.Socket();


let args = minimist(process.argv);

// parse the arguements used to specify the image we are querying
let image = args['q'];


client.connect(PORT, HOST, function () {
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