(function() {
    var mailEndpoint, mailRequest, SPClient, UPClient;

    // config params for UnifiedPush server
    var variantId = "<Your-Variant-ID">;
    var variantSecret = "<Your-Variant-Secret>";
    var simplePushUrl = "<URL of the running SimplePush server>";
    var unifiedPushUrl = "<URL of the running UnifiedPush server>";

     // create the 'UnifiedPush' client object:
    UPClient = AeroGear.UnifiedPushClient(variantId, variantSecret, unifiedPushUrl + "/rest/registry/device");

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
                    categories: ["mail"]
                };

                var settings = {
                    success: function() {
                        console.log("Registered 'Mail' endpoint with UnifiedPush server!");
                    },
                    error: function() {
                        console.log("Error when registering with UnifiedPush server!");
                    }
                };

                settings.metadata = metadata;

                // register with the server
                UPClient.registerWithPushServer(settings);
            } else {
                appendTextArea("'Mail' was already registered!");
            }
        };
        // set the notification handler:
        navigator.setMessageHandler( "push", function( message ) {
            if ( message.channelID === mailEndpoint.channelID ) {
                // let's react on the 'mail' endpoint
                appendTextArea("Mail Notification - " + message.version);
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

    SPClient = AeroGear.SimplePushClient({
        simplePushServerURL: simplePushUrl,
        onConnect: spConnect,
        onClose: spClose
   });
})();
