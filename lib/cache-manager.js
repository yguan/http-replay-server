/*global require, module */

var repositoryFactory = require('./repository-factory'),
    serverMode = require('./server-mode'),
    requestWithResponseDbName = 'request-response',
    requestOnlyDbName = 'request-only',
    requestWithResponseRepo,
    requestOnlyRepo,
    mode;

function isInPassiveMode() {
    return mode === serverMode.passive;
}

function init(config) {
    mode = config.serverMode;

    requestWithResponseRepo = repositoryFactory.createRepository({
        databaseDirectory: config.databaseDirectory,
        databaseName: requestWithResponseDbName
    });

    requestOnlyRepo = repositoryFactory.createRepository({
        databaseDirectory: config.databaseDirectory,
        databaseName: requestOnlyDbName
    });
}

module.exports = {
    init: init,
    add: function (request, callback) {
        // need to queue and insert one by one or use setTimeout
        requestWithResponseRepo.add(request, callback);
        if (isInPassiveMode()) {
            requestOnlyRepo.add({key: request.key});
        }
    },
    update: function (request, callback) {
        requestWithResponseRepo.update(request, callback);
    },
    find: function (request, callback) {
        requestWithResponseRepo.find(request, callback);
    },
    getAll: function (callback) {
        requestWithResponseRepo.getAll(callback);
    }
};