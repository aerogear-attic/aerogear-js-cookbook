Google Drive
===============================

**Problem**

We want to interact with a secured service, like Google Drive, that uses OAuth2 Authorization

**Solution**

The AeroGear.js library provides an Authorization module, AeroGear.Authz, with an OAuth2 Adapter.

This Authorizer can integrate into an AeroGear.Pipeline to seamlessly make calls to the secured service.

Let's take a look at how to setup the "authorizer"

    // First we create an Authz Object
    var authz = AeroGear.Authz();

    // Then add a "service" to it
    authz.add{
        name: "drive",
        settings: {
            clientId: "CLIENT_ID",
            redirectURL: "http://localhost:8000/redirector.html",
            authEndpoint: "https://accounts.google.com/o/oauth2/auth",
            validationEndpoint: "https://www.googleapis.com/oauth2/v1/tokeninfo",
            scopes: "https://www.googleapis.com/auth/drive"
        }
    };

    // And set our new "service" to a variable for easier access
    var gDrive = authz.services.drive;

In this case, we are adding the settings for accessing Google Drive

Now we will need to create an AeroGear.Pipeline with this "Authorizer" added to it

    var pipeline = AeroGear.Pipeline({ authorizer: gDrive });

    // Now create a pipe that access the google drive endpoint

    pipeline.add([
        {
            name: "files",
            settings: {
                baseURL: "https://www.googleapis.com/drive/v2/"
            }
        }
    ]);

_note: All pipes withing this pipeline will use the gDrive authorizer_


Now assuming this is the first time we are calling the pipe's `read` method, the error callback should be called with a 401 status.

This is because we have yet to allow this application the permission to access this service.

The response object from the error callback will have a parameter called "authURL"

This is the URL you will need to access to give permission to your app.

This also needs to be user initiated to avoid pop-up blockers.

Once this URL is access and permission is given, performing a `read` from your pipe, will now return a list of files from your Google Drive.

Have Fun!!

**Working Code Example**
To run the example code, first run:

    $ bower install

This will pull down the dependent javascript/css files, such as jquery, into the project.

You need to have Client ID and credentials with permissions to access Google Drive. You can get one by following these steps:

1. Be sure to also have a Google Account since we are going to access Google Drive
2. Open Google Console at https://cloud.google.com/console#/project
3. Create new project
4. In APIs & auth / APIs enable Drive API
5. In APIs & auth / Credentials create New Client ID
6. Make sure you white list http://localhost:8000 in JavaScript origins and you put http://localhost:8000/redirector.html into Redirects URIs

Then modify app/scripts/main.js authz object to contain client ID generated for you.

You will need to run this on a server, one option is to run a python 'SimpleHTTPServer'

    $ python -m SimpleHTTPServer

Now the page can be accessed at [localhost:8000](http://localhost:8000/)
