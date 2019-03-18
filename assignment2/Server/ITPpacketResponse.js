// You may need to add some delectation here
var fs = require("fs");

module.exports = {

    init: function () { // feel free to add function parameters as needed
        //
        // enter your code here
        //
    },

    //--------------------------
    //getlength: return the total length of the ITP packet
    //--------------------------
    getLength: function (fileName) {
        // enter your code here

        let fileBuffer = fs.readFileSync(fileName);

        console.log(fileBuffer);
        console.log(fileBuffer.byteLength);

        return fileBuffer.byteLength;


    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function (seq_num, time_stamp, requestPayload, peerTable, socket,server, senderId, options={}) {

        let fileName = "";
        let requestPayload1 = requestPayload.readIntLE(0, 3);
        let requestPayload2 = requestPayload.readIntLE(3, 1);

        let requestPayload3 = requestPayload.toString('utf8', 4, 20).toString();

        // console.log('requestPayload.toString(\'utf8\', 4, 20).toString()',
        //     requestPayload.toString('utf8', 4, 20).toString());

        // console.log({requestPayload1});
        // console.log({requestPayload2});
        // console.log({requestPayload3});


        /*
        console.log({__dirname});

        let imageDirectory = __dirname + "/images";
        switch (requestPayload3) {
            case "swan.jpg":
                fileName = imageDirectory + "/Swan.jpg";
                break;
            case "cardinal.jpg":
                fileName = imageDirectory + "/Cardinal.jpg";
                break;
            case "flamingo.jpg":
                fileName = imageDirectory + "/Flamingo.jpg";
                break;
            case "flicker.jpg":
                fileName = imageDirectory + "/Flicker.jpg";
                break;
            case "parrot.jpg":
                fileName = imageDirectory + "/Parrot.jpg";
                break;
        }
        console.log({fileName});


        // if the filename got truncated, try searching the to see if we can get a partial match
        if(!fileName) {
            console.log('trying backup filenames');
            let potentialFiles = ["Swan", "Cardinal", "Flamingo", "Flicker", "Parrot"];

            for (let i = 0; i < potentialFiles.length; i++) {
                if (requestPayload3.includes(potentialFiles[i].toLowerCase())){
                    fileName = imageDirectory + `/${potentialFiles[i].toLowerCase()}.jpg`;
                    break;
                }
            }
        }

        */


        // let serverAdress = server.address().address + ':' + server.address().port;
        // console.log('Buffer.from(senderId).length', Buffer.from(senderId).length);

        let fullPacket = Buffer.alloc(24);
        try {
            let packetResponse = new Buffer.alloc(24);

            // console.log({fileName});
            // let newBuffer = fs.readFileSync(fileName);
            let maxPeers = options.maxPeers || 2
            let messageType = 1;
            if (peerTable.length >= maxPeers) {
                messageType = 2;
                console.log(`Peer table full: ${socket.remoteAddress}:${socket.remotePort} redirected`);
            }
            //todo peerResponse is getting double counted

            // console.log({senderId});
            // console.log({peerTable});

            packetResponse.writeIntLE(messageType, 0, 1);
            packetResponse.writeIntLE(options.version || 3314, 1, 3);
            packetResponse.write
            (senderId, 4, 8);
            // 127.0.0.1:63986 has 15 characters, 1 byte per character, allocate 15 bytes
            // senderID todo: how to write string to buffer
            packetResponse.writeIntLE(peerTable.length, 12, 4); // number of peers

            if (peerTable.length > 0) {
                let [peerIPAddress, peerPortNumber] = peerTable[0].split(':');
                peerPortNumber = parseInt(peerPortNumber);


                // console.log({peerIPAddress});
                // console.log({peerPortNumber});

                packetResponse.writeIntLE(peerPortNumber, 16, 4); // peer port number
                // port number is 52917, we need 4 bytes (not 2) to store that
                // else: RangeError [ERR_OUT_OF_RANGE]: The value of "value" is out of range.
                // It must be >= -32768 and <= 32767. Received 52917
                packetResponse.write(peerIPAddress, 20, 4); // peer ip address
            }

            fullPacket = Buffer.concat([packetResponse]);
            // console.log({fullPacket});

        }
        catch (err) {
            console.log({err});
        }

        return fullPacket;


    }
};