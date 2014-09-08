document.host=document.URL.split("/")[2].split(":")[0];

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