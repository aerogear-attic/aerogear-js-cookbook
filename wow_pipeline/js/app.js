var app = {
    realmData: [],
    keysPressed: "",
    search: function( event ) {
        var pressed = String.fromCharCode( event.keyCode ),
            filteredRealms;

        if( event.keyCode === 8 ) {
            // Delete pressed
            app.keysPressed = app.keysPressed.slice( 0, -1 );
        } else {
            app.keysPressed += pressed;
        }

        filteredRealms = app.realmData.filter( function( value, index, list ){
            return value.name.toLowerCase().indexOf( app.keysPressed.toLowerCase() ) > -1 ? true : false;
        });

        app._addToUI( filteredRealms );
    },
    _addToUI: function( realms ) {
            var i = 0,
                putItHere = $("ul.topcoat-list__container");

            putItHere.empty();

            // The realms object is an array that contains all the realms
            for( i; i < realms.length; i++ ) {
                var status = realms[ i ].status ? "checkmark" : "error";
                // Just adding a Realm's name to the list
                putItHere.append( "<li class='topcoat-list__item'>" + realms[ i ].name + "  <span class='icomatic icon " + status + "'>" + status + "</span>"  );
            }
    },
    refresh: function() {
        $("ul.topcoat-list__container").empty();

        app.loadRealms();
    },
    loadRealms: function() {

        // Create our Pipeline with 1 pipe named 'realmPipe'
        // We are overriding the baseURL to point to our external REST service
        // as well as overriding our endpoint to be 'realm/status'
        var pipeline = AeroGear.Pipeline({
            name: "realmPipe",
            settings: {
                baseURL: "http://us.battle.net/api/wow/",
                endpoint: "realm/status"
            }
        }),
        // Just storing our realmPipe in a variable
        realmPipe = pipeline.pipes.realmPipe;

        // Now we 'read', which is really just a GET request to our server
        // The url should look something like this  'http://us.battle.net/api/wow/realm/status'
        // We have one setting, 'jsonp', this tells aerogear.js to use jsonp to do cross domain communication
        // the callback property is set since the server is expecting this parameter
        realmPipe.read({
            jsonp: {
                callback: "jsonp"
            }
        })
        // Here we are using promises.  a success/error callback could also be used
        .then( function( response ) {
            // The response has a 'realms' object, so we set that to a variable
            var realms = response.realms;

            app._addToUI( realms );
            app.realmData = realms;
            $( ".topcoat-search-input" ).removeAttr( "disabled" );
        })
        // This will only be accessed if there is an error during the 'read'
        .then( null, function( error ) {
            console.log( error );
        });
    },
    init: function(){
        $( ".topcoat-search-input" ).on( "keyup", app.search );
        $(".topcoat-navigation-bar__item span.icon").on( "click", app.refresh );

        app.loadRealms();
    }
};

app.init();
