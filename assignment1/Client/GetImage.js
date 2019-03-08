var net = require('net');
var fs = require('fs');
var ITPpacket = require('./ITPpacketRequest')

var opn = require('opn'); // uncomment this line after you run npm install command
var minimist = require('minimist')
// Enter your code for the client functionality here
// Consider the code given iin unit 7 slide 40 as a base and build upon it

// node GetImage.js -s 127.0.0.1:3000 -q cardinal.jpg -v 4

var HOST = '127.0.0.1';
var PORT = 3000;

var client = new net.Socket();


let args = minimist(process.argv);

let image = args['q'];
console.log({args});

if (!image) {
    console.log('\nError:Image must be set!\n');
    return;
}

client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    client.write(image);
    client.write(ITPpacket.getpacket(image));
});

client.on('data', function (data) {

    let bufferSize = data.byteLength;
    let packetResponse0 = data.readIntLE(0, 3);
    let packetResponse1 = data.readIntLE(3, 1);
    let packetResponse2 = data.readIntLE(4, 4);
    let packetResponse3 = data.readIntLE(8, 4);
    let packetResponse4 = data.readIntLE(12, 4);

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

    console.log(packetResponse0);
    console.log(packetResponse1);
    console.log(packetResponse2);
    console.log(packetResponse3);
    console.log(packetResponse4);

});

client.on('close', function () {
    console.log('Connection closed');
});