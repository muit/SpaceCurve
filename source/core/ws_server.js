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
    var self = this;
    this.io = sio(port);
    console.log('WSServer: Running at port: ' + port);
    this.io.total = 0;
    this.io.on('connection', function(socket){ self.newPlayer(socket); });
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
    var self = this;
    console.log("WSServer: New connection.");

    socket.on("login", function(name, password){
        if(self.players.getByName(name) == undefined){
            console.log("          "+name+" logged in succesfully.");
            socket.emit("login", {error: false, msg: "Logged in succesfully."});

            var player = new Player(name, socket, 0, 0, 0);
            self.players.push(player);

            //Create Events for all packets
            for(var opcode in WsServer.packets)
            {
                //Get function name from opcode
                var callback = self[WsServer.packets[opcode]];
                
                //Create Event
                socket.on(opcode, function(data){
                    callback(player, data);
                });
            }
        }
        else
        {
            console.log("          "+name+" couldn't log in.");
            socket.emit("login", {error: true, msg: "Could not login. That name is occuped."});
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

WsServer.prototype.games = [];
WsServer.prototype.newGame = function(name){
    this.games.push(new Game(name));
}

//*******************************
// Game class
// Each instance is a diferent game.
//*******************************
var Game = function(name){
    this.name = name;
    this.done = false;
    console.log("WSServer: Created new game '"+name+"'");
}
Game.prototype.events = new EventMap();

Game.prototype.start = function(){
    this.waitRound();
}
Game.prototype.waitRound = function(){
    var self = this;
    this.started = false;
    this.events.createEvent(function(){
        self.startRound();
    }, 5000);
}
Game.prototype.startRound = function(){
    var self = this;
    this.started = true;

    this.players.forEach(function(player){

    })

    new Timer(function(){
        self.update();
        return self.done;
    }, 25);//40fps
}
Game.prototype.endRound = function(){
    this.started = false;
    this.waitRound();
}

Game.prototype.players = [];
Game.prototype.addPlayer = function(player){
    if(!player.inGame){
        player.inGame = true;
        this.players.push(player);
        return true;
    }
    return false;
}
Game.prototype.kickPlayer = function(player){
    player.inGame = false;
    this.players.remove(player);
}

Game.prototype.objects = [];
Game.prototype.addObject = function(object){
    object.game = this;
    this.objects.push(object);
}
Game.prototype.removeObject = function(object){
    object.game = null;
    this.objects.remove(object);
}
//*******************************
// Periodic Update
//*******************************
Game.prototype.update = function(){
    if(this.players.length > 0){
        var playerData = [];
        this.players.forEach(function(player) {
            player.update();
            playerData.push({
                name: player.name, 
                x: player.position.x, 
                y: player.position.y,
                alive: player.alive
            });
        });

        var objectData = [];
        this.objects.forEach(function(object) {
            objectData.push({
                type: object.constructor.name, 
                x: object.position.x, 
                y: object.position.y
            });
        });

        this.emitPlayers("info", {players: playerData, objects: objectData});
    }
}

Game.prototype.emitPlayers = function(opcode, data){
    this.players.forEach(function(player){
        player.socket.emit(opcode, data);
    });
}

//*******************************
// Component class
// Father of everything
//*******************************
var Component = function(x, y, game){
    if(x == undefined || y == undefined)
        throw new Error("Component: Cant create without valid coordinates.");

    this.position = new Vector2(x,y);
    this.game = game;
}
Component.prototype.position = new Vector2(0,0);
Component.prototype.setPosition = function(x, y){
    this.position = new Vector2(x, y);
}

//*******************************
// Player class
//*******************************
var Player = function(name, socket, x, y, rad, game){
    if(!rad) rad = 0;

    Component.call(this, x, y, game);

    this.inGame = false;
    this.name = name;
    this.alive = true;
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
var Object = function(x, y, game){ Component.call(this, x, y, game); }
Object.inherits(new Component(0,0));

Object.prototype.events = new EventMap();
Object.prototype.active = new Trigger();

Object.prototype.activate = function(player){
    if(this.active.get()){
        this.before_activate(player);

        this.events.createEvent(function(){
            this.active.reset();
            this.after_activate(player);
            //Possible error: can not remove himself
            this.game.removeObject(this);
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
Object.Bird = function(x, y, game){ Object.call(this, x, y, game); }
Object.Bird.inherits(new Object(0, 0));
Object.Bird.name = "Bird";

Object.Bird.prototype.before_activate = function(player){
    player.speed *= 2;
}
Object.Bird.prototype.after_activate = function(player){
    player.speed /= 2;
}

//----------
// Turtle
//----------
Object.Turtle = function(x, y, game){ Object.call(this, x, y, game); }
Object.Turtle.inherits(new Object(0, 0));
Object.Turtle.name = "Turtle";

Object.Turtle.prototype.before_activate = function(player){
    player.speed /= 2;
}
Object.Turtle.prototype.after_activate = function(player){
    player.speed *= 2;
}

//----------
// CrossWall
//----------
Object.CrossWall = function(x, y, game){ Object.call(this, x, y, game); }
Object.CrossWall.inherits(new Object(0, 0));
Object.CrossWall.name = "CrossWall";

Object.CrossWall.prototype.before_activate = function(player){}
Object.CrossWall.prototype.after_activate = function(player){}

//----------
// CrossLine
//----------
Object.CrossLine = function(x, y, game){ Object.call(this, x, y, game); }
Object.CrossLine.inherits(new Object(0, 0));
Object.CrossLine.name = "CrossLine";

Object.CrossLine.prototype.before_activate = function(player){}
Object.CrossLine.prototype.after_activate = function(player){}

//----------
// Immunity
//----------
Object.Immunity = function(x, y, game){ Object.call(this, x, y, game); }
Object.Immunity.inherits(new Object(0, 0));
Object.Immunity.name = "Immunity";

Object.Immunity.prototype.before_activate = function(player){}
Object.Immunity.prototype.after_activate = function(player){}
