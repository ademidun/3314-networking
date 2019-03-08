
// Some code needs to added that are common for the module

module.exports = {
    init: function() {
       // init function needs to be implemented here //
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function() {
      // Enter your code here //
        var sequenceNumber=0;
        var min =1;
        var max =999;

        if (sequenceNumber == 0)
        {
            sequenceNumber = Math.floor(Math.random()* (+max - +min)) + +min;
        }

        else {
            sequenceNumber++;
        }

        return sequenceNumber;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: () => {

        let timeStamp=0;
        let min =1;
        let max =999;
        // let timerInterval = setInterval(timeStamp++, 10);

        if (timeStamp == 0)
        {
            timeStamp = Math.floor(Math.random()* (+max - +min)) + +min;

        }

        return timeStamp;

    }


};