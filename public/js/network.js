document.host=document.URL.split("/")[2].split(":")[0];

Network = function(port){
    this.socket = io.connect(document.host+":"+port, {secure: true});
}
Network.prototype.login = function(name, password, success, error){
    var self = this;

    this.socket.on("login", function(res){
        self.socket.removeAllListeners('login');
        if(!res.error) 
            success(res.msg);
        else if(error != undefined) 
            error(res.msg);
    });
    this.socket.emit("login", name, password);
}
Network.prototype.signup = function(name, email, password){
    //Not yet
}

Network.prototype.onInfo = function(players, objects){
    this.socket.on("info", function(data){ 
        players(data.players);
        objects(data.objects);
    });
}

Network.prototype.getGames = function(games){
    this.socket.emit("games");
    this.socket.on("games", function(data){
        self.socket.removeAllListeners("games");
        games(data.games);
    });
}