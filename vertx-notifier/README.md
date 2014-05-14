Vert.x Notifier
===============

**Problem**

We want to leverage asynchronous messaging

**Solution**

AeroGear.js provides a simple API, called "Notifier", to allow exchange of messages between client and server or between clients themselves.

Notifier API implements simple messaging operations such as "connect", "subscribe", "send", and "disconnect".

A simple Notifier can be created like so:

    var notifiers = AeroGear.Notifier({ name: 'chat'});

By default, the "vertx" notifier is created. This Notifier allows to subscribe for and send messages to Vert.X EventBus.

Notifier is really just a container for "notifiers". Any number of "notifiers" can be added to a notifier:

    notifiers.add( { name: 'chat' } );

This creates a notifier that can connect to a backend.

Usually we also want to specify a backend (an eventbus), instruct notifier to connect automatically and once connected, we can subscribe to the list of "channels":

    var chatNotifier = notifiers.add( {
        name: 'chat',
        settings: {
            connectURL: 'http://localhost:8080/eventbus',
            autoConnect: true,
            onConnect: function() {
                chatNotifier.subscribe({
                    address: 'channel.name',
                    callback: function(message) {
                        ... // process message
                    }
                });
            }
        }
    }


Then you can publish the message:

    chatNotifier.send('channel.name', { any: 'object' });

That sends a message to exactly one subscribed client.

In order to broadcast messages, you can specify a "publish" flag:

    chatNotifier.send('channel.name', { other: 'object' }, true);

**Working Code Example**

To run the example code, first [download and install Vert.x](http://vertx.io/).

Note: Vert.x 2.0.2 was used in the time of releasing this cookbook, but any 2.x version should be fine.

Then, download all browser dependencies:

    $ bower install

This will pull down the dependent javascript/css files, such as aerogear and jquery, into the project.

At the end, run the demo:

    $ vertx run vertx-server.js

This will start a Vert.x server instance that will both, server application to your browser and expose an eventbus.

Point your browser to [localhost:8080](http://localhost:8080) to test it out.

Then open a new browser window with the same application.

If you send messages in the first window, you will see them propagated to the second window and vice versa.

You should also see raw messages printed in the server console output.


