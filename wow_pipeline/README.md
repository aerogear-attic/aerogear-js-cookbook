World of Warcraft Realm Checker
===============================

##NOTICE - THE PIPELINE API HAS BEEN DEPRECATED AND REMOVED IN 2.0

**Problem**

You want to connect to a REST service that is being provided on a different domain.

**Solution**

Connecting to a REST service on a different domain can be solved a couple ways.  This recipe will show how to use "jsonp" to solve this.

World of Warcraft has a community REST Web API, [here](http://blizzard.github.io/api-wow-docs/), that lets users access selected information from the game.

This recipe will look at how to access the "Realms" and display there status using AeroGear.js Pipeline

Here we are creating our Pipeline and pipe.

For this pipe, we are overriding the baseURL and endpoint

    var pipeline = AeroGear.Pipeline({
            name: "realmPipe",
            settings: {
                baseURL: "http://us.battle.net/api/wow/",
                endpoint: "realm/status"
            }
        }),
        realmPipe = pipeline.pipes.realmPipe;

Now when we call the `read` method, we need to specify that we want to use "jsonp" and that we also want to override the default "callback" parameter

    realmPipe.read({
        jsonp: {
            callback: "jsonp"
        }
    });

This is an asynchronous operation, so be sure to handle that with either success/error callbacks or promises

**Working Code Example**

To run the example code, first run:

    $ bower install

This will pull down the dependent javascript/css files, such as jquery, into the project.

_Note:  Notice that we are not using the whole AeroGear.js library, but just the Pipeline part.  Certain "Components" of AeroGear are also available on bower_

Since we are making cross domain requests,  this example can't run from a file, but instead needs to run on a server.

One option is to run a python 'SimpleHTTPServer'

    $ python -m SimpleHTTPServer

Now the page can be accessed at [localhost:8000](http://localhost:8000/)

_disclaimer: I'm not being paid by Blizzard_
