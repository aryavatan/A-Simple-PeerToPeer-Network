var timer = getRndInteger(1, 999);
var port = getRndInteger(1024, 65535);

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
    //getPort: return the port value of the peer
    //--------------------------
    getPort: function () {
        return port;
    },

    //--------------------------
    //generatePort: generate and return a new port value for the peer
    //--------------------------
    generatePort: function () {
        port = getRndInteger(1024, 65535);
        return port;
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