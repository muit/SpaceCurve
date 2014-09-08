/** section: Core API
 * SC
 *
 * The `SC` namespace is the single global object that gets exported to
 * the global scope of `SpaceCurve`'s JavaScript environment.
 **/
SC = {
    require: function(moduleName){
        if (typeof moduleName == "string") {
            moduleName = String(moduleName).toLowerCase();
            if (moduleName in this.modules) {
                return this.modules[moduleName];                
            }
            throw new Error("SGF.require: module name '" + moduleName + "' does not exist");
        }
        throw new Error("SGF.require: expected argument typeof 'string', got '" + (typeof moduleName) + "'");
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
 **/
function Game(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setClearColor(0x555555);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var canvas = document.getElementById("canvas")
    if(canvas) canvas.innerHTML(this.renderer.domElement);
};

Game.prototype.start = function(){
    this.done = false;
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

    if(!this.done){
        //Need a benchmark (Utyl Timer vs. Three.js frames)
        requestAnimationFrame(this.bucle);
    }
}
Game.prototype.render = function(){
    this.renderer.render(this.scene, this.camera); 
}

Game.prototype.update = function(){
    //Nothing to do :D
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


Network = function(port){
    this.logged = false;
    this.socket = io.connect(document.host+":"+port, {secure: true});
}
Network.prototype.login = function(name, password, success, error){
    if(!this.logged){
        var self = this;
        this.socket.on("login", function(res){
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
Network.prototype.signup = function(name, email, password){
    //Not yet
}

Network.prototype.logout = function(){
    if(this.logged){
        this.socket.emit("logout", {});
        this.logged = false;
    }
}

Network.prototype.onInfo = function(players, objects){
    this.socket.on("info", function(data){ 
        players(data.players);
        objects(data.objects);
    });
}

Network.prototype.getGames = function(games){
    this.socket.emit("games", {});
    this.socket.on("games", function(data){
        console.log("Games received from server");
        games(data);
    });
}

SC.modules["network"] = Network;