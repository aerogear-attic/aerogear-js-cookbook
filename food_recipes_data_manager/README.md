Cooking Recipes
===============================

**Problem**

We want to use client side storage

**Solution**

While there are many options for client side storage, not all browsers support the same thing.

By using AeroGear.DataManager, we can utilize client side storage across multiple browsers without worrying if a certain type is supported or not.

A simple DataManager can be created like so:

    var datamanager = AeroGear.DataManager();

DataManager is really just a container for "stores". Any number of "stores" can be added to a datamanager:

    datamanager.add( "items" );

_the above example would create a default "memory" store names "items"_

Stores have 4 methods: `read`, `save`, `remove` and `filter`

To read all data from a store:

    var itemsStore = datamanager.stores.items;
    itemsStore.read()
        .then( function( data ) {
            console.log( data );
        });

_Note: these methods are asynchronous, so a callback is needed. The above example is using promises_

**Working Code Example**

To run the example code, first run:

    $ bower install

This will pull down the dependent javascript/css files, such as jquery, into the project.

Some browsers will complain about accessing IndexedDB/WebSQL from a file system, so running a Server might be required.

One option is to run a python 'SimpleHTTPServer'

    $ python -m SimpleHTTPServer

Now the page can be accessed at [localhost:8000](http://localhost:8000/)
