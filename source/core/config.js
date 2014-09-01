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

    //--------
    //System
    //--------
    Server: {
        multiCore: false,
        cluster: false,
    }
}