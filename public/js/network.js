
Network = function(port){
    this.socket = io.connect(document.URL+":"+port, {secure: true});
}
Network.prototype.login = function(name, password){
    var self = this;

    function result(res, msg){
        this.socket.removeAllListeners('login');
        console.log(msg);
    }

    this.socket.on("login", result);
    this.socket.emit("login", name, password);
}
Network.prototype.signup = function(name, email, password){
    //Not yet
}

Network.prototype.onPlayers = function(callback){
    this.socket.on("players", callback);
}

Network.prototype.onObjects = function(callback){
    this.socket.on("objects", callback);
}
