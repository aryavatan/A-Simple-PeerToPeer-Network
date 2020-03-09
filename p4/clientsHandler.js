// Required Modules
var PTPpacket = require('./cPTPpacket');
let singleton = require('./singleton');
let net = require('net');

// // Project Folder
// var path = require('path');
// var folder = path.dirname(require.main.filename);


module.exports = {

	handleClientJoining: function (socket) {
		socket.on('data', (data) => {
            let currPeers = singleton.getNumPeers();
            let maxPeers = singleton.getMaxPeers();
            let peerTable = singleton.getPeerTable();

			let version = data.slice(0, 2).readUInt16BE(0);
            let sender = data.slice(4, 7).readUInt16BE(0);

			// Get peerTable information to send
			let numPeers = 0;
			let peerPort, peerIP, msgType;
			if(peerTable.length > 0){
				peerIP = singleton.getHost();
                peerPort = peerTable[0];
				numPeers = 1;
			}

			if (version == 3314) {
				if (currPeers < maxPeers) {  // Welcome message
                    console.log("Connected from peer " + (socket.remotePort-1)); // socket.remotePort always returns the port+1 on my machine, not sure why but this fixes that
                    currPeers = singleton.incrementNumPeers();

					// Add new peer to peerTable if there is space
					if (peerTable.length < (maxPeers - 1)) {
                        peerTable.push(sender);
					}

					msgType = 1; 
				}
				else{  // Redirect message
					console.log('Peer table full: ' + peerIP + ':' + sender + ' redirected');
					msgType = 2;
				}

				// Send ACK message back to peer
				PTPpacket.init(3314, msgType, singleton.getPort(), numPeers, peerPort, peerIP);
				let ack = PTPpacket.getPacket();
				socket.write(ack);
			}

		});

		// Socket Close 
		socket.on('close', (data) => {
			// Do Nothing
		});

		// Socket Error
		socket.on("error", (error) => {
			// If error is caused my abruptly closing socket, do nothing 
			if(error.code != 'ECONNRESET'){
				// Otherwise, throw the error
				throw error;
			}
		});
	},

	joinClient: function (socket, host, port) {
        console.log("\n\n\nConnected to peer " + host + ':' + port + ' at timestamp: ' + singleton.getTimestamp());
        singleton.printInitString(false);  // Print peer listening string

		// Send 'Hello' packet to peer
		PTPpacket.init(singleton.getVersion(), 1, singleton.getPort(), 0, null, null);
		let hello = PTPpacket.getPacket();
		socket.write(hello);

		// Peer response
		socket.on('data', (data) => {
			let version = data.slice(0, 2).readUInt16BE(0);
			let msgType = data.slice(3).readUInt8(0);
			let sender = data.slice(4, 7).readUInt16BE(0);
			let numPeers = data.slice(8, 11).readUInt16BE(0);
			let peerPort, peerIP;

			if(version == 3314 && sender == port){
				console.log('\tReceived ack from ' + host + ':' + sender);
				
				if(numPeers > 0){
                    peerPort = data.slice(14, 16).readUInt16BE(0);

                    // Get peer IP address one byte at a time
                    peerIP = '';
                    for(let i = 16; i < 20; i++){
                        let byte = data.slice(i).readUInt8(0);
                        peerIP += byte;
                        if(i < 19){
                            peerIP += '.';
                        }
                    }

					console.log('\tWhich is peered with ' + peerIP + ':' + peerPort);
				}
				
				if(msgType == 1) {  // Welcome message
                    singleton.incrementNumPeers();
                    singleton.addToPeerTable(sender);
				}
				else if(msgType == 2){  // Redirect message
                    console.log('Join redirected, trying to connect to the peer above.');

                    // Create new socket and connect to peer in redirect message
                    socket = new net.Socket()
					socket.connect(peerPort, peerIP, () => {
						this.joinClient(socket, peerIP, peerPort);
					});	
				}
			}
		});
	}

};




