
// You may need to add some delectation here



module.exports = {


    init: function( ) {// feel free to add function parameters as needed
        //
        // enter your code here
        //
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getpacket: function(image) {
        // enter your code here

        console.log({image});
        let packet = new Buffer.alloc(16);

        // enter the course number, version number and request type as ITP packet headers
        packet.writeIntLE(3314,0,3);
        packet.writeIntLE(1,3,1);
        packet.write(image,4,12);

        let byte0 = packet.readIntLE(0,3);
        let byte3 = packet.readIntLE(3,1);
        let packetVar = packet.toString('utf8',4,12).toString();

        console.log('ITPpacketRequest getpacket(image)');
        console.log(byte0);
        console.log(byte3);
        console.log(packetVar);
        return packet;
    }


};

