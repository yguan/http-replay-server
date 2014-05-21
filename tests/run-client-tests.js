/*global require */

var unirest = require('unirest'),
    serverConfig = require('./server-config');

function testGet() {
    unirest.get(serverConfig.httpReplayServer.url + '/hello/get-someone')
        .end(function (response) {
            console.log('test GET');
            console.log(response.body);
        });
}

function testPost() {
    unirest.post(serverConfig.httpReplayServer.url + '/post')
        .headers({ 'Accept': 'application/json' })
        .send({ 'name': 'post-someone' })
        .end(function (response) {
            console.log('test POST');
            console.log(response.body);
        });
}

testGet();
testPost();

// post to master http://localhost:9003/setHttpReplayServerMode?mode=passive