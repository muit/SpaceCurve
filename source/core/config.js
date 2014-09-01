exports.Config = {
    //--------
    //Game
    //--------

    Map: {
        height: 400,
        width: 400,
        objects: true,
        objectTypes: ["bird", "crosswall", "turtle", "immunity"],
    },

    Player: {
        speed: 3,
        radius: 2,
        initialPos: "random", // Random/Corners
    },

    Object: {
        duration: 3500,
        respawnSpeed: 8000,
    },

    //--------
    //System
    //--------
    Server: {
        cluster: false,
        clusterSize: 4, // number/"auto"
    }
}