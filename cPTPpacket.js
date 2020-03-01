// Allocating the size in bytes of the header fields of the packet
var version = Buffer.alloc(3);
var msgType = Buffer.alloc(1);
var sender = Buffer.alloc(4);
var numPeers = Buffer.alloc(4);
var reserved; // = Buffer.alloc(2)
var peerPort; // = Buffer.alloc(2)
var peerIP; // = Buffer.alloc(4)
var packet;

module.exports = {

    init: function(_version, _msgType, _sender, _numPeers, _peerPort, _peerIP){
        version.writeUInt16BE(_version);
        msgType.writeUInt8(_msgType);
        sender.writeUInt16BE(_sender);
        numPeers.writeUInt16BE(_numPeers);

        // Calculating the length of the packet
        let length = version.length + msgType.length + sender.length + numPeers.length;

        if(_numPeers > 0){
            reserved= Buffer.alloc(2);
            
            peerPort = Buffer.alloc(2);
            peerPort.writeUInt16BE(_peerPort);

            peerIP = Buffer.alloc(4);
            peerIP.writeUInt16BE(_peerIP);

            length += reserved.length + peerPort.length + peerIP.length;

            packet = Buffer.concat([version,msgType,sender,numPeers,reserved,peerPort,peerIP], length);
        }
        else{
            packet = Buffer.concat([version,msgType,sender,numPeers], length);
        }
    },

    //--------------------------
    //getlength: return the total length of the cPTP packet
    //--------------------------
    getLength: function() {
        return packet.length;
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function() {
        return packet;
    }

};