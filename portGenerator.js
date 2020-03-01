var port = getRndInteger(1024, 65535);

module.exports = {
    getPort: function () {
        return port;
    },

    generatePort: function () {
        port = getRndInteger(1024, 65535);
        return port;
    }

};

// Return a random integer inside the range (including the min and max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}