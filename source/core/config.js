//Prepare Objects
ifNotDefined("WsServer.Object.Bird");
ifNotDefined("WsServer.Object.Turtle");
ifNotDefined("WsServer.Object.CrossWall");
ifNotDefined("WsServer.Object.CrossLine");
ifNotDefined("WsServer.Object.Immunity");

exports.Config = {
    //--------
    //Game
    //--------

    Map: {
        height: 400,
        width: 400,
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