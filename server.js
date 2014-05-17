var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	httpProxy = require('http-proxy'),
	port = process.argv[2] || 8000;

var apiServerUrl = 'http://xubuntu:8000';

var proxy = httpProxy.createServer();

// Heavily inspired by this Gist: https://gist.github.com/rpflorence/701407
http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname
	, filename = path.join(process.cwd(), uri);
	
	console.log('[%s] "%s %s" "%s"', (new Date).toUTCString(), request.method, request.url, request.headers['user-agent']);
	
	if (/^\/api/.exec(request.url)) {
	    proxy.web(request, response, {
	      target: apiServerUrl
	    });
	} else {
		
		fs.exists(filename, function(exists) {
			if(!exists) {
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				return;
			}

			if (fs.statSync(filename).isDirectory()) filename += '/index.html';

			fs.readFile(filename, "binary", function(err, file) {
				if(err) {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}

				response.writeHead(200);
				response.write(file, "binary");
				response.end();
			});
		});
		
	}
		
}).listen(parseInt(port, 10));

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");