(function() {
    var mailEndpoint, mailRequest, SPClient, UPClient;

    // config params for UnifiedPush server
    var variantId = "<Your-Variant-ID";
    var variantSecret = "<Your-Variant-Secret>";
    var simplePushUrl = "<URL of the running SimplePush server>"
    var unifiedPushUrl = "<URL of the running UnifiedPush server>";

     // create the 'UnifiedPush' client object:
    var UPClient = AeroGear.UnifiedPushClient(variantId, variantSecret, unifiedPushUrl + "/rest/registry/device");

    // onConnect callback function called when SimplePush 
    // successfully establishes connection to the server
    function spConnect() {
        appendTextArea("Connection established with SimplePush server!");

        // use 'PushManager' to request a new PushServer URL endpoint for 'Mail' notifications:
        mailRequest = navigator.push.register();
         // the DOMRequest returns 'successfully':
        mailRequest.onsuccess = function( event ) {
            // extract the endpoint object from the event: 
            mailEndpoint = event.target.result;
            
            appendTextArea("Subscribed to 'Mail' messages on channel " + mailEndpoint.channelID);

            // if it is the first registration, need to register 
            // the 'pushEndpoint' with the UnifiedPush server.
            if ( mailEndpoint.pushEndpoint ) {
                // assemble the metadata for registration with the UnifiedPush server
                var metadata = {
                    deviceToken: mailEndpoint.channelID,
                    simplePushEndpoint: mailEndpoint.pushEndpoint,
                    alias: "john",
                    category: "mail"
                };

                // register with the server
                UPClient.registerWithPushServer(metadata);

                appendTextArea("Registered 'Mail' endpoint with UnifiedPush server!")

            } else {
                appendTextArea("'Mail' was already registered!");
            }
        };

        // let's request another endpoint for 'broadcast' notifications

        // use 'PushManager' to request a new PushServer URL endpoint for 'broadcast' notifications:
        broadcastRequest = navigator.push.register();
         // the DOMRequest returns 'successfully':
        broadcastRequest.onsuccess = function( event ) {
            // extract the endpoint object from the event: 
            broadcastEndpoint = event.target.result;
            
            appendTextArea("Subscribed to 'broadcast' messages on channel " + broadcastEndpoint.channelID);

            // if it is the first registration, need to register 
            // the 'pushEndpoint' with the UnifiedPush server.
            if ( broadcastEndpoint.pushEndpoint ) {
                // assemble the metadata for registration with the UnifiedPush server
                var metadata = {
                    deviceToken: broadcastEndpoint.channelID,
                    simplePushEndpoint: broadcastEndpoint.pushEndpoint,
                    alias: "john",
                    category: "broadcast"
                };

                // register with the server
                UPClient.registerWithPushServer(metadata);

                appendTextArea("Registered 'broadcast' endpoint with UnifiedPush server!")

            } else {
                appendTextArea("'broadcast' was already registered!");
            }
        };        

        // set the notification handler:
        navigator.setMessageHandler( "push", function( message ) {
            if ( message.channelID === mailEndpoint.channelID ) {
                // let's react on the 'mail' endpoint
                appendTextArea("Mail Notification - " + message.version);
            } else if ( message.channelID === broadcastEndpoint.channelID ) { 
                // let's react on the 'broadcast' endpoint
                appendTextArea("Broadcast Notification - " + message.version);            
            }
        });
    }

    function appendTextArea(newData) {
        var el = getTextAreaElement();
        el.value = el.value + '\n' + newData;
    }

    function getTextAreaElement() {
        return document.getElementById('responseText');
    }

    // custom.....
    $("#reconnect").on("click", function(event) {
        // AeroGear add-on to allow a reconnect, if the WebSocket/SockJS connection is lost
            navigator.push.reconnect();
        });
        
    // onClose callback function:
    function spClose() {
        $("#reconnect").show();
        appendTextArea("\nConnection Lost!\n");
    }

    var SPClient = AeroGear.SimplePushClient({
        simplePushServerURL: simplePushUrl,
        onConnect: spConnect,
        onClose: spClose
   });
})();
