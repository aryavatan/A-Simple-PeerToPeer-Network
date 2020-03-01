// Required Modules
var PTPpacket = require('./cPTPpacket');
let portGenerator = require('./portGenerator');

module.exports = {

	handleClientJoining: function (socket, currPeers, maxPeers, peerTable) {
		socket.on('data', (data) => {
			let version = data.slice(0, 2).readUInt16BE(0);
			let msgType = data.slice(3).readUInt8(0);
			let sender = data.slice(4, 7).readUInt16BE(0);
			let numPeers = data.slice(8, 11).readUInt16BE(0);

			if (version == 3314) {
				if (currPeers < maxPeers) {  // Welcome message
					console.log("Connected from peer " + sender);
					currPeers++;

					// Get peerTable information to send
					let numPeers = 0;
					let peerPort, peerIP;
					if(peerTable.length > 0){
						peerIP = '127.0.0.1';
						peerPort = peerTable[0];
						numPeers = 1;
					}

					// Add new peer to peerTable if there is space
					if (peerTable.length < (maxPeers - 1)) {
						peerTable.push(sender);
					}

					// Senc "Welcome" ACK message back to new peer
					PTPpacket.init(3314, 1, portGenerator.getPort(), numPeers, peerPort, peerIP);
					let ack = PTPpacket.getPacket();
					socket.write(ack);
				}
				else{  // Redirect message

				}
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

			if(sender == port){
				console.log('Received ack from ' + host + ':' + sender);
				
			}
		});
	}

};




