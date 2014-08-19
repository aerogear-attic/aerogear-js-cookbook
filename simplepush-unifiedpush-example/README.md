aerogear-simplepush-unifiedpush-quickstart
==============================

An example of using AeroGear's SimplePush/Unified Push JavaScript API. Based on [aerogear-simplepush-quickstart](https://github.com/aerogear/aerogear-simplepush-quickstart) enchancing to support registration with the UnifiedPush server.

Please visit our [tutorial page](http://aerogear.org/docs/guides/aerogear-push-js/) for more information.

Getting started!
----------------

#### Prerequisites

* Java 6.0 (Java SDK 1.6)+
* Maven
* JBoss Application Server 7.1.1 or later (e.g. WildFly)
* AeroGear UnifiedPush server
* AeroGear SimplePush server

### Building the AeroGear SimplePush Server

Download the server from the [AeroGear SimplePush Server](https://github.com/aerogear/aerogear-simplepush-server) project’s github page and build the source code:

    git clone git@github.com:aerogear/aerogear-simplepush-server.git
    cd aerogear-simplepush-server
    mvn install -DskipTests=true

Now perform a ```cd server-netty``` and execute the following command to start the server on your machine:

    mvn exec:java -Dexec.args="-host=localhost -port=7777 -tls=false -ack_interval=10000 -useragent_reaper_timeout=60000 -token_key=yourRandomToken" 

This starts an _unsecured_ instance of the AeroGear SimplePush Server on localhost using port 7777.

**_NOTE_:** The server uses an in-memory database for this demo. None of the SimplePush channels are persisted by the server. A restart of the server means that the previous registered channels are gone.

### Building the AeroGear UnifiedPush Server

Download the [AeroGear UnifiedPush Server](http://aerogear.org/push/) and deploy according to the instructions shown 
in [this guide](http://aerogear.org/docs/unifiedpush/ups_userguide/server-installation/).

### Registration of the SimplePush Variant

Once the UnifiedPush server is running, access the administration console via ```http://SERVER:PORT/ag-push``` to register your SimplePush variant.
Temporarily there is an "admin:123" user created by default, so you can use those credentials to login. On _first_ login,  you will be requested to change the password. More details can be found in the [Admin UI Guide](http://aerogear.org/docs/unifiedpush/ups_userguide/admin-ui/).


### JavaScript client

Prior to run the application we need to configure the variantId and variantSecret as well as the URL's of the running servers. Navigate to _js/_ folder and open in your favorite text editor, the _unifiedpush.js_ file. The file contains the main logic of the application and is responsible to register the channels with the SimplePush server, retrieve the endpoints for the update, and then register those endpoints with the UnifiedPush server so that notifications can be received.

On top of the file you will notice the configuration params that you need to change according to your specific configuration:
    
    // config params for UnifiedPush server
    var variantId = "<Your-Variant-ID";
    var variantSecret = "<Your-Variant-Secret>";
    var simplePushUrl = "<URL of the running SimplePush server>"
    var unifiedPushUrl = "<URL of the running UnifiedPush server>";

Once that is done, open the ```index.html``` file in your favourite browser. You should see the following:

![SimplePush/UnifiedPush main screen](https://raw.github.com/cvasilak/aerogear.org/6be25e8f32a15d34e9ba8f33077394bc3e9e70c2/docs/guides/aerogear-push-js/img/unifiedpush_main_screen.png "SimplePush/UnifiedPush main screen")

Now, issue the following CURL command to send a push notification against the UnifiedPush server. Don't forget to replace the ```PushApplicationID``` and ```MasterSecret``` you received when you registered you Application in the administration console:

    curl -3 -u "{PushApplicationID}:{MasterSecret}"
         -v -H "Accept: application/json" -H "Content-type: application/json" 
         -X POST
       -d '{
           "simple-push": "version=123"
        }' http://localhost:8080/ag-push/rest/sender

Notice the message being received by the web application!

### Have fun!
