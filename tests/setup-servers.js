/*global require */

var restify = require('restify'),
    testServer = require('../lib/test-server'),
    serverConfig = require('./server-config');

// Create the actual server that the test server acts as a proxy for.
function createTargetServer() {
    function getHandler(req, res, next) {
        console.log('target server: get is called');
        res.send('hello ' + req.params.name);
        next();
    }

    function postHandler(req, res, next) {
        console.log('target server: post is called');
        res.send(201, 'hello ' + req.params.name);
        return next();
    }

    var server = restify.createServer({
        name: 'myapp',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/hello/:name', getHandler);
    server.head('/hello/:name', getHandler);
    server.post('/post', postHandler);

    server.listen(serverConfig.targetServer.port, function () {
        console.log('%s target server listening at %s', server.name, server.url);
    });
}

// Create the test server as a proxy to the actual server.
function createTestServer() {
    testServer.createServer({
        serverMode: serverConfig.testServer.serverMode,
        port: serverConfig.testServer.port,
        targetServerUrl: serverConfig.targetServer.url,
        databaseDirectory: 'C:\\Users\\coding\\Documents\\GitHub\\test-server\\db-files\\',
        requestFilter: function (req, resp) {
            if (req.url.indexOf('\/hello') === 0) {
                return false; // Ignore the intercept request
            }
            return true; // Process the intercept request
        }
    });
}

createTargetServer();
createTestServer();

// test: http://localhost:9006/hello/some


