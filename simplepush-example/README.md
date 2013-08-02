aerogear-simplepush-quickstart
==============================

An introduction to SimplePush and what AeroGear offers around SimplePush!

What is SimplePush?
-------------------

[SimplePush](https://wiki.mozilla.org/WebAPI/SimplePush) is a specification from Mozilla that describes a JavaScript API and a protocol which allows backend/application developers to send notification messages to their web applications. Originally SimplePush was introduced for Firefox OS but there are plans to establish the API on the desktop and mobile browsers as well.

Firefox OS v1.1 uses SimplePush as its _Push Notification_ technology. Firefox OS Push Notifications are designed for one thing – waking up apps. They do not deal with data, desktop notifications and other features, since there are other Web APIs that provide them. From the very beginning SimplePush was designed to explicitly not carry any payload. Instead a version number is sent to the client. Based on that version number the client can perfom an action, e.g. refresh a view of data.

Mozilla published a very detailed [article](https://hacks.mozilla.org/2013/07/dont-miss-out-on-the-real-time-fun-use-firefox-os-push-notifications/) that explains the API in depth.

AeroGear and SimplePush
-----------------------

The AeroGear project offers two components around Mozilla's SimplePush:

* a polyfill JavaScript client library
* a Server implementation of the protocol

Inside of the [SimplePush Protocol](https://wiki.mozilla.org/WebAPI/SimplePush/Protocol) it is specified that the connection between the clients (e.g. a Firefox OS device or a Firefox browser) and the server needs to be established over a (secure) WebSocket connection.

Since the AeroGear polyfill library supports other browsers that may lack WebSocket support or are using an older version of the standard, a transparent fallback strategy has been implemented. The [SockJS](https://github.com/sockjs/sockjs-client) protocol is supported on both sides: the JavaScript library and the server implementation.



### AeroGear's SimplePush Server

The [AeroGear SimplePush Server](https://github.com/aerogear/aerogear-simple-push-server) is written in Java and based on the [Netty](http://netty.io) Framework. The server supports three different runtime platforms for your deployment:

* standalone java process (used in this quickstart)
* vert.x - A server plugin for the vert.x platform
* WildFly/AS7 - A module to embed the server within WildFly/AS7

### AeroGear.js

The polyfill nature of the SimplePush support in AeroGear.js makes it easy to run SimplePush in any browser, there is _no_ limitation to Firefox OS or the Firefox browsers.

Getting started!
----------------

### Building the AeroGear SimplePush Server

Before diving into the JavaScript library, we need to build the [AeroGear SimplePush Server](https://github.com/aerogear/aerogear-simple-push-server). A few prerequisites are required before you can build the actual SimplePush Server:

The Netty SockJS branch:

    git clone https://github.com/danbev/netty/tree/sockjs
    cd netty
    mvn install -DskipTests=true

The Netty Subsystem:

    git clone https://github.com/danbev/netty-subsystem
    cd netty-subsystem
    mvn install -DskipTests=true

Finally clone the [AeroGear SimplePush Server](https://github.com/aerogear/aerogear-simple-push-server) git repository and build the source code:

    git clone git@github.com:aerogear/aerogear-simple-push-server.git
    cd aerogear-simple-push-server
    mvn install -DskipTests=true

Now perform a ```cd server-netty``` and execute the following command to start the server on your machine:


    mvn exec:java -Dexec.args="-host=localhost -port=7777 -tls=false -ack_interval=10000 -useragent_reaper_timeout=60000" 

This starts an _unsecured_ instance of the AeroGear SimplePush Server on localhost using port 7777.

**_NOTE_:** The server uses an in-memory database for this demo. None of the SimplePush channels are persisted by the server. A restart of the server means that the previous registered channels are gone.


### JavaScript client

Simply open the ```index.html``` file in a browser of your choice. This will establish a (SockJS) connection to the SimplePush server and, once established, it will request a _subscription_ to a _mail_ endpoint on the SimplePush server. When ever the SimplePush server receives a notification, it will send it to the client, using the same SockJS connection.


_More details on the JavaScript code are covered below...._


### Send a message

Now that we have a connected client it is time to send a message to the client. If the above connection was successful, the browser should have logged a

    Subscribed to Mail messages on {channelID} 

message.


For sending a notification to the client take a note of the ```channelID``` and add it the the ```cURL``` command below:

    curl -i --header "Accept: application/x-www-form-urlencoded" -X PUT -d "version=2" http://localhost:7777/endpoint/{channelID}

This sends a ```HTTP PUT``` request to the SimplePush server and the server will deliver the message to the connected client.

**Congratulations!** You have received your first notification using AeroGear's SimplePush offerings!


**_NOTE_:** If you want to send another push notification to that endpoint, make sure you are _increasing_ the version number (e.g. ```version=3``` or ```version=4``` in this case)! Using the name ```version``` for that given endpoint does **not** cause a push notification to be sent to the client.


Details: The JavaScript client
------------------------------

Now after a successful test, let's have a look at the JavaScript that is involved. Open the ```js/simplepush.js``` file in a text editor or IDE of your choice.

Near the bottom of the JavaScript file the connection to the SimplePush server is established:

    SPClient = AeroGear.SimplePushClient({
        simplePushServerURL: "http://localhost:7777/simplepush",
        onConnect: spConnect,
        onClose: spClose
    });

In our polyfill library the AeroGear SimplePushClient takes a few arguments:

* ```simplePushServerURL``` - the URL of the SimplePush Server
* ```onConnect``` - a callback being invoked after the connection has been established
* ```onClose``` - a callback being invoked if the connection has been closed or interrupted.

**Note:** This behavior is slightly different from the native environment in Firefox OS, since the device there is reponsible for maintaining one peristent connection to the actual Push Network (aka the SimplePush server). _The code below matches the SimplePush API from Mozilla._

Inside of the ```spConnect``` callback function we use the _PushManager_ object (```navigator.push```) to request a notification endpoint from the SimplePush server:

    // use 'PushManager' to request a new
	// PushServer URL endpoint for 'mail' notifications:
	mailRequest = navigator.push.register();

If the request was successful, the ```onsuccess``` function of the request object is invoked to perform some code which handles the successful 'registration':

    // the request returns 'successfully':
    mailRequest.onsuccess = function( event ) {...}

Besides storing the returned ```endpoint``` and logging its ```channelID``` nothing special is done here. Next we need to setup a message handler:

    // set the notification handler:
    navigator.setMessageHandler( "push", function( message ) {
        // we got message for our 'mail' endpoint ?
        if ( message.channelID === mailEndpoint.channelID ) {
            // let's react on that mail....
            appendTextArea("Mail Notification - " + message.version);
        }
    });

The notification handler receives any ```push``` message/event. Inside of the attached function, we perform some application specific JavaScript code. First we check if the ```channelID``` of the received message matches the ```channelID``` of our notification endpoint. If that is the case, we log the current ```version``` of the new data.

**Note:** As said above, in SimplePush no payload is being sent to the client. In this quickstart nothing special is done. In a real web application it would be reasonable to perform a ```HTTP GET``` based on a received _version update_, to display the latest data.

### Have fun!
