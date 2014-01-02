/* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var app = {
    agPipes: {},
    _addToUI: function( dataz ) {
            var i = 0,
                putItHere = $( "ul.topcoat-list__container" );

            putItHere.empty();

            // The dataz object is an array that contains all the items
            for( i; i < dataz.length; i++ ) {
                // Just adding the object's id, name and type to the list
                putItHere.append( "<li class='topcoat-list__item' id='" + dataz[ i ].id + "'><span class='icomatic icon'>delete</span>&nbsp;&nbsp;<span class='icomatic icon'>pencil</span>&nbsp;&nbsp;" + dataz[ i ].name + " : " + dataz[ i ].type );
            }
    },
    _refreshForm: function() {
        $( "form" )[0].reset();
        $( "form input[name='id']" ).removeAttr( "value" );
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
            // First read the data from the server and then edit
            app.read( id, true );

        }
    },
    _formSubmit: function( event ) {
        event.preventDefault();

        var data = $( this ).serializeObject();

        //Save the Data
        app.save( data );
    },
    _cancel: function() {
        app._refreshForm();
        app._togglePage();
    },
    read: function( id, isEdit ) {
        // Call the pipe "read" method.
        // This will make a GET request to http://HOST:PORT/items
        // If an ID is specified the GET request will look like this http://HOST:PORT/items/SOME_ID
        // So for example where id is not defined,  http://localhost:3000/items
        // We are using callbacks here to handle the success and error responses,  but promises could also be used
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
    // Call the pipe "save" method.
    // This will make a POST request to http://HOST:PORT/items
    // If an "id" is defined in the object, then a PUT request will be made to the endpoint
    // We are using callbacks here to handle the success and error responses,  but promises could also be used
    save: function( data ) {
        app.agPipes.items.save( data,
            {
                success: function( response ) {
                    // clean the form
                    app._refreshForm();

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
    // Call the pipe "remove" method.
    // This will make a DELETE request to http://HOST:PORT/items/ID
    // We are using callbacks here to handle the success and error responses,  but promises could also be used
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
        $( "input[name='cancel']" ).on( "click", app._cancel );
        $( "ul" ).on( "click", app._listClick );

        //Setup our Pipeline.
        var pipeline = AeroGear.Pipeline(),
            items;

        //Create a new "pipe" called "items".  It's endpoint will be http://HOST:PORT/items
        pipeline.add( "items" );

        app.agPipes.items = pipeline.pipes.items;

        // Load all data on init
        app.read();
    }
};

//Initialize our Application
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
