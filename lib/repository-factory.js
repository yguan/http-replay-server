/*global require, module */

var Repository = require('./repository');

module.exports = {
    createRepository: function (config) {
        return new Repository(config);
    }
};