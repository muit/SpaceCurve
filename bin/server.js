Util = require("../source/core/util.js");
require("../source/core/config.js");
http = require("../source/core/http_server.js");
ws = require("../source/core/ws_server.js");

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
