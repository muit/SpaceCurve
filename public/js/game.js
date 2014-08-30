//*************************************************************************
// Game Class
//************************
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
    Game.prototype.objects.forEach(function(element, index, array) {
        element.update();
    });
    Game.prototype.entities.forEach(function(element, index, array) {
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
Game.Object.Speed = function(){}
Game.Object.Speed.prototype = new Game.Object();
Game.Object.Speed.prototype.constructor = Game.Object.Speed;



//*************************************************************************
// Entity Class
//************************
Game.Entity = function(){}
Game.Entity.prototype.update = function(){}
//************************
// IA Class
//************************
Game.IAEntity = function(){ Entity.call(this); }

Game.IAEntity.prototype = new Game.Entity();
Game.IAEntity.prototype.constructor = Game.IAEntity;

Game.IAEntity.prototype.update = function(){
    //IA code here
}

//************************
// Player Class
//************************
Game.Player = function(){ Entity.call(this); }

Game.Player.prototype = new Game.Entity();
Game.Player.prototype.constructor = Game.Player;

Game.Player.prototype.update = function(){
    //Player code here
}