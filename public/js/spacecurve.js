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
            if (moduleName in modules) {
                return modules[moduleName];                
            }
            throw new Error("SGF.require: module name '" + moduleName + "' does not exist");
        }
        throw new Error("SGF.require: expected argument typeof 'string', got '" + (typeof moduleName) + "'");
    },
    log: function(text){
        console.log(text);
    },
}

modules = {};

/** section: Game API
 * class Component
 *
 * An abstract base class for game components. It cannot be instantiated
 * directly, but its subclasses are the building blocks for SGF games.
 **/
function Game(){
    this.done = false;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setClearColor(0x555555);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    $("#canvas").append(this.renderer.domElement);

    this.render();
};

Game.prototype.objects = [];
Game.prototype.entities = [];

Game.prototype.render = function(){
    this.update();

    this.renderer.render(this.scene, this.camera); 
    if(!this.done)
        requestAnimationFrame(this.render);
}

Game.prototype.update = function(){
    //Read input and make the logic
    this.entities.forEach(function(element, index, array) {
        element.update();
    });
}

//*************************************************************************
// Object Class
//************************
Game.Object = function(){}

Game.Object.prototype.update = function(){

}

//************************
//Object Types
//************************
Game.Object.Bird = function(){}
inherits(Game.Object.Bird, Game.Object);



//*************************************************************************
// Entity Class
//************************
Game.Entity = function(){}
Game.Entity.prototype.update = function(){}

//************************
// IA Class
//************************
Game.IAEntity = function(){ Entity.call(this); }
inherits(Game.IAEntity, Game.Entity);

Game.IAEntity.prototype.update = function(){
    //IA code here
}

//************************
// Player Class
//************************
Game.Player = function(){ Entity.call(this); }
inherits(Game.Player, Game.Entity);

Game.Player.prototype.update = function(){
    //Player code here
}
modules["game"] = Game;



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
modules["input"] = Input;


//****************************
// Util Methods
//****************************
inherits = function(ownClass, superClass){
    ownClass.prototype = new superClass();
    ownClass.prototype.constructor = ownClass;
}
Function.inherits = function(superClass){

}