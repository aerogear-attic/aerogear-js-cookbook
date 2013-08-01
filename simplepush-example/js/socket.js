(function() {
    var mailEndpoint, mailRequest, fooEndpoint, fooRequest, broadcastRequest, broadcastEndpoint, testFrame, SPClient,
        // Obviously this isn't secure but what we have for now
        UPClient = AeroGear.UnifiedPushClient( "6c73c51c-f4d4-45da-800a-5743501bf4e0", "5cdc4870-42b7-44bd-854a-c80279a6e2dc", "http://localhost:8080/ag-push/rest/registry/device" );

    function spConnect() {
        getTextAreaElement().value = "Web Socket opened!";

        broadcastRequest = navigator.push.register();
        broadcastRequest.onsuccess = function( event ) {
            broadcastEndpoint = event.target.result;
            UPClient.registerWithPushServer({
                category: "broadcast",
                deviceToken: broadcastEndpoint.channelID
            });
            appendTextArea("Subscribed to Broadcast messages on " + broadcastEndpoint.channelID);
            $("#broadcastVersion").val( localStorage.getItem( broadcastEndpoint.channelID ) || 1 );
            $("#broadcast").prop("disabled", false);
        };

        mailRequest = navigator.push.register();
        console.log(mailRequest);
        mailRequest.onsuccess = function( event ) {
            mailEndpoint = event.target.result;
            console.log(mailEndpoint);
            UPClient.registerWithPushServer({
                category: "mail",
                deviceToken: mailEndpoint.channelID,
                alias: "test@test.com"
            });
            $("#mailVersion").attr("name", mailEndpoint.channelID);
            appendTextArea("Subscribed to Mail messages on " + mailEndpoint.channelID);
            $("#mailVersion").val( localStorage.getItem( mailEndpoint.channelID ) || 1 );
            $("#mail").prop("disabled", false);
        };

        fooRequest = navigator.push.register();
        fooRequest.onsuccess = function( event ) {
            fooEndpoint = event.target.result;
            UPClient.registerWithPushServer({
                category: "foo",
                deviceToken: fooEndpoint.channelID,
                alias: "test@test.com"
            });
            $("#fooVersion").attr("name", fooEndpoint.channelID);
            appendTextArea("Subscribed to Foo messages on " + fooEndpoint.channelID);
            $("#fooVersion").val( localStorage.getItem( fooEndpoint.channelID ) || 1 );
            $("#foo").prop("disabled", false);
        };

        navigator.setMessageHandler( "push", function( message ) {
            if ( message.channelID === mailEndpoint.channelID ) {
                appendTextArea("Mail Notification - " + message.version);
                $("#mailVersion").val( +message.version + 1 );
                localStorage.setItem( message.channelID, +message.version + 1 );
            } else if ( message.channelID === fooEndpoint.channelID ) {
                appendTextArea("Foo Notification - " + message.version);
                $("#fooVersion").val( +message.version  + 1);
                localStorage.setItem( message.channelID, +message.version + 1 );
            } else if ( message.channelID === broadcastEndpoint.channelID ) {
                // Broadcast messages are subscribed by default and can be acted on as well
                appendTextArea("Broadcast Notification - " + message.version);
                $("#broadcastVersion").val( +message.version + 1 );
                localStorage.setItem( message.channelID, +message.version + 1 );
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

    $("button").not("#reconnect").on("click", function( event ) {
        var urlSwitch, data,
            $this = $(this),
            type = this.id,
            input = $("#" + type + "Version"),
            idArray = [ input.attr("name") ],
            val = input.val();

        $this.prop("disabled", true);

        if ( type === "broadcast" ) {
            urlSwitch = "broadcast";
            data = {
                "simple-push": "version=" + val
            };
        } else {
            // UGLY HACK
            simplePushVal = {};
            simplePushVal[type] = "version=" + val;

            urlSwitch = "selected",
            data = {
                alias: ["test@test.com"],
                message: {},
                "simple-push": simplePushVal
            };
        }

        $.ajax({
            url: "http://" + window.location.hostname + ":8080/ag-push/rest/sender/" + urlSwitch,
            contentType: "application/json",
            dataType: "json",
            type: "POST",
            headers: {
                "Authorization": "Basic " + window.btoa("491a4e13-f698-4cff-af94-c07329d1671e:3357a4c5-89d9-4e06-965f-884f75a99fda")
            },
            data: JSON.stringify( data ),
            complete: function() {
                $this.prop("disabled", false);
            }
        });
    });

    $("#reconnect").on("click", function(event) {
        navigator.push.reconnect();
    });

    function spClose() {
        $("#reconnect").show();
        appendTextArea("\nConnection Lost!\n");
    }

    SPClient = AeroGear.SimplePushClient({
        simplePushServerURL: "http://localhost:7777/simplepush",
        onConnect: spConnect,
        onClose: spClose
    });
})();
