var app = {
    agPipes: {},
    _addToUI: function( dataz ) {
            var i = 0,
                putItHere = $( "ul.topcoat-list__container" );

            putItHere.empty();

            // The realms object is an array that contains all the realms
            for( i; i < dataz.length; i++ ) {
                // Just adding a Realm's name to the list
                putItHere.append( "<li class='topcoat-list__item' id='" + dataz[ i ].id + "'><span class='icomatic icon'>delete</span>&nbsp;&nbsp;<span class='icomatic icon'>pencil</span>&nbsp;&nbsp;" + dataz[ i ].name + " : " + dataz[ i ].type );
            }
    },
    _header: function( event ) {

        if( $(event.target).hasClass( "refresh" ) ) {
            // call refresh
            app.refresh();
        } else {
            // Show create screen
            app._togglePage( "edit" );
        }
    },
    _listClick: function( event ) {
        var target = event.target,
            li = $( target ).closest( "li" ),
            id = li[ 0 ].id,
            targetText = $( target ).text();

        if( targetText === "delete" ) {
            // Get the ID and Call remove
            app.remove( id );
        } else if( targetText === "pencil" ) {
            // Edit?
            app.read( id, true );

        }
    },
    _formSubmit: function( event ) {
        event.preventDefault();

        var data = $( this ).serializeObject();

        app.save( data );
    },
    read: function( id, isEdit ) {

        app.agPipes.items.read({
            id: id,
            success: function( response ) {
                if( isEdit ) {
                    $( "input[name='id']" ).val( response[ 0 ].id );
                    $( "input[name='name']" ).val( response[ 0 ].name );
                    $( "input[name='type']" ).val( response[ 0 ].type );

                    app._togglePage( "edit" );
                    return;
                }

                app._addToUI( response );
            },
            error: function( error ) {
                console.log( error );
            }
        });
    },
    save: function( data ) {
        app.agPipes.items.save( data,
            {
                success: function( response ) {
                    // clean the form
                    $( "form" )[0].reset();
                    $( "form input[name='id']" ).removeAttr( "value" );

                    // Toggle
                    app._togglePage( "main" );
                    app.refresh();
                },
                error: function( error ) {
                    console.log( error );
                }
            }
        );
    },
    remove: function( id ) {
        app.agPipes.items.remove( id, {
            success: function( response ) {
                app.refresh();
            },
            error: function( error ) {
                console.log( error );
            }
        });
    },
    refresh: function() {
        $( "ul.topcoat-list__container" ).empty();

        app.read();
    },
    _togglePage: function( which ) {
        if( which === "edit" ) {
            $( "#items" ).addClass( "hidden" );
            $( "#edit" ).removeClass( "hidden" );
        } else {
            $( "#edit" ).addClass( "hidden" );
            $( "#items" ).removeClass( "hidden" );
        }
    },
    init: function() {
        //Add some event handlers
        $( ".topcoat-navigation-bar__item span.icon" ).on( "click", app._header );
        $( "form" ).on( "submit", app._formSubmit );
        $( "ul" ).on( "click", app._listClick );

        //Setup our Pipeline
        var pipeline = AeroGear.Pipeline(),
            items;

        pipeline.add( "items" );

        app.agPipes.items = pipeline.pipes.items;

        // Load all data on init
        app.read();
    }
};

app.init();

// Serializes a form to a JavaScript Object
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each( a, function() {
        if ( o[ this.name ] ) {
            if ( !o[ this.name ].push ) {
                o[ this.name ] = [ o[ this.name ] ];
            }
            o[ this.name ].push( this.value || '' );
        } else {
            o[ this.name ] = this.value || '';
        }
    });
    return o;
};
