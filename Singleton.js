var timer = getRndInteger(1, 999);
var port = getRndInteger(1024, 65535);

// Peer table data
let currPeers = 0;
let maxPeers = 2;
let peerTable = [];

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
    },

    //--------------------------
    //getMaxPeers: return the current max peers value
    //--------------------------
    getMaxPeers: function () {
        return maxPeers;
    },

    //--------------------------
    //setMaxPeers: set and return the max peers value
    //--------------------------
    setMaxPeers: function (_maxPeers) {
        maxPeers = _maxPeers;
        return maxPeers;
    },

    //--------------------------
    //getPeerTable: return the current peer table
    //--------------------------
    getPeerTable: function () {
        return peerTable;
    },

    //--------------------------
    //addToPeerTable: add a value to the peer table
    //--------------------------
    addToPeerTable: function (peer) {
        peerTable.push(peer);
    },

    //--------------------------
    //getNumPeers: return the current number of peers
    //--------------------------
    getNumPeers: function () {
        return currPeers;
    },

    //--------------------------
    //incrementNumPeers: increment the current number of peers
    //--------------------------
    incrementNumPeers: function () {
        return ++currPeers;
    },

    //--------------------------
    //incrementNumPeers: decrement the current number of peers
    //--------------------------
    decrementNumPeers: function () {
        return --currPeers;
    }

};

// Return a random integer inside the range (including the min and max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}