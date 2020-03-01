var timer = getRndInteger(1, 999);
var sequenceNumber = getRndInteger(1, 999);

module.exports = {
    init: function () {
        setInterval(function () {
            // if timer reaches 2^32, resets to 0
            // else its incremented by 1 tick (every 10 milliseconds)
            if (timer == Math.pow(2, 32)) {
                timer = 0;
            } else {
                timer += 1;
            }
        }, 10);
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function () {
        // Increment sequence number for next function call
        return sequenceNumber++;
    },

    //--------------------------
    //getTimestamp: return the current timer value
    //--------------------------
    getTimestamp: function () {
        return timer;
    }


};

// Return a random integer inside the range (including the min and max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}