var http = require('http');
var urlParser = require('url');
var fs = require('fs');
//*******************************
// HTTP SERVER
// Only server the html & files
//*******************************
var HttpServer = function(){
    var port = 3000;
    
    var self = this;
    var server = http.createServer(function(request, response){
       self.serve(self, request, response);
    });

    server.listen(port, function() {
        console.log('Http server running at port: ' + port);
    });
}
HttpServer.prototype = {
    serve: function(self, request, response){
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
    },

    serveHome: function(self, request, response){
        self.serveFile(200, 'index.html', response);
    },

    serveFile: function(status, file, response){
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
}

String.prototype.startsWith = function (str)
{
    return this.slice(0, str.length) == str;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(str){
    return this.indexOf(str) != -1;
};

var httpServer = new HttpServer();
//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************
