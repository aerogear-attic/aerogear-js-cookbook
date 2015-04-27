Differential Synchronization - Html Canvas Example
==================================================

## Problem

Collaborative drawing on Html canvas

## Solution

The AeroGear Sync Server an implementation of [Google's Differential Synchonrization](http://research.google.com/pubs/pub35605.html) by Neil Fraser.

AeroGear.js provides a client library to interact with the server, using both the JSON Patch and Diff-Merge-Patch protocols.

This demo will utilize the JSON Patch part of the library.


## Demo

<!--- See http://stackoverflow.com/questions/4279611/how-to-embed-a-video-into-github-readme-md --->
[![demo](http://img.youtube.com/vi/u69Z1NmTgnQ/0.jpg)](https://youtu.be/u69Z1NmTgnQ)

See the demo video on [Youtube](https://youtu.be/u69Z1NmTgnQ).

## Working Code Example

This demo is using [Fabric.js](http://fabricjs.com/) to do high level Html canvas operations. Follow the directions below to get the example working.

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [AeroGear Sync Server - JSON Patch Version](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)

### Installation

* Install Bower : `npm install -g bower`
* Install Gulp : `npm install -g gulp`
* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

### Running

Start up the Sync Server (see [here](https://github.com/aerogear/aerogear-sync-server#starting-the-json-patch-server)).

Once the Sync Server is running, do:

* Issue `gulp`
* Visit your app at [http://localhost:3000](http://localhost:3000). Better multiple windows so that you can see the point of the demo.


### Further Reading / Useful Links

* [AeroGear Sync Server](https://github.com/aerogear/aerogear-sync-server)
* [Fabric.js](http://fabricjs.com/)


### Notes

Although in the example we serialize the entire canvas every time, only the diffs are sent and received over the wire thanks to AeroGear sync.
A much better implementation would not serialize the canvas every time. This demo is a showcase focused on AeroGear, not `Fabric.js`.