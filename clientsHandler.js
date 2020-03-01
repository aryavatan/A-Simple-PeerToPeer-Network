// Required Modules
var PTPpacket = require('./cPTPpacket');
let portGenerator = require('./portGenerator');

// Packet Fields
// var packet;
// var version;
// var msgType;
// var sender;
// var numPeers;
// var reserved;
// var peerPort;
// var peerIP;


module.exports = {

    handleClientJoining: function (sock, maxpeers, peerTable) {
        sock.on('data', (data) => {
            let version = data.slice(0,2).readUInt16BE(0);
            let msgType = data.slice(3).readUInt8(0);
            let sender = data.slice(4,7).readUInt16BE(0);
            let numPeers = data.slice(8,11).readUInt16BE(0);

            console.log("Connected from peer " + sender);
        });

        // Socket Close 
        sock.on('close', (data) => {
            console.log('Client-' + port + ' closed the connection.');
        });
    },

    joinClient: function(socket, host, port){
        console.log("Connected to peer " + host + ':' + port);
        PTPpacket.init(3314,1,portGenerator.getPort(),0,null,null);
        let hello = PTPpacket.getPacket();
        socket.write(hello);
    }

};




