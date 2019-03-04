
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
        return "this should be a correct sequence number";
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp() {
        return Date.now();
    }


};