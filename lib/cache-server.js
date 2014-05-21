/*global require, module */

var restify = require('restify'),
    cacheManager = require('./cache-manager'),
    async = require('async'),
    url = require('url'),
    request = require('request'),
    targetServerUrl;

function createRequestOption(requestCache) {
    var request = JSON.parse(requestCache.key),
        options = {
            uri: url.resolve(targetServerUrl, request.url),
            method: request.method
        };
    return options;
}

function sendRequest(requestCache, callback) {
    var options = createRequestOption(requestCache);
    request(options, function (res) {
        // todo: save the response to database
        console.log(options);
        callback();
    });
}

function refreshAllResponses(req, res, next) {
    cacheManager.getAll(function (err, results) {
        async.eachSeries(results, function (requestCache, callback) {
            // Perform operation on file here.
            sendRequest(requestCache, callback);
        }, function (err) {
            // if any of the file processing produced an error, err would equal that error
        });
    });
    res.send('refresh all responses task is done');
    next();
}

function createServer(config) {
    var server = restify.createServer({
        name: 'Cache-Server',
        version: '1.0.0'
    });
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.post('/refreshAllResponses', refreshAllResponses);

    server.listen(config.port, function () {
        console.log('%s target server listening at %s', server.name, server.url);
    });

    cacheManager.init(config);
    targetServerUrl = config.targetServerUrl;

    return {
        setServerMode: function (serverMode) {
            cacheManager.setServerMode(serverMode);
        }
    };
}

module.exports = {
    createServer: createServer
};
