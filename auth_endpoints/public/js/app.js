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

$(function() {

    /*
    */
    var pipeline = AeroGear.Pipeline(),
        /*
            Here we will create our Authenticator object
        */
        auth = AeroGear.Auth(),
        loginModule = $( ".login_module" ),
        securedContent = $( ".secured_module" ),
        securedTemplate = $( "#securedItem" ).html();

    /*
        Add 1 "Auth" module with default settings to the Authenticator.
        The module will be named "authenticator"

        By Default the REST endpoints will be

        Login - "/auth/login"

        Logout - "/auth/logout"

        Enroll - "/auth/enroll"
    */
    auth.add( "authenticator" );

    /*
        Here we are just adding 1 default pipe, name "secured" to the Pipeline
    */
    pipeline.add( "secured" );

    /*
        Click handler for the "login" form
    */
    $( 'form.login' ).on( 'submit', function( event ) {
        event.preventDefault();

        /*
            Get the data from the "form" element and serialize it into a JSON object
        */
        var self = this,
            loginData =  $( this ).serializeObject();

        /*
            Using our authenticator that we created earlier, we call the "login" method.
            This will make a GET request to the "/auth/login" endpoint with the username/password
            that we supplied from the form
        */
        auth.modules.authenticator.login( loginData, {
            success: function() {
                /*
                    Login Success
                    We logged in successfully, so we hide the "login" screen
                    and we can now access the secured endpoint
                */
                hideLogin();
                self.reset();
                getSecretData();
            },
            error: function( err ) {
                /*
                    Login Failure
                    There was an error logging into the server.
                    So we just display that there was an error logging in.

                    Here we are assuming that a 401 unauthorized will be returned
                */
                $( ".errors" ).removeClass( "hidden" );
            }
        });
    });

    /*
        Click handler for the "logout" button
    */
    $( '.logout' ).on( 'click', function( event ) {
        auth.modules.authenticator.logout({
            success: function() {
                /*
                    Logout Success
                    Lets show the login button and hide the content
                */
                showLogin();
            },
            error: function( err ) {
                /*
                    Logout Failure
                    Most likely the user is trying to logout and they are not logged in
                    Lets show the login page
                */
                showLogin();
            }
        });
    });

    function getSecretData() {
        pipeline.pipes.secured.read({
            success: function( data ) {
                var ul = securedContent.find( "ul" );

                ul.empty();

                for( var i = 0; i < data.length; i++ ) {
                    ul.append( _.template( securedTemplate, data[ i ] ) );
                }
            },
            error: function( err ) {
                showLogin();
            }
        });
    }

    /*
        Show the login button and hide the secured content
    */
    function showLogin() {
        loginModule.removeClass( "hidden" );
        securedContent.addClass( "hidden" );
    }

    /*
        Show the secured content and hide the login button
    */
    function hideLogin() {
        $( ".errors" ).addClass( "hidden" );
        loginModule.addClass( "hidden" );
        securedContent.removeClass( "hidden" );
    }

    getSecretData();
});

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
