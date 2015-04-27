/*
 *    JBoss, Home of Professional Open Source
 *    Copyright 2015, Red Hat, Inc., and individual contributors
 *    by the @authors tag. See the copyright.txt in the distribution for a
 *    full listing of individual contributors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

(function ($, fabric) {
    const HEIGHT = 600;
    const WIDTH = 800;
    const SYNC_SERVER_URL = 'ws://localhost:7777/sync';

    var self = this;
    var canvas = new fabric.Canvas('theCanvas');

    var syncClientNeedsInit = true;

    var model = null;

    var seedData = {
        id: 'drawing12345',
        clientId: guid(),
        content: {
            "objects": [{
                "type": "rect",
                "left": 215,
                "top": 204,
                "width": 60,
                "height": 70,
                "fill": "green"
            }]
        }
    };

    var syncClient = AeroGear.DiffSyncClient({
        serverUrl: SYNC_SERVER_URL,
        onopen: function () {
            if (syncClientNeedsInit) {
                syncClient.addDocument(seedData);
                syncClientNeedsInit = false;
            }
            else {
                syncClient.fetch('drawing12345');
            }
        },
        onsync: function (doc) {
            model = doc;
            canvas.loadFromJSON(doc.content);
            canvas.setHeight(HEIGHT);
            canvas.setWidth(WIDTH);
        }
    });

    $('#addRectButton').click(function () {
        self.addNewRect();
    });

    canvas.on("object:modified", function (options) {
        model.content = canvas.toObject();
        syncClient.sync(cp(model));
    });

    self.addNewRect = function () {
        var rectSpec = {
            id: guid(),
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            angle: 0,
            fill: randomColor()
        };

        var rect = new fabric.Rect(rectSpec);

        canvas.add(rect);
    };

    /////////////////////////////////////////////////////////////////////////////////////////

    function randomColor() {
        var colors = ['red', 'green', 'blue', 'orange', 'pink', 'magenta', 'cyan', 'yellow'];
        var randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    function guid() {
        // taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return (function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }());
    }

    // poor man's copy
    function cp(obj) {
        return JSON.parse(JSON.stringify(obj || {}));
    }

})(jQuery, fabric);