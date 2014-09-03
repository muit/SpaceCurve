'use strict';

//*******************************
// HTTP SERVER
// Only server the html & files
//*******************************

var https = ;
var urlParser = require('url');
var fs = require('fs');

exports.start = function(port)
{
    return new HttpServer(port);
}

//*******************************
// Http Server Class
//*******************************

var HttpServer = function(port, secure){
    var self = this;

    
    if(typeof secure == "undefined" || !secure){
        var options = {
            key: fs.readFileSync("keys/key.pem"),
            cert: fs.readFileSync("keys/cert.pem")
        };
        var https = require('https');
        var server = https.createServer(options, function(request, response){
            self.serve(self, request, response);
        });
    }
    else
    {
        var http = require('http');
        var server = http.createServer(function(request, response){
            self.serve(self, request, response);
        });
    }

    

    server.listen(port, function() {
        console.log('Http server running at port: ' + port);
    });
}

//*******************************
// Serve files or code
HttpServer.prototype.serve = function(self, request, response){
    var url = urlParser.parse(request.url, true);

    if (url.pathname == '/')
    {
        self.serveHome(self, request, response);
        return;
    }
    if (url.pathname == '/serve')
    {
        // will serve websocket
        return;
    }
    // avoid going out of the home dir
    if (url.pathname.contains('..'))
    {
        self.serveFile(404, 'not_found.html', response);
        return;
    }
    if (url.pathname.startsWith('/src/'))
    {
        self.serveFile(200, '..' + url.pathname, response);
        return;
    }
    self.serveFile(200, url.pathname, response);
}

//*******************************
// Serve index.html
HttpServer.prototype.serveHome = function(self, request, response){
    self.serveFile(200, 'index.html', response);
}

//*******************************
// Serve js or css
HttpServer.prototype.serveFile = function(status, file, response){
    fs.readFile('public/' + file, function(err, data) {
        if (err)
        {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.end('Page not found');
            return;
        }

        var type = 'text/html';

        if (file.endsWith('.js'))
            type = 'text/javascript';

        if (file.endsWith('.css'))
            type = 'text/css';

        response.writeHead(status, {
            'Content-Length': data.length,
            'Content-Type': type
        });
        response.end(data);
    });
}