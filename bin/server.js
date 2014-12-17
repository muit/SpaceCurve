if(typeof Utyl == "undefined") require("../source/utyl/utyl.js");
config = require("../source/core/config.js");
serveme = require("serve-me");
ws = require("../source/core/ws_server.js");

//*******************************
// HTTP SERVER
// Only server the html & other files
//*******************************
var ServeMe = require("serve-me")(config.server);

var http_server = ServeMe.start(8080);

//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************

websocketServer = ws.start(14494);
