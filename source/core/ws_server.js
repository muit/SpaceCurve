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
        if(this.players.getByName(name) == undefined)

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
        }
        else
        {
            socket.emit("serverMessage", "That user already exists. Choose another name!");
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

    this.sendInfo();
    //Here needs a FPS controller

    this.update();
}

WsServer.prototype.sendInfo = function(){
    io.emit('info', this.players.map(function(player){
        return {name: player.name, x: player.position.x, y: player.position.y};
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
    this.position = new Vector2(x, y);
    this.direction = rad;
}

WsServer.Player.prototype.setPosition = function(x, y){
    this.position = new Vector2(x, y);
}

WsServer.Player.prototype.update = function(){
    var alpha = this.direction;
    this.position.x += this.speed * Math.cos(alpha);
    this.position.y += this.speed * Math.sin(alpha);
}


WsServer.Player.prototype.speed = Config.Player.speed;
WsServer.Player.prototype.radius = Config.Player.radius;

//*******************************
// Object Class
//*******************************
WsServer.Object = function(){}

WsServer.Object.prototype.update = function(){

}

WsServer.Object.prototype.events = new EventMap();
WsServer.Object.prototype.active = new Trigger();

WsServer.Object.prototype._activate = function(before, after){
    if(this.active.get()){
        before();
        this.events.createEvent(function(){
            this.active.reset();
            after();
        }, Config.Object.duration)
    }
}

//************************
//Object Types
//************************
WsServer.Object.Speed = function(){}
WsServer.Object.Speed.prototype = new WsServer.Object();
WsServer.Object.Speed.prototype.constructor = WsServer.Object.Speed;

WsServer.Object.Speed.prototype.activate = function(player){
    function before(){
        //When Object is Catched:
        player.speed *= 2;
    };
    function after(){
        //When Object has Finished:
        player.speed /= 2;
    };

    this._activate(before, after);
}