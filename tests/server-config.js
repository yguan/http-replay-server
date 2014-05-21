/*global require, module */

var serverMode = require('../lib/server-mode'),
    targetServer = {
        port: 9007,
        url: 'http://localhost:9007'
    },
    databaseDirectory = 'C:\\Users\\coding\\Documents\\GitHub\\http-replay-server\\db-files\\';

module.exports = {
    masterNode: {
        port: 9003
    },
    httpReplayServer: {
        serverMode: serverMode.active, // or serverMode.passive
        url: 'http://localhost:9004',
        port: 9004,
        targetServerUrl: targetServer.url,
        databaseDirectory: databaseDirectory,
        requestFilter: function (req, resp) {
            if (req.url.indexOf('\/hello') === 0) {
                return false; // Ignore the intercept request
            }
            return true; // Process the intercept request
        }
    },
    cacheServer: {
        serverMode: serverMode.active,
        port: 9005,
        targetServerUrl: targetServer.url,
        databaseDirectory: databaseDirectory
    },
    targetServer: targetServer
};


