//*************************************************************************
// Game Class
//************************
function Game(){
    this.done = false;
    this.scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0x555555);
    renderer.setSize(window.innerWidth, window.innerHeight);

    $("#canvas").append(renderer.domElement);

    this.render();
};

Game.prototype.render = function(){
    this.renderer.render(this.scene, this.camera); 
    if(!done)
        requestAnimationFrame(this.render);
}



//*************************************************************************
// Object Class
//************************
Game.Object = function(){}

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
Game.Entity.prototype.say = function(){
    console.log("Hola!");
};


//************************
// IA Class
//************************
Game.IAEntity = function(){
    //Entity.call(this);
}
Game.IAEntity.prototype = new Game.Entity();
Game.IAEntity.prototype.constructor = Game.IAEntity;

Game.IAEntity.prototype.say = function(){
    console.log("Hola IA!");
};


//************************
// Player Class
//************************
Game.Player = function(){
    //Entity.call(this);
}
Game.Player.prototype = new Game.Entity();
Game.Player.prototype.constructor = Game.Player;

Game.Player.prototype.say = function(){
    console.log("Hola Player!");
};