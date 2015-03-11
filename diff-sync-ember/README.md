Differential Synchronization - Ember Example
============================================

## Problem

Usage of the AeroGear Sync Server

## Solution

The AeroGear Sync Server an implementation of [Google's Differential Synchonrization](http://research.google.com/pubs/pub35605.html) by Neil Fraser.

AeroGear.js provides a client library to interact with the server, using both the JSON Patch and Diff-Merge-Patch protocols.

This demo will utilize the JSON Patch part of the library.



## Working Code Example

This demo is an Ember.js Application that utilizes the ember-cli tool.  Follow the directions below to get the example working

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* [AeroGear Sync Server - JSON Patch Version](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)

### Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

### Running / Development

Once the Sync Server is running, do:

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Further Reading / Useful Links

* [AeroGear Sync Server](https://github.com/aerogear/aerogear-sync-server)
* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

