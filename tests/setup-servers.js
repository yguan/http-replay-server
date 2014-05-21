/*global require */

var restify = require('restify'),
    serverConfig = require('./server-config'),
    masterNode = require('../lib/master-node');

// Create the actual server that the test server acts as a proxy for.
function createTargetServer(config) {
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
        name: 'Target Server',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.get('/hello/:name', getHandler);
    server.head('/hello/:name', getHandler);
    server.post('/post', postHandler);

    server.listen(config.port, function () {
        console.log('%s target server listening at %s', server.name, server.url);
    });
}

createTargetServer(serverConfig.targetServer);
// test: http://localhost:9006/hello/some

masterNode.createServer(serverConfig);


