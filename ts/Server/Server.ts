/// <reference path='./declarations/node.d.ts' />
/// <reference path='./declarations/ws.d.ts' />

import WebSocket = require('ws');

var port : number = 13579;
var server = new WebSocket.Server({port: port});

server.on("connection", ws => {
    console.log("Connection: " + ws);
});

console.log("Server is listening on port: " + port);