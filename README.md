# Http Replay Server

This repository contains the source code to a server that allows you to intercept http requests and responses from the real server, store them to text files, and then send the cached responses back to client for repetitive requests.

## The Key Ideas Behind the Http Replay Server

You can find the details [here](http://yguan.github.io/repos/writings/#test-automation?article=test-server).

## Development

#### Overview of Folder Structure

`lib` contains the source code for the Http Replay Server.

* `test-server.js` is the main entry point to http replay server.

`test` contains the sample code to set up test server, fake real server, and test client.

* `server-config.js` contains the configuration for servers.
* `setup-servers.js` contains the code to setup a test server and a fake real server.
* `run-client-tests.js` contains the code to make http requests to the test server.

## Installation

There isn't a npm package for Http Replay Server yet, you have to get the git repository, and then run `npm install`.

## See the Test Server in Action

In your command line consoles, run the following steps:

* Go to `http-replay-server` folder.
* Run `node setup-servers.js` to start a test sever and a fake real server.
* Run `node run-client-tests.js` to start a http client that makes requests to the test server.
* In the `setup-server` console, it shows the output from the test server and the fake real server.
* In the `run-client-tests` console, it shows the responses from the test server.
* The data cached by the test server is stored as text files in `test-server\db-files`. The folder can be changed in `server.config.js`.

## License

[MIT](http://opensource.org/licenses/MIT)