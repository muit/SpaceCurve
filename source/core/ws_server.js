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
WsServer.packets = [
    {opcode: "direction",  method: "setDirection"},
    {opcode: "disconect",  method: "disconect"   },
    {opcode: "games",      method: "getGames"    },
    {opcode: "joingame",   method: "joinGame"    },
    {opcode: "creategame", method: "createGame"  },
    {opcode: "exitgame",   method: "exitGame"    },
    {opcode: "startgame",   method: "startGame"  },
];

WsServer.prototype.players = [];
WsServer.prototype.newPlayer = function(socket)
{
    var self = this;
    console.log("WSServer: New connection.");

    function idValidUsername(name){
        if(name.contains(" ")) return "The username can't have spaces.";
        if(name.length < 4) return "The username needs 4 letters or more.";
        return true;
    }

    socket.on("login", function(name, password){
        var res = idValidUsername(name);
        if(res != true){
            socket.emit("login", {error: true, msg: "Could not login. "+res});
            return;
        }
        if(self.players.getByName(name) != undefined){
            socket.emit("login", {error: true, msg: "Could not login. That name is occuped."});
            return;
        }

        console.log("WSServer: '"+name+"' logged in succesfully.");
        socket.emit("login", {error: false, msg: "Logged in succesfully."});

        var player = new Player(name, socket, 0, 0, 0);
        self.players.push(player);

        //Create Events for all packets
        WsServer.packets.forEach(function(packet)
        {   
            //Create Event
            socket.on(packet.opcode, function(data){
                self[packet.method](player, data);
            });
        });
        socket.on('logout', function(args){
            if(player.game) player.game.kickPlayer(player);
            self.players.remove(player);
            console.log("WSServer: '"+player.name+"' logged out succesfully.");
        });

        socket.on('disconnect', function(){
            if(player.game) player.game.kickPlayer(player);
            var removedPlayer = self.players.remove(player);
            if(removedPlayer != undefined)
                console.log("WSServer: '"+player.name+"' lost connection.");
        });
    });
}

WsServer.prototype.games = [];

WsServer.prototype.newGame = function(name, player){
    if(!player.inGame){
        this.games.push(new Game(name));
        this.games.last().addPlayer(player);
    }
}

WsServer.prototype.removeGame = function(game){
    this.games.remove(game);
}








//*****************************************************************************
//Packet Callbacks
//*******************************
WsServer.prototype.setDirection = function(player, direction){
    player.direction = direction;
}

WsServer.prototype.disconect = function(player, data){
    this.players.remove(player);
}

WsServer.prototype.getGames = function(player, data){
    var games = [];
    this.games.forEach(function(game, index){
        games.push({
            id: index,
            name: game.name, 
            playerAmount: game.players.length+"/"+Config.Game.maxPlayers,
            playing: game.started
        });
    });
    console.log("WSServer: Games request from "+player.name);
    player.socket.emit("games", {error: false, games: games});
}

WsServer.prototype.joinGame = function(player, data){
    if(player.inGame){
        player.socket.emit("joingame", {error: true, msg: "That player is in a game right now. Can't join another."});
        return;
    }
    var game = this.games[data.id];
    if(game){
        game.addPlayer(player);

        console.log("WSServer: '"+player.name+"' joined game "+game.name);
        player.socket.emit("joingame", {error: false, msg: "Joined game "+game.name});
    }
    else{
        player.socket.emit("joingame", {error: true, msg: "That game does not exists!"});
    }
}

WsServer.prototype.createGame = function(player, data){
    if(player.inGame){
        player.socket.emit("creategame", {error: true, msg: "That player is in a game right now. Can't create another."});
        return;
    }
    
    data.name = data.name.replace(/\s{2,}/g, ' ');

    if(data.name.length <= 4){
        player.socket.emit("creategame", {error: true, msg: "Game name needs 4 letters or more."});
        return;
    }

    var game = new Game(data.name);
    game.addPlayer(player);
    this.games.push(game);

    console.log("WSServer: Game "+data.name+" created by "+player.name);
    player.socket.emit("creategame", {error: false, msg: data.name+" created succesfully."});
}

WsServer.prototype.exitGame = function(player, data){
    console.log("hey!");
    if(player.inGame){
        player.socket.emit("exitgame", {error: true, msg: "You are not in a game."});
        return;
    }
    console.log("WSServer: "+player.name+" exited "+data.name);
    player.game.kickPlayer(player);
    player.game = null;

    player.socket.emit("exitgame", {error: false, msg: ""});
}

WsServer.prototype.startGame = function(player, data){
    if(!player.inGame){
        player.socket.emit("startgame", {error: true, msg: "You are not in a game."});
        return;
    }
    var game = player.game;
    if(game.moderator == player){
        game.start();
        var data = {error: false, msg: "Starting game."}
    }
    else
        var data = {error: true, msg: "You are not the game moderator."}

    player.socket.emit("startgame", data);
}








//*******************************
// Game class
// Each instance is a diferent game.
//*******************************
var Game = function(name){
    this.name = name;
    this.started = false;
    console.log("WSServer: Created new game '"+name+"'");
    //Waiting Game
    this.emit("gamestatus", {error: false, value: 0, time: 0});
}
Game.prototype.events = new EventMap();

Game.prototype.start = function(){
    this.waitRound();
}
Game.prototype.waitRound = function(){
    var self = this;
    this.started = false;
    //Starting Game
    this.emit("gamestatus", {error: false, value: 1, time: Config.Game.waitTime});

    this.events.createEvent(function(){
        self.startRound();
    }, Config.Game.waitTime);
}
Game.prototype.startRound = function(){
    var self = this;
    this.started = true;
    //Started Game
    this.emit("gamestatus", {error: false, value: 2, time: 0});

    this.players.forEach(function(player){
        var x = Math.randomRange(0, Config.Map.width);
        var y = Math.randomRange(0, Config.Map.height);
        player.position = new Vector2(x, y);
    });

    new Timer(function(){
        self.update();
        return !self.started;
    }, 25);//40fps
}
Game.prototype.endRound = function(){
    this.started = false;
    this.waitRound();
}

//*******************************
// Periodic Update
//*******************************
Game.prototype.update = function(){
    this.sendData();
}
Game.prototype.sendData = function(){
    if(this.players.length > 0){
        var playerData = [];
        this.players.forEach(function(player) {
            player.update();
            playerData.push({
                name: player.name, 
                x: player.position.x, 
                y: player.position.y,
                alive: player.alive,
                score: player.score
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

        //Need A LOT of optimization! 
        this.emit("info", {players: playerData, objects: objectData});
    }
}



Game.prototype.players = [];
Game.prototype.moderator = undefined;
Game.prototype.addPlayer = function(player){
    if(!player.inGame){
        if(this.players.length < Config.Game.maxPlayers){
            player.inGame = true;
            player.game = this;

            if(this.players.length == 0) 
                this.moderator = player;
            this.players.push(player);
            return true;
        }
    }
    return false;
}
Game.prototype.setModerator = function(player){
    this.moderator = player;
}
Game.prototype.kickPlayer = function(player){
    player.inGame = false;
    player.game = null;
    this.players.remove(player);

    if(this.players.length <= 0){
        console.log("Not enought players. Game "+this.name+" will be closed.");
        websocketServer.removeGame(this);
    }
    else if(this.moderator == player){
        this.moderator = this.players.first();
    }
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

Game.prototype.emit = function(opcode, data){
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
    this.score = 0;
    this.socket = socket;
    this.direction = rad;
}
Player.inherits(new Component(0,0));

Player.prototype.isModerator = function(){
    if(this.game == undefined)
        return false;
    return this.game.moderator == this;
}

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
