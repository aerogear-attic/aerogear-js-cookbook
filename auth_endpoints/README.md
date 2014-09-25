Secure Endpoints
===============================

##NOTICE - THE AUTHENTICATION API HAS BEEN DEPRECATED AND REMOVED IN 2.0

**Problem**

We want to interact with REST endpoints on our server that are secured behind a Login Form

**Solution**

The AeroGear.Auth namespace provides an authentication and enrollment API. This library provides common methods like enroll, login and logout that will just work.

Let's say we have a "login" endpoint that is located at "http://server/auth/login".

Using AeroGear.Auth, it is really easy to access that "login" endpoint

First we need to create the Auth Object:

    var auth = AeroGear.Auth();

Then, we can add an authenticator module to it:

    auth.add( "myAuthenticator" );

Now, when we need to "login", we call the login method with our username and password:

    var data = {
        username: "admin",
        password: "secret"
    };

    auth.modules.myAuthenticator.login( data, {
        success: function() { /*  Successful Login */ },
        error: function() { /*  Failed Login */ }
    })

By Default the REST endpoints for our Auth Object will be

        Login - "/auth/login"

        Logout - "/auth/logout"

        Enroll - "/auth/enroll"

If your server has different endpoints, you can customize them.

For example, lets say our "login" endpoint should be at "/rest/auth/endpoints/login" and our "logout" endpoint is at "/auth/endpoints/byebye"

All we need to do is override those settings during our module creation

    auth.add({
        name: "customAuthenticator",
        settings: {
            endpoints: {
                login: "/rest/auth/endpoints/login",
                logout: "/auth/endpoints/byebye"
            }
        }
    });

**Working Code Example**

To run the example code, first run:

    $ npm install && bower install

This will pull down the dependent javascript/css files, such as jquery, into the project.

This will also install the server component.

To run the demo:

    $ npm start

This will start a small express.js server that hosts the app and it's REST endpoints.

Point your browser to [localhost:3000](http://localhost:3000) to test it out

To login, the username and password are both "admin"
