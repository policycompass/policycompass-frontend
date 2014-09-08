/**
 * Policy Compass Portal Development Server
 * v0.1 
 * 
 * Author: Fabian Kirstein 2014
 * 
 * This is a small Node.js web server for development.
 * It includes a Proxy functionality to proxy the external services. This
 * is necessary due to the Same-Origin-Policy. 
 * 
 * Configuration: Put the domains of the services in the development.json
 * Start: node server.js [port]  
 * 
 * Default port is 8000
 * 
 */
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	httpProxy = require('http-proxy'),
	nconf = require('nconf'),
	port = process.argv[2] || 9000;

nconf.file('development.json');

var pcServicesUrl = nconf.get('PC_SERVICES_URL');

var proxy = httpProxy.createServer();

// Heavily inspired by this Gist: https://gist.github.com/rpflorence/701407
http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname
	, filename = path.join(process.cwd(), uri);
	
	console.log('[%s] "%s %s" "%s"', (new Date).toUTCString(), request.method, request.url, request.headers['user-agent']);

	//Proxy all requests for the metrics service to the Data Manager
	// /api/v*/metrics
	if (/^\/api\/v[0-9]+\/metricsmanager/.exec(request.url)) {
	    proxy.web(request, response, {
	      target: pcServicesUrl
	    });
	} else if (/^\/api\/v[0-9]+\/references/.exec(request.url)) {
        proxy.web(request, response, {
            target: pcServicesUrl
        });
    }
    else {
		
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