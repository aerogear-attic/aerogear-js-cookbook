Intro To Pipeline
===============================

**Problem**

We want to interact with REST endpoints on our server

**Solution**

AeroGear.js provides a simple API, called "Pipeline", to quickly do CRUD methods on REST endpoints running on your server

A simple REST Pipeline can be created like so:

    var pipeline = AeroGear.Pipeline();

Pipeline is really just a container for "pipes". Any number of "pipes" can be added to a pipeline:

    pipeline.add( "items" );

This creates a very simple pipe that can connect to a REST endpoint defined at "http://HOST:PORT/items"

Then if you want to call the read method:

    // access the pipe read method
    pipeline.pipes.items.read();

This will make a GET request to the endpoint.  If you are running on localhost port 3000, then your endpoint might look something like this:

    http://localhost:3000/items

Since pipeline is backed by jQuery.Ajax,  you can specify success and error callbacks for each method:

    pipeline.pipes.items.read({
        success: function( response ) {
            // Do something with the success response
        },
        error: function( error ) {
            // Do something with the error response
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


