/*global require, module */

var hoxy = require('hoxy'),
    requestCacheObjectFactory = require('./request-cache-object-factory');

/**
 * Creates the test server.
 *
 * Examples:
 *
 *    testServer.createServer({ .. }, 8000)
 *    // => '{ web: [Function], ws: [Function] ... }'
 *
 * @param {Object} config Config object passed to the server
 * @param {number} config.serverMode The server mode.
 * @param {number} config.port The port that test server listens to.
 * @param {string} config.targetServerUrl The url to the server that test server acts as proxy.
 * @param {string} config.databaseDirectory The directory that test server to store its database files.
 * @param {Function} config.createRequestCache Return the request object for saving to database.
 * @param {Function} config.requestFilter Determine if a request should be included or excluded. True for inclusion.
 *
 * @return {Object} server Test server object
 *
 * @api public
 */
function createServer(config) {
    var me = this,
        proxy = new hoxy.Proxy({
            reverse: config.targetServerUrl
        }).listen(config.port),
        cacheManager = require('./cache-manager'),
        serverMode = require('./server-mode'),
        createRequestCache = config.createRequestCache || requestCacheObjectFactory.createRequestCache;

    me.serverMode = config.serverMode;

    function isInActiveMode() {
        return me.serverMode === serverMode.active;
    }

    cacheManager.init(config);

    proxy.intercept({
        phase: 'request',
        as: 'string',
        filter: config.requestFilter
    }, function (req, resp) {

        cacheManager.find(createRequestCache(req), function (err, result) {
            if (result) {
                // The response is now populated so the server call is skipped. Status code will default to 200.
                // resp.statusCode = 200;

                resp.cacheId = result._id;

                if (isInActiveMode()) { // use cache

                    resp.string = result.res.data;
                    resp.statusCode = result.res.statusCode;
                }
            }
        });
    });

    proxy.intercept({
        phase: 'response',
        as: 'string',
        filter: config.requestFilter
    }, function (req, resp) {

        if (!resp.cacheId) {
            // res.data contains extra leading and trailing quote
            resp.string = JSON.parse(resp.string);
            cacheManager.add(createRequestCache(req, resp));
        } else {
            if (!isInActiveMode()) {
                resp.string = JSON.parse(resp.string);
                cacheManager.update(createRequestCache(req, resp));
            }
        }
    });

    console.log("listening on port " + config.port);

    return {
        setServerMode: function (serverMode) {
            me.serverMode = serverMode;
            cacheManager.setServerMode(serverMode);
        }
    };
}

module.exports = {
    createServer: createServer
};
