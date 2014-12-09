
SC.modules.game = Game;

/** section: Game API
 * class Component
 *
 * An abstract base class for game components. It cannot be instantiated
 * directly, but its subclasses are the building blocks for SGF games.
 * @constructor
 **/
function Game(options){
    if(options === undefined){
        options.debug = false;
    }

    var self = this;
    self.reload();
    window.onresize = function(){
        self.reload(options);
    };

    this.loadEvents();
}

Game.prototype.reload = function(options)
{
    var canvas = document.getElementById("canvas");
    if(!canvas)
        throw new Error("Canvas element does not exist.");

    this.turbulenzEngine = WebGLTurbulenzEngine.create({ canvas: canvas });

    this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
};

Game.prototype.loadEvents = function()
{
    var self = this;
    network.onGameStatus(function(data)
    {
        if(data.error)
        {
            SC.log(data.msg);
            return;
        }
        switch(data.value)
        {
            case 0:
            self.pause();
            break;

            case 1:
            __.Dialog.Counter.setTime(5000);
            break;

            case 2:
            self.start();
            __.Dialog.Counter.hide();
            break;
        }
    });
};

Game.prototype.start = function()
{
    this.done = false;

    network.onInfo(function(players)
    {

    },
    function(objects)
    {

    });

    this.bucle();
};
Game.prototype.pause = function()
{
    this.done = true;
};

Game.prototype.objects = [];
Game.prototype.entities = [];

Game.prototype.bucle = function()
{
    var self = this;
    self.turbulenzEngine.setInterval(function()
    {
        /* Update */
        self.update();
        /* Render */
        if (graphicsDevice.beginFrame())
        {
            self.graphicsDevice.clear(bgColor, 1.0);
            self.render();
            self.graphicsDevice.endFrame();
        }
    }, 1000 / 60);
};
Game.prototype.render = function()
{
    this.renderer.render(this.scene, this.camera);
};

Game.prototype.update = function(diff)
{
};

Game.prototype.add = function(element)
{
    if(!element.gl)
        throw new Error("Element don't have gl module.");
    this.scenene.add(element.glMesh);
};







//*************************************************************************
// Component Class
// Father of everything
//************************
Game.Component = function(x, y, z)
{
    if(x === undefined || y === undefined || z === undefined)
        throw new Error("Component: Cant create without valid coordinates.");

    this.position = new Vector3(x, y, z);
};
Game.Component.prototype.position = new Vector3(0,0,0);
Game.Component.prototype.setPosition = function(x, y, z)
{
    this.position = new Vector3(x, y, z);
};

Game.Component.prototype.rotation = new Vector3(0,0,0);
Game.Component.prototype.setRotation = function(x, y, z)
{
    this.rotation = new Vector3(x, y, z);
};

//*************************************************************************
// Entity Class
//************************
Game.Entity = function(color)
{
    this.setColor(color);
};
Game.Entity.inherits(new Game.Component(0,0,0));

Game.Entity.prototype.setColor = function(color)
{
    if(color == "random")
        this.color = new RGB(Math.randomRange(0,255),Math.randomRange(0,255),Math.randomRange(0,255));
    else if(color instanceof RGB || color instanceof RGBA)
        this.color = color;
};

//************************
// IA Class
//************************
Game.IAEntity = function(){ Entity.call(this, "random"); };
Game.IAEntity.inherits(Game.Entity);

//************************
// Player Class
//************************
Game.Player = function(){ Entity.call(this, "random"); };
Game.Player.inherits(Game.Entity);


//*************************************************************************
// Object Class
//************************
Game.Object = function(){};
Game.Object.inherits(new Game.Component(0,0,0));
Game.Object.icon = "img/object.png";
//************************
//Object Types
//************************
Game.Object.Bird = function(){};
Game.Object.Bird.inherits(Game.Object);
Game.Object.Bird.icon = "img/object_bird.png";

Game.Object.Turtle = function(){};
Game.Object.Turtle.inherits(Game.Object);
Game.Object.Turtle.icon = "img/object_turtle.png";

Game.Object.CrossWall = function(){};
Game.Object.CrossWall.inherits(Game.Object);
Game.Object.CrossWall.icon = "img/object_crosswall.png";

Game.Object.CrossLine = function(){};
Game.Object.CrossLine.inherits(Game.Object);
Game.Object.CrossLine.icon = "img/object_crossline.png";

Game.Object.Immunity = function(){};
Game.Object.Immunity.inherits(Game.Object);
Game.Object.Immunity.icon = "img/object_immunity.png";
