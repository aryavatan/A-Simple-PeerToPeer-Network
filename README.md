# A-Simple-PeerToPeer-Network
A peer-to-peer network built with Node.js. Peers are able to connect to each other and send packets back and forth.

Start each peer with the following command line:

Node peer [-p <peerHost:peerPort> -n <MaxPeers> -v <PacketProtocolVersion>]

The -p, -n, and -v flags are optional. If the -p flag is not provided, the peer will listen for other peers, otherwise the 
peer will try to connect the the provided host and port of another peer. The -n flag if provided sets the maximum amount of
peer connections an individial peer can have, default is 2. The -v flag will set the packet protocol verison, by default 
the value is 3314, if provided but not 3314, packets will be ignored and peers will ignore each others peers.
