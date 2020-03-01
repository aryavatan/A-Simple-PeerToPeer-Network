// Required modules
let net = require('net');
var argv = require('minimist')(process.argv.slice(2));
let portGenerator = require('./portGenerator');
let handler = require('./clientsHandler');


// Host and Port initialization
const HOST = '127.0.0.1';
let PORT = portGenerator.generatePort();

net.bytesWritten = 300000;
net.bufferSize = 300000;


// Peer table
let currPeers = 0;
let maxPeers = 2;
let peerTable = [];


// Start peer
let peer = net.createServer();
peer.listen(PORT, HOST);
console.log('\n\n\nPeer-' + PORT + ' is started and is listening on ' + HOST + ':' + PORT);


// If max peers is provided
if(argv.n != undefined){
	maxPeers = parseInt(argv.n);
}


// Peer to join is provided
if(argv.p != undefined){
	let host = argv.p.split(":")[0];
	let port = argv.p.split(":")[1];
	let socket = new net.Socket();
	socket.connect(port, host, () => {
		handler.joinClient(socket, currPeers, maxPeers, peerTable, host, port);
	});
}


// On connecting with other peer
peer.on('connection', function (sock) {
	handler.handleClientJoining(sock, currPeers, maxPeers, peerTable); //called for each client joining
});


