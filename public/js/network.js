/** section: Network API
 * class Network
 *
 * Network class controls all the multiplayer events, data sending, and networking.
 * Each Network instance is a new player in the server.
 * @constructor
 **/
Network = function(port)
{
    this.logged = false;
    this.socket = io.connect(document.host+":"+port, {secure: true});
    var self = this;
    this.socket.on('connect_error', function(err)
    {
        self.logged = false;
        SC.log("Couldn't connect to server. Retrying...");
    });

    this.socket.on('disconnect', function()
    {
        self.logged = false;

        if(__.Url.current() !== undefined)
        {
            __.Url.current().aside("login");
            errorElem = document.querySelector("#login > [data-atom-button], #error");
            errorElem.innerHTML = "Disconnected from server.";
            errorElem.style.display = "block";
        }
    });
};

Network.prototype.isConnected = function(){ return network.socket.connected; };
Network.prototype.login = function(name, password, success, error)
{
    if(!this.isConnected())
    {
        if(error !== undefined) error("Not connected to server.");
        return;
    }
    if(!this.logged)
    {
        var self = this;
        this.socket.on("login", function(res)
        {
            self.socket.removeAllListeners("login");
            if(!res.error)
            {
                self.logged = true;
                if(success !== undefined) success(res.msg);
            }
            else
            {
                self.logged = false;
                if(error !== undefined) error(res.msg);
            }
        });
        this.socket.emit("login", name, password);
    }
};

Network.prototype.signup = function(name, email, password, success, error)
{
    if(!this.isConnected())
    {
        if(error !== undefined) error("Not connected to server.");
        return;
    }
    //Not yet
};

Network.prototype.logout = function()
{
    if(!this.isConnected())
    {
        SC.log("Not connected to server.");
    }
    if(this.logged)
    {
        this.socket.emit("logout", {});
        this.logged = false;
    }
};

Network.prototype.onInfo = function(players, objects){
    this.socket.removeAllListeners("info");
    this.socket.on("info", function(data){
        players(data.players);
        objects(data.objects);
    });
};

Network.prototype.getGames = function(games){
    if(!this.isConnected())
    {
        games({error: true, msg: "Not connected to server."});
        return;
    }
    this.socket.emit("games", {});
    var self = this;
    this.socket.on("games", function(data)
    {
        self.socket.removeAllListeners("games");

        SC.log("Games received from server");
        if(data.error === undefined) data.error = true;
        games(data);
    });
};

Network.prototype.joinGame = function(id, callback){
    if(!this.isConnected())
    {
        callback({error: true, msg: "Not connected to server."});
        return;
    }
    var self = this;
    this.socket.on("joingame", function(data)
    {
        self.socket.removeAllListeners("joingame");

        SC.log(data.msg);
        if(data.error === undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("joingame", {id: id});
};

Network.prototype.createGame = function(name, callback)
{
    if(!this.isConnected())
    {
        callback({error: true, msg: "Not connected to server."});
        return;
    }
    var self = this;
    this.socket.on("creategame", function(data)
    {
        self.socket.removeAllListeners("creategame");

        SC.log(data.msg);
        if(data.error === undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("creategame", {name: name});
};

Network.prototype.exitGame = function(callback){
    if(!this.isConnected())
    {
        callback({error: true, msg: "Not connected to server."});
        return;
    }

    var self = this;
    this.socket.on("exitgame", function(data)
    {
        self.socket.removeAllListeners("exitgame");

        SC.log(data.msg);
        if(data.error === undefined) data.error = true;
        callback(data);
    });
    this.socket.emit("exitgame", {});
};

Network.prototype.onGameStatus = function(callback){
    var self = this;
    self.socket.removeAllListeners("gamestatus");
    self.socket.on("gamestatus", function(data)
    {
        SC.log("Game State: "+data.value);
        if(data.error === undefined) data.error = true;
        callback(data);
    });
};

Network.prototype.startGame = function(callback)
{
    if(!this.isConnected())
    {
        callback({error: true, msg: "Not connected to server."});
        return;
    }

    var self = this;
    this.socket.on("startgame", function(data)
    {
        self.socket.removeAllListeners("startgame");
        console.log(data);
        //if(data.error == undefined) data.error = true;
        //callback(data);
    });
    this.socket.emit("startgame", {});
};

SC.modules.network = Network;