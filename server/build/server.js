"use strict";
var WebSocket = require('ws');
var port = 13579;
var server = new WebSocket.Server({ port: port });
server.on("connection", function (ws) {
    console.log("Connection: " + ws);
});
console.log("Server is listening on port: " + port);
