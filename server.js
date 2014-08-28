var http = require('http');
var urlParser = require('url');
var fs = require('fs');
//*******************************
// HTTP SERVER
// Only server the html & files
//*******************************


var HttpServer = function(){
    var server = http.createServer(this.serve).listen(port, function() {
        console.log('Http server running at port: ' + port);
    });
}
HttpServer.prototype.serve = function(request, response)
{
    var url = urlParser.parse(request.url, true);

    if (url.pathname == '/')
    {
        this.serveHome(request, response);
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
        this.serveFile(404, 'not_found.html', response);
        return;
    }
    if (url.pathname.startsWith('/src/'))
    {
        this.serveFile(200, '..' + url.pathname, response);
        return;
    }
    this.serveFile(200, url.pathname, response);
}

HttpServer.prototype.serveHome = function(request, response)
{
    this.serveFile(200, 'index.html', response);
}

HttpServer.prototype.serveFile = function(status, file, response)
{
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

//*******************************
// SOCKET SERVER
// Makes all the logic
//*******************************