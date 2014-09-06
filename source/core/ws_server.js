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
    console.log('WebSocket server running at port: ' + port);
    this.io.total = 0;
    this.io.on('connection', this.newPlayer);

WsServer.prototype.players = [];

    console.log("Started Server Bucle.");
    this.update();
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
WsServer.prototype.newPlayer = function(socket)
{
    socket.on("login", function(name, password){
        if(this.players.getByName(name) == undefined){
            socket.emit("login", true, "Logged in succesfully");

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
            socket.emit("login", true, "Could not login with that credentials.");
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
}

//*******************************
// Periodic Update
// Should be initialiced on a thread
//*******************************
WsServer.prototype.update = function(){
    var self = this;
    new Timer(function(){
        var playerData = [];
        if(self.players.length > 0){
            self.players.forEach(function(player, index, array) {
                player.update();
                playerData.push({name: player.name, x: player.position.x, y: player.position.y});
            });
            self.sendInfo(playerData);
        }
    }, 40);//40fps
}

WsServer.prototype.sendInfo = function(playerData){
    this.io.emit("info", {players: playerData});
}

//*******************************
// Component class
// Father of everything
//*******************************
var Component = function(x, y){
    if(x == undefined || y == undefined)
        throw new Error("Component: Cant create without valid coordinates.");

    this.position = new Vector2(x,y);
}
Component.prototype.position = new Vector2(0,0);
Component.prototype.setPosition = function(x, y){
    this.position = new Vector2(x, y);
}

//*******************************
// Player class
//*******************************
var Player = function(name, socket, x, y, rad){
    if(!rad) rad = 0;
    Component.call(this, x, y);
    this.name = name;
    this.socket = socket;
    this.direction = rad;
}
Player.inherits(new Component(0,0));

Player.prototype.update = function(){
    var alpha = this.direction;
    this.position.x += this.speed * Math.cos(alpha);
    this.position.y += this.speed * Math.sin(alpha);
}
Player.prototype.speed = Config.Player.speed;
Player.prototype.radius = Config.Player.radius;

//*******************************
// Object Class
//*******************************
var Object = function(x, y){ Component.call(this, x, y); }
Object.inherits(new Component(0,0));

Object.prototype.events = new EventMap();
Object.prototype.active = new Trigger();

Object.prototype.activate = function(player)){
    if(this.active.get()){
        this.before_activate(player);

        this.events.createEvent(function(){
            this.active.reset();
            this.after_activate(player);
        }, Config.Object.duration);
    }
}
Object.prototype.before_activate = function(player){}
Object.prototype.after_activate = function(player){}

//************************
//Object Types
//************************

//----------
// Bird
//----------
Object.Bird = function(x, y){ Object.call(this, x, y); }
Object.Bird.inherits(new Object(0, 0));

Object.Bird.prototype.before_activate = function(player){
    player.speed *= 2;
};
Object.Bird.prototype.after_activate = function(player){
    player.speed /= 2;
};

    this._activate(before, after);
}

//----------
// Turtle
//----------
Object.Turtle = function(x, y){ Object.call(this, x, y); }
Object.Turtle.inherits(new Object(0, 0));

Object.Turtle.prototype.before_activate = function(player){
    player.speed /= 2;
};
Object.Turtle.prototype.after_activate = function(player){
    player.speed *= 2;
};

//----------
// CrossWall
//----------
Object.CrossWall = function(x, y){ Object.call(this, x, y); }
Object.CrossWall.inherits(new Object(0, 0));

Object.CrossWall.prototype.before_activate = function(player){};
Object.CrossWall.prototype.after_activate = function(player){};

//----------
// CrossLine
//----------
Object.CrossLine = function(x, y){ Object.call(this, x, y); }
Object.CrossLine.inherits(new Object(0, 0));

Object.CrossLine.prototype.before_activate = function(player){};
Object.CrossLine.prototype.after_activate = function(player){};

//----------
// Immunity
//----------
Object.Immunity = function(x, y){ Object.call(this, x, y); }
Object.Immunity.inherits(new Object(0, 0));

Object.Immunity.prototype.before_activate = function(player){};
Object.Immunity.prototype.after_activate = function(player){};
