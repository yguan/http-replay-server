/*global require, module */

var Engine = require('tingodb')();

function repository(config) {
    var db = new Engine.Db(config.databaseDirectory, {});
    this.collection = db.collection(config.databaseName);
}

repository.prototype.add = function (document, callback) {
    this.collection.insert(document, callback);
};

repository.prototype.update =  function (document, callback) {
    this.collection.update({_id: document._id}, document, callback);
//    this.collection.findAndModify(
//        {_id: document._id} // query
//        [['_id','asc']],  // sort order
//        {}, // replacement, replaces only the field "hi"
//        {remove: true}, // options);
//        callback);
};

repository.prototype.find = function (document, callback) {
    this.collection.findOne(document, callback);
};

repository.prototype.getAll = function (callback) {
    this.collection.find().toArray(callback);
};

module.exports = repository;