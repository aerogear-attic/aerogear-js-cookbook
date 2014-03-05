//Just for the Demo,  clear out the access token and stuff
window.localStorage.removeItem('ag-oauth2-1038594593085.apps.googleusercontent.com');


var pipeline, filesPipe, authWindow, timer, authURL, callback,
    authz = AeroGear.Authorization();

// Adding an Authorizer
authz.add({
    name: "drive",
    settings: {
        clientId: "1038594593085.apps.googleusercontent.com",
        redirectURL: "http://localhost:8000/app/redirector.html",
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

function validateResponse( responseFromAuthEndpoint, callback ) {
    // Once we finish the "dance" we need to parse the query String that is returned to make sure it's ok
    // Google recommends that we also send another request to a "validate" endpoint,  but that is not in the spec.
    // This good be part of the library, maybe

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

// This code i really DO NOT want to put into AeroGear.js
// I've noticed that on Mobile Safari,  when you have to also sign into google that the child window is not closed by the parent
function dance( authURL, callback ) {
    //console.log( authURL );
    //console.log( "Opening Auth URL" );
    authWindow = window.open( authURL );
    //Watch the window for the location to change
    timer = setInterval( function() {
        if( authWindow.closed ) {
            clearInterval( timer );
            //console.log( "Child Window has closed" );
            return;
        }

        if( authWindow.location.href || authWindow.location.origin ) {
            //console.log( "redirect URL is back in the child" );
            clearInterval( timer );
            //console.log( "About to validate response returned" );
            validateResponse( authWindow.location.href, callback );
            authWindow.close();
        }

        //If the window is closed,  clear the interval
        if( authWindow.closed ) {
            clearInterval( timer );
            //console.log( "Child Window has closed" );
        }
    }, 100 );

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
                console.log( item.title, item.labels.trashed ? "Trashed" : "" );
                putItHere.append( "<li class='topcoat-list__item' id='" + item.id + "'><span class='icomatic icon'>delete</span>&nbsp;&nbsp;<img src='" + item.iconLink + "'> " + item.title + ( item.labels.trashed ? " - In Trash" : "" ) );
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

// Careful,  this will delete the item from drive,  Duh
// Does not move to the trash
// Does not ask if you are certain either
function deleteItem( itemID ) {
    filesPipe.remove( itemID )
        .then( function() {
            $( "#"+itemID ).remove();
        })
        .then( null, function( error ) {
            console.log( "errors", error );
        });
}


$( "#list_files" ).on( "click", function() {
    readFilesPipe();
});

$( "#dance" ).on( "click", function( events ) {
    var targetValue = events.target.checked;
    if( targetValue ) {
        dance( authURL, callback );
    }
});

$( "ul.topcoat-list__container").on( "click", function( events ) {
    var target = $( events.target ),
        id;

    if( target.hasClass( "icon" ) ) {
        id = $(target).closest("li")[0].id;
        deleteItem( id );
    }
});
