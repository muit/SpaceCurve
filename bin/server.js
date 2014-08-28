Util = require("../src/util.js");
http = require("../src/http_server.js");
ws = require("../src/ws_server.js");

//*******************************
// HTTP SERVER
// Only server the html & files
//*******************************

httpServer = http.start(3000);

//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************

websocketServer = ws.start(14494);