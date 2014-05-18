/*global require, module */

var serverMode = require('../lib/server-mode');

module.exports = {
    targetServer: {
        port: 9005,
        url: 'http://localhost:9005'
    },
    testServer: {
        serverMode: serverMode.active, // or serverMode.passive
        port: 9007,
        url: 'http://localhost:9007'
    }
};


