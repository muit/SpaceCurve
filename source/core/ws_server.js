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
    socket.on("login", function(name, password){
        var player = new Player(name, socket, 0, 0, 0);
        this.players.push(player);

        //Create Events for all packets
        for(var opcode in WsServer.packets)
        {
            //Get function name from opcode
            var callback = WsServer.prototype[WsServer.packets[opcode]];
            
            //Create Event
            socket.on(opcode, function(data){
                callback(player, data);
            });
        }
    });
}

//*******************************
//Packet Callbacks
//*******************************
WsServer.prototype.setDirection = function(player, direction){
    player.direction = direction;
}

WsServer.prototype.disconect = function(player, data){
    this.players.remove(player);
    io.emit('players', this.players);
}

//*******************************
// Periodic Update
// Should be initialiced on a thread
//*******************************
WsServer.prototype.update = function(){
    this.players.forEach(function(player, index, array) {
        player.update();
    }

    //Here needs a FPS controller

    this.update();
}

WsServer.prototype.sendInfo = function(){
    io.emit('info', this.players.map(function(player){
        info = player.position;
        info.name = player.name;
        return info;
    }));
}

//*******************************
// Player class
//*******************************
WsServer.Player = function(name, socket, x, y, rad){
    if(!x) x = 0;
    if(!y) y = 0;
    if(!rad) rad = 0;

    this.name = name;
    this.socket = socket;
    this.position = {x: x, y: y};
    this.direction = rad;
}

WsServer.Player.prototype.setPosition = function(x, y){
    this.position = {x: x, y: y};
}

WsServer.Player.prototype.update = function(){
    //Update position with direction
}







