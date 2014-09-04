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

modules["game"] = Game;
