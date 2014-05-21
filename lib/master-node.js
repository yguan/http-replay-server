/*global require, module */

var restify = require('restify'),
    HttpReplayServer = require('./http-replay-server'),
    CacheServer = require('./cache-server');

function createMasterNode() {
    var server = restify.createServer({
        name: 'Master-Node',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    return server;
}

function createHandlers() {
    var me = this;
    return {
        init: function (config) {
            me.httpReplayServer = HttpReplayServer.createServer(config.httpReplayServer);
            me.cacheServer = CacheServer.createServer(config.cacheServer);
        },
        setHttpReplayServerMode: function (req, res, next) {
            var mode = req.params['mode'];
            me.httpReplayServer.setServerMode(mode);
            res.send('http replay server is set to mode: ' + mode);
            next();
        },
        setCacheServerMode: function (req, res, next) {
            console.log(Object.keys(req));
            var mode = req.url;
            me.cacheServer.setServerMode(mode);
            res.send('http replay server is set to mode: ' + mode);
            next();
        }
    };
}

function createServer(config) {
    var masterNode = createMasterNode(),
        handlers = createHandlers();

    handlers.init(config);
    masterNode.post('/setHttpReplayServerMode', handlers.setHttpReplayServerMode);
    masterNode.post('/setCacheServerMode', handlers.setCacheServerMode);

    masterNode.listen(config.masterNode.port, function () {
        console.log('%s target server listening at %s', masterNode.name, masterNode.url);
    });
}

module.exports = {
    createServer: createServer
};
