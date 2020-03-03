// Required modules
let net = require('net');
var argv = require('minimist')(process.argv.slice(2));
let singleton = require('./singleton');
let handler = require('./clientsHandler');


// Host and Port variables
const HOST = '127.0.0.1';
let PORT;

net.bytesWritten = 300000;
net.bufferSize = 300000;


// Initialize Singleton
singleton.init();


// Start peer
let peer = net.createServer();
peer.listen(0, HOST, function() {
	PORT = peer.address().port;
	singleton.setPort(PORT);
	console.log('\n\n\nPeer-' + PORT + ' is started and is listening on ' + HOST + ':' + PORT);
});


// If max peers is provided
if(argv.n != undefined){
    let maxPeers = parseInt(argv.n);
    singleton.setMaxPeers(maxPeers);
}


// If version is provided
if(argv.v != undefined){
    // Will send Hello packet with this version, 
    // if version != 3314, the other peer will not respond
    singleton.setVersion(parseInt(argv.v));
}


// Peer to join is provided
if(argv.p != undefined){
	let host = argv.p.split(":")[0];
	let port = argv.p.split(":")[1];
	let socket = new net.Socket();
	socket.connect(port, host, () => {
		handler.joinClient(socket, host, port);
	});
}


// On connecting with other peer
peer.on('connection', function (socket) {
	handler.handleClientJoining(socket); //called for each client joining
});


