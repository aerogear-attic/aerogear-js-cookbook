Differential Synchronization - Ionic/Angular Example
============================================

## Problem

Usage of the AeroGear Sync Server with an Ionic/Angular client

## Solution

The AeroGear Sync Server an implementation of [Google's Differential Synchonrization](http://research.google.com/pubs/pub35605.html) by Neil Fraser.

AeroGear.js provides a client library to interact with the server, using both the JSON Patch and Diff-Merge-Patch protocols.

This demo will utilize the JSON Patch part of the library.


## Demo

<!--- See http://stackoverflow.com/questions/4279611/how-to-embed-a-video-into-github-readme-md --->
[![demo](http://img.youtube.com/vi/MmSd_5pFP3E/0.jpg)](https://youtu.be/MmSd_5pFP3E)

See the demo video on [Youtube](https://youtu.be/MmSd_5pFP3E).

## Working Code Example

This demo is an [Ionic Framework]<http://ionicframework.com/> application.  Follow the directions below to get the example working.

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [AeroGear Sync Server - JSON Patch Version](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)

### Installation

* Install Bower : `npm install -g bower`
* Install Gulp : `npm install -g gulp`
* Install Cordova and Ionic: `npm install -g cordova ionic`
* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

### Running / Development

Start up the Sync Server (see [here](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)).

Once the Sync Server is running, do:

* `ionic serve`
* Visit your app at [http://localhost:8100](http://localhost:8100).

### Running on devices or emulators

By default sync server is assumed to run on `ws://localhost:7777/sync`. This is good for `ionic serve`.
However, you cannot run the application on emulators or real devices using `localhost`. it is because `localhost` means the device itself in that case.
So, if you're running the sync server locally, you have to update following constant with your IP for `ionic run` or `ionic emulate` in **`www/js/environment.js`**:

    SYNC_SERVER_URL: 'ws://xx.xx.xx.xx:7777/sync'

#### Running on iOS

Start up the Sync Server (see [here](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)).

Once the Sync Server is running, do:

* `ionic platform add ios` (once)
* Run on connected device or emulator : `ionic run ios`
* Run on emulator : `ionic emulate ios` 

For more information, see [Ionic's CLI documentation](http://ionicframework.com/docs/cli/run.html).

#### Running on Android

Start up the Sync Server (see [here](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)).

Once the Sync Server is running, do:

* `ionic platform add android` (once)
* Run on connected device or emulator : `ionic run android`
* Run on emulator : `ionic emulate android`

For more information, see [Ionic's CLI documentation](http://ionicframework.com/docs/cli/run.html).

### Building

* `ionic build ios` OR `ionic build android`
 
For more information, see [Ionic's CLI documentation](http://ionicframework.com/docs/cli/run.html).

### Further Reading / Useful Links

* [AeroGear Sync Server](https://github.com/aerogear/aerogear-sync-server)
* [Ionic framework](http://ionicframework.com/)
* [Ionic CLI](http://ionicframework.com/docs/cli/)


### Notes

For the Ember based example, see <https://github.com/aerogear/aerogear-js-cookbook/tree/master/diff-sync-ember>.

Code here is only demonstration purposes for AeroGear Sync. In a real world Angular project, you would have things separated.
Also, you'd employ [promises](https://docs.angularjs.org/api/ng/service/$q) and prefer [*'controller-as syntax'*](https://github.com/johnpapa/angular-styleguide#style-y032).

Those are not done to keep things simple and only focus on Aerogear sync. 
