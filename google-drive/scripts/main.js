// Just for the Demo,  clear out the access token and stuff
window.localStorage.removeItem('ag-oauth2-1038594593085.apps.googleusercontent.com');

$(function() {

    var pipeline, filesPipe, authWindow, timer, authURL, callback,
    // Create a new AeroGear.Authorizer
    authz = AeroGear.Authorization();

    // Adding an authorizer service named "drive"
    // You will need to substitute the "clientId" with the values you receive in the google cloud console
    authz.add({
        name: "drive",
        settings: {
            clientId: "1038594593085.apps.googleusercontent.com",
            redirectURL: "http://localhost:8000/redirector.html",
            authEndpoint: "https://accounts.google.com/o/oauth2/auth",
            validationEndpoint: "https://www.googleapis.com/oauth2/v1/tokeninfo",
            scopes: "https://www.googleapis.com/auth/drive"
        }
    });

    // Creating a new Pipeline with the "drive" authorizer
    pipeline = AeroGear.Pipeline( { authorizer: authz.services.drive } );
    pipeline.add([
        {
            name: "files",
            settings: {
                baseURL: "https://www.googleapis.com/drive/v2/"
            }
        }
    ]);

    filesPipe = pipeline.pipes.files;

    // Setup event Handlers

    $( "#list_files" ).on( "click", function() {
        readFilesPipe();
    });

    $( "#dance" ).on( "click", function( events ) {
        var targetValue = events.target.checked;
        if( targetValue ) {
            dance( authURL, callback );
        }
    });

    // Once we finish the "dance" we need to parse the query String that is returned to make sure it's ok
    // Google recommends that we also send another request to a "validate" endpoint,  but that is not in the spec.
    function validateResponse( responseFromAuthEndpoint, callback ) {

        authz.services.drive.validate( responseFromAuthEndpoint,{
            success: function( response ) {
                $( ".topcoat-notification.errors" ).hide();
                console.log( response );
                $( "#dance" ).attr( "disabled", "disabled" );
                // here we are calling the read from earlier
                callback();
            },
            error: function( error ) {
                console.log( error );
            }
        });
    }

    // This will do the OAuth2 Dance, which is to open a separate window that asks for you permission.
    // I've noticed that on Mobile Safari,  when you have to also sign into google that the child window is not closed by the parent
    function dance( authURL, callback ) {
        authWindow = window.open( authURL, "Auth Dance" );
        //Watch the window for the location to change
        timer = setInterval( function() {
            if( authWindow.closed ) {
                clearInterval( timer );
                return;
            }

            if( authWindow.location.href || authWindow.location.origin ) {
                clearInterval( timer );
                validateResponse( authWindow.location.href, callback );
                authWindow.close();
            }

            //If the window is closed,  clear the interval
            if( authWindow.closed ) {
                clearInterval( timer );
            }
        }, 1000 );

        authWindow.focus();
    }

    function readFilesPipe() {
        $("ul.topcoat-list__container").empty();
        $( ".topcoat-notification.loading" ).show();
        // Just a normal pipe.read,  using promises
        filesPipe
            .read()
            .then( function( response ){
                var putItHere = $("ul.topcoat-list__container"),
                    items = response.items,
                    itemLength = items.length,
                    item,
                    i;

                for( i = 0; i < itemLength; i++ ) {
                    item = items[ i ];
                    putItHere.append( "<li class='topcoat-list__item' id='" + item.id + "'><img src='" + item.iconLink + "'> " + item.title + ( item.labels.trashed ? " - In Trash" : "" ) );
                }
            })
            .then( null, function( error ) {
                $( "#dance" ).removeAttr( "disabled" );

                // If the Authz fails, then we will get a url constructed for us, that we need to do something with to Authenticate
                // It also needs to be user initiated since most browsers will block the window that needs to be opened
                authURL = error.authURL;
                callback = readFilesPipe;
                $( ".topcoat-notification.errors" ).show();
            })
            .always( function() {
                $( ".topcoat-notification.loading" ).hide();
            });
    }
});
