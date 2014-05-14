/**
 * Start this server by:
 *
 *     $ vertx run vertx-server.js
 */
var vertx = require('vertx');
var console = require('vertx/console');

var httpServer = vertx.createHttpServer();

// server static resources from an 'app/' directory
httpServer.requestHandler(function(req) {
    var file = req.path() === '/' ? 'index.html' : req.path();
    req.response.sendFile('app/' + file);
});

// bridge vert.x eventbus communication with sockjs clients such as AeroGear Notifier
var sockJSServer = vertx.createSockJSServer(httpServer);
sockJSServer.bridge(
    // expose the sockjs bridge on the specific path
    { prefix : '/eventbus'},
    // allow incoming messages sent to given address
    [{ address: 'chat.messages' }],
    // allow outbound messages coming from given address
    [{ address: 'chat.messages' }]
);

// subscribe to all chat messages
vertx.eventBus.registerHandler('chat.messages', function(message) {
    console.log(JSON.stringify(message));
});

httpServer.listen(8080);
console.log('Running on port 8080...');