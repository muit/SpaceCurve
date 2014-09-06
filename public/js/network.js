document.host=document.URL.split("/")[2].split(":")[0];

Network = function(port){
    this.socket = io.connect(document.host+":"+port, {secure: true});
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
    this.socket.on("players", function(data){ 
        callback(data.players); 
    });
}

Network.prototype.onObjects = function(callback){
    this.socket.on("objects", function(data){ 
        callback(data.objects); 
    });
}

