//Prepare Objects
ifNotDefined("WsServer.Object.Bird");
ifNotDefined("WsServer.Object.Turtle");
ifNotDefined("WsServer.Object.CrossWall");
ifNotDefined("WsServer.Object.CrossLine");
ifNotDefined("WsServer.Object.Immunity");

Config = {
    Info: {
        version: "0.0.1",
        stable: false,
        repository: "https://github.com/muit/SpaceCurve"
    },
    //--------
    //Game
    //--------

    Map: {
        height: 400,
        width: 400,
    },

    Game: {
        maxPlayers: 6,
        waitTime: 5000
    },

    Player: {
        speed: 3,
        radius: 2,
        initialPos: "random", // Random/Corners
    },

    Object: {
        enabled: true,
        duration: 3500,
        respawnSpeed: 8000,
        enabledTypes: [
            WsServer.Object.Bird,
            WsServer.Object.Turtle,
            WsServer.Object.CrossWall,
            WsServer.Object.CrossLine,
            WsServer.Object.Immunity
        ],
    },

    //--------
    //System
    //--------
    Server: {
        cluster: false,
        clusterSize: 4, // number/"auto"
    }
}
