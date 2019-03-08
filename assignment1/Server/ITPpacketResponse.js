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
    getPacket: function (seq_num, time_stamp, requestPayload) {

        let fileName = "";
        let requestPayload1 = requestPayload.readIntLE(0, 3);
        let requestPayload2 = requestPayload.readIntLE(3, 1);

        let requestPayload3 = requestPayload.toString('utf8', 4, 20).toString();

        console.log('requestPayload.toString(\'utf8\', 4, 20).toString()',
            requestPayload.toString('utf8', 4, 20).toString());

        console.log({requestPayload1});
        console.log({requestPayload1});
        console.log({requestPayload2});
        console.log({requestPayload3});


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


        // if the filename got truncated, try searching the key parts
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

        let fullPacket = Buffer.alloc(16);
        try {
            let packetRequest = new Buffer.alloc(16);

            console.log({fileName});
            let newBuffer = fs.readFileSync(fileName);

            packetRequest.writeIntLE(requestPayload1, 0, 3);
            packetRequest.writeIntLE(1, 3, 1);
            packetRequest.writeIntLE(seq_num, 4, 4);
            packetRequest.writeIntLE(time_stamp, 8, 4);
            packetRequest.writeIntLE(this.getLength(fileName), 3, 4);

            let arr = [packetRequest, newBuffer];

            fullPacket = Buffer.concat(arr);
            console.log(fullPacket);

        }
        catch (err) {
            console.log({err});
        }

        return fullPacket;


    }
};