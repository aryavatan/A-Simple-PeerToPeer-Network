// Required Modules
var PTPpacket = require('./cPTPpacket');
let portGenerator = require('./portGenerator');

module.exports = {

	handleClientJoining: function (socket, currPeers, maxPeers, peerTable) {
		socket.on('data', (data) => {
			let version = data.slice(0, 2).readUInt16BE(0);
			// let msgType = data.slice(3).readUInt8(0);
			let sender = data.slice(4, 7).readUInt16BE(0);
			// let numPeers = data.slice(8, 11).readUInt16BE(0);

			// Get peerTable information to send
			let numPeers = 0;
			let peerPort, peerIP, msgType;
			if(peerTable.length > 0){
				peerIP = '127.0.0.1';
                peerPort = peerTable[0];
				numPeers = 1;
			}

			if (version == 3314) {
				if (currPeers < maxPeers) {  // Welcome message
					console.log("Connected from peer " + sender);
                    currPeers++;
                    console.log('Current Peers:' + currPeers) // DEV LOG

					// Add new peer to peerTable if there is space
					if (peerTable.length < (maxPeers - 1)) {
                        peerTable.push(sender);
					}

					msgType = 1; 
				}
				else{  // Redirect message
					console.log('Peer table full: ' + sender + ' redirected');
					msgType = 2;
				}

				// Send ACK message back to peer
				PTPpacket.init(3314, msgType, portGenerator.getPort(), numPeers, peerPort, peerIP);
				let ack = PTPpacket.getPacket();
				socket.write(ack);
			}

		});

		// Socket Close 
		socket.on('close', (data) => {
			console.log('connection is closed');
			// console.log('Client-' + port + ' closed the connection.');
		});
	},

	joinClient: function (socket, currPeers, maxPeers, peerTable, host, port) {
		console.log("Connected to peer " + host + ':' + port);

		// Send 'Hello' packet to peer
		PTPpacket.init(3314, 1, portGenerator.getPort(), 0, null, null);
		let hello = PTPpacket.getPacket();
		socket.write(hello);

		// Peer response
		socket.on('data', (data) => {
			let version = data.slice(0, 2).readUInt16BE(0);
			let msgType = data.slice(3).readUInt8(0);
			let sender = data.slice(4, 7).readUInt16BE(0);
			let numPeers = data.slice(8, 11).readUInt16BE(0);
			let peerPort, peerIP;

			if(sender == port){
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
					currPeers++;
					peerTable.push(sender);
				}
				else if(msgType == 2){  // Redirect message
					console.log('Join redirected, trying to connect to the peer above.');
					socket.connect(port, host, () => {
						this.joinClient(socket,currPeers, maxPeers, peerTable, peerIP, peerPort);
					});	
				}
			}
		});
	}

};




