if(typeof Utyl == "undefined") require("../source/utyl/utyl.js");
require("../source/core/config.js");
http = require("../source/core/http_server.js");
ws = require("../source/core/ws_server.js");

//*******************************
// HTTP SERVER
// Only server the html & other files
//*******************************

httpServer = http.start(80, {debug: true, secure: false});

//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************

websocketServer = ws.start(14494);
