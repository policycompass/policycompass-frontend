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
 * Default port is 9000
 *
 */
var http = require('http'),
    nstatic = require('node-static'),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    nconf = require('nconf'),
    mime = require('mime'),
    port = process.argv[2] || 9000;

nconf.file('development.json');

var pcServicesUrl = nconf.get('PC_SERVICES_URL');
var elasticSearchUrl = nconf.get('ELASTIC_SEARCH_URL');
var fcmServicesUrl = nconf.get('FCM_SERVICES_URL');
var fileServer = new nstatic.Server('');

// Heavily inspired by this Gist: https://gist.github.com/rpflorence/701407
http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    console.log('[%s] "%s %s" "%s"', (new Date).toUTCString(), request.method, request.url, request.headers['user-agent']);

    // Serve static files and handle rewrites to app (for development environment)
    if (/^\/(app|)$/.exec(request.url)) {
        response.writeHead(302, {"location": "/app/"});
        response.end();
    } else {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }
}).listen(parseInt(port, 10));

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");
