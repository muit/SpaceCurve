/** section: Core API
 * SC
 *
 * The `SC` namespace is the single global object that gets exported to
 * the global scope of `SpaceCurve`'s JavaScript environment.
 **/
SC = {
    version: "0.3.00",
    require: function(moduleName){
        if (typeof moduleName == "string") {
            moduleName = String(moduleName).toLowerCase();
            if (moduleName in this.modules) {
                return this.modules[moduleName];                
            }
            throw new Error("SGF.require: module name '" + moduleName + "' does not exist");
        }
        throw new Error("SGF.require: Expected argument typeof 'string', got '" + (typeof moduleName) + "'");
    },
    log: function(text){
        console.log(text);
    },
    modules: {},
}







/** section: Game API
 * class Component
 *
 * An abstract base class for game components. It cannot be instantiated
 * directly, but its subclasses are the building blocks for SGF games.
 * @constructor
 **/
function Game(options){
    if(options == undefined){
        options.debug = false;
    }

    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    this.reload(options);
    this.loadStats(options);

    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshBasicMaterial( { color: 0xff3300 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );

    this.camera.position.z = 5;

    this.loadEvents();

    var self = this;
    window.onresize = function(){
        self.reload(options);
    }
};
Game.prototype.reload = function(options){
    var canvas = document.getElementById("canvas");
    if(!canvas)
        throw new Error("Canvas element does not exist.");

    canvas.innerHTML = "";
    if(canvas.clientHeight < canvas.clientWidth)
        var side = canvas.clientHeight;
    else
        var side = canvas.clientWidth;

    this.renderer.setClearColor(0x777777);
    this.renderer.setSize(side, side);

    canvas.appendChild(this.renderer.domElement);
    this.loadStats(options);
}
Game.prototype.loadEvents = function(){
    var self = this;
    network.onGameStatus(function(data){
        if(data.error){
            SC.log(data.msg);
            return;
        }
        switch(data.value){
            case 0:
            self.pause();
            break;

            case 1:
            //Start visual timer with time: data.time
            break;

            case 2:
            self.start();
            break; 
        }
    });
}
Game.prototype.loadStats = function(options){
    var canvas = document.getElementById("canvas");
    if(!canvas)
        throw new Error("Canvas element does not exist.");

    if(options.debug == true){
        //Render stats
        this.renderstats = new THREEx.RendererStats();
        this.renderstats.domElement.style.position = 'absolute';
        this.renderstats.domElement.style.left = '0px';
        this.renderstats.domElement.style.bottom = '0px';
        canvas.appendChild( this.renderstats.domElement );

        //FPS stats
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right    = '0px';
        this.stats.domElement.style.bottom   = '0px';
        canvas.appendChild( this.stats.domElement );

    }
    else{
        //Fake stats adapters
        this.stats = {update: function(){}};
        this.renderstats = {update: function(r){}}
    }
}
Game.prototype.start = function(){
    this.done = false;

    network.onInfo(function(data){
        console.log(data);
    });

    this.bucle();
}
Game.prototype.pause = function(){
    this.done = true;
}

Game.prototype.objects = [];
Game.prototype.entities = [];

Game.prototype.bucle = function(){
    this.update();
    this.render();

    this.stats.update();
    this.renderstats.update(this.renderer);
    if(!this.done){
        //Need a benchmark (Utyl Timer vs. Three.js frames)
        var self = this;
        requestAnimationFrame(function(){self.bucle();});
    }
}
Game.prototype.render = function(){
    this.renderer.render(this.scene, this.camera); 
}

Game.prototype.update = function(){
    this.cube.rotation.x += 0.03;
    this.cube.rotation.y += 0.03;
    this.cube.rotation.z += 0.03;
}

Game.prototype.add = function(element){
    if(!element.gl) 
        throw new Error("Element don't have gl module.");
    this.scenene.add(element.glMesh);
}







//*************************************************************************
// Component Class
// Father of everything
//************************
Game.Component = function(x, y){
    if(x == undefined || y == undefined)
        throw new Error("Component: Cant create without valid coordinates.");

    this.position = new Vector2(x,y);
}
Game.Component.prototype.position = new Vector2(0,0);
Game.Component.prototype.setPosition = function(x, y){
    this.position = new Vector2(x, y);
}


//*************************************************************************
// Entity Class
//************************
Game.Entity = function(color){
    this.setColor(color);
}
Game.Entity.inherits(new Game.Component(0,0));

Game.Entity.prototype.setColor = function(color){
    if(color == "random")
        this.color = new RGB(Math.randomRange(0,255),Math.randomRange(0,255),Math.randomRange(0,255));
    else if(color instanceof RGB || color instanceof RGBA)
        this.color = color;
}

//************************
// IA Class
//************************
Game.IAEntity = function(){ Entity.call(this, "random"); }
Game.IAEntity.inherits(Game.Entity);

//************************
// Player Class
//************************
Game.Player = function(){ Entity.call(this, "random"); }
Game.Player.inherits(Game.Entity);


//*************************************************************************
// Object Class
//************************
Game.Object = function(){}
Game.Object.inherits(new Game.Component(0,0));
Game.Object.icon = "img/object.png";
//************************
//Object Types
//************************
Game.Object.Bird = function(){}
Game.Object.Bird.inherits(Game.Object);
Game.Object.Bird.icon = "img/object_bird.png";

Game.Object.Turtle = function(){}
Game.Object.Turtle.inherits(Game.Object);
Game.Object.Turtle.icon = "img/object_turtle.png";

Game.Object.CrossWall = function(){}
Game.Object.CrossWall.inherits(Game.Object);
Game.Object.CrossWall.icon = "img/object_crosswall.png";

Game.Object.CrossLine = function(){}
Game.Object.CrossLine.inherits(Game.Object);
Game.Object.CrossLine.icon = "img/object_crossline.png";

Game.Object.Immunity = function(){}
Game.Object.Immunity.inherits(Game.Object);
Game.Object.Immunity.icon = "img/object_immunity.png";

SC.modules["game"] = Game;








/** section: Input API
 * Input Class
 * 
 * Reads all the player inputs to control the game.
 * @constructor
 **/

Input = function(game){

}
Input.MOUSE_PRIMARY  = 0;
Input.MOUSE_MIDDLE   = 1;
Input.MOUSE_SECONDARY= 2;
Input.KEY_DOWN       = 40;
Input.KEY_UP         = 38;
Input.KEY_LEFT       = 37;
Input.KEY_RIGHT      = 39;
Input.KEY_1          = 32;
Input.KEY_2          = 33;
Input.KEY_3          = 34;
Input.KEY_4          = 35;

Input.grab = function() {
    document['observe']("keydown", keydownHandler)
            ['observe']("keypress", keypressHandler)
            ['observe']("keyup", keyupHandler)
            ['observe']("mousemove", mousemoveHandler)
            ['observe']("mousedown", mousedownHandler)
            ['observe']("mouseup", mouseupHandler)
            ['observe']("touchstart", touchstartHandler)
            ['observe']("touchmove", touchmoveHandler)
            ['observe']("touchend", touchendHandler)
            ['observe']("contextmenu", contextmenuHandler);
    Input.grabbed = true;
}

Input.release = function() {
    document['stopObserving']("keydown", keydownHandler)
            ['stopObserving']("keypress", keypressHandler)
            ['stopObserving']("keyup", keyupHandler)
            ['stopObserving']("mousemove", mousemoveHandler)
            ['stopObserving']("mousedown", mousedownHandler)
            ['stopObserving']("mouseup", mouseupHandler)
            ['stopObserving']("touchstart", touchstartHandler)
            ['stopObserving']("touchmove", touchmoveHandler)
            ['stopObserving']("touchend", touchendHandler)
            ['stopObserving']("contextmenu", contextmenuHandler);
    Input.grabbed = false;
}
SC.modules["input"] = Input;








/** section: Network API
 * class Network
 *
 * Network class controls all the multiplayer events, data sending, and networking.
 * Each Network instance is a new player in the server.
 * @constructor
 **/
Network = function(port){
    this.logged = false;
    this.socket = io.connect(document.host+":"+port, {secure: true});
    var self = this;
    this.socket.on('connect_error', function(err) {
        self.logged = false;
        SC.log("Couldn't connect to server. Retrying...");
    });
}
Network.prototype.isConnected = function(){return network.socket.connected}
Network.prototype.login = function(name, password, success, error){
    if(!this.isConnected()){
        if(error!=undefined) error("Not connected to server.");
        return;
    }
    if(!this.logged){
        var self = this;
        this.socket.on("login", function(res){
            self.socket.removeAllListeners("login");
            if(!res.error){
                self.logged = true;
                if(success != undefined) success(res.msg);
            }
            else {
                self.logged = false; 
                if(error != undefined) error(res.msg);
            }
        });
        this.socket.emit("login", name, password);
    }
}
Network.prototype.signup = function(name, email, password, success, error){
    if(!this.isConnected()){
        if(error!=undefined) error("Not connected to server.");
        return;
    }
    //Not yet
}

Network.prototype.logout = function(){
    if(!this.isConnected()){
        SC.log("Not connected to server.");
    }
    if(this.logged){
        this.socket.emit("logout", {});
        this.logged = false;
    }
}

Network.prototype.onInfo = function(players, objects){
    this.socket.removeAllListeners("info");
    this.socket.on("info", function(data){
        players(data.players);
        objects(data.objects);
    });
}

Network.prototype.getGames = function(games){
    if(!this.isConnected()){
        games({error: true, msg: "Not connected to server."});
        return;
    }
    this.socket.emit("games", {});
    var self = this;
    this.socket.on("games", function(data){
        self.socket.removeAllListeners("games");

        SC.log("Games received from server");
        if(data.error == undefined) data.error = true;
        games(data);
    });
}

Network.prototype.joinGame = function(id, callback){
    if(!this.isConnected()){
        callback({error: true, msg: "Not connected to server."});
        return;
    }
    var self = this;
    this.socket.on("joingame", function(data){
        self.socket.removeAllListeners("joingame");

        SC.log(data.msg);
        if(data.error == undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("joingame", {id: id});
}

Network.prototype.createGame = function(name, callback){
    if(!this.isConnected()){
        callback({error: true, msg: "Not connected to server."});
        return;
    }
    var self = this;
    this.socket.on("creategame", function(data){
        self.socket.removeAllListeners("creategame");

        SC.log(data.msg);
        if(data.error == undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("creategame", {name: name});
}

Network.prototype.exitGame = function(callback){
    if(!this.isConnected()){
        callback({error: true, msg: "Not connected to server."});
        return;
    }
    var self = this;
    this.socket.on("exitgame", function(data){
        self.socket.removeAllListeners("exitgame");

        SC.log(data.msg);
        if(data.error == undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("exitgame", {});
}

Network.prototype.onGameStatus = function(callback){
    var self = this;
    self.socket.removeAllListeners("gamestatus");
    self.socket.on("gamestatus", function(data){
        SC.log("Game State: "+data.value);
        if(data.error == undefined) data.error = true;
        callback(data);
    });
}

Network.prototype.startGame = function(callback){
    if(!this.isConnected()){
        callback({error: true, msg: "Not connected to server."});
        return;
    }

    var self = this;
    this.socket.on("startgame", function(data){
        if(data.error == undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("startgame", {});
}

SC.modules["network"] = Network;