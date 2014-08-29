'use strict';

var sio = require('socket.io');
//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************

exports.start = function(port)
{
    return new WsServer(port);
}

var WsServer = function(port)
{
    this.io = sio(port);
    this.io.total = 0;
    this.io.on('connection', this.newPlayer);
}

//*******************************
// WebSocket received packets
// The method especified need to exists in WsServer.prototype
// opcode - callback
//*******************************
WsServer.packets = {
    direction: "setDirection",
    disconect: "disconect",
};

WsServer.prototype.players = [];
WsServer.prototype.newPlayer = function(socket)
{
    this.players.push(socket);
    //Create Events for all packets
    for(var opcode in WsServer.packets)
    {
        //Get function name from opcode
        var callback = WsServer.prototype[WsServer.packets[opcode]];
        
        //Create Event
        this.io.on(opcode, function(data){
            this.workingPlayer = socket;
            callback(data);
        });
    }
}

WsServer.prototype.setDirection = function(data){

}
WsServer.prototype.disconect = function(data){
    this.players.remove(this.workingPlayer);
}





