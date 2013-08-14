/*! AeroGear JavaScript Library - v1.2.0-dev - 2013-08-13
* https://github.com/aerogear/aerogear-js
* JBoss, Home of Professional Open Source
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
(function( window, undefined ) {

/**
    The AeroGear namespace provides a way to encapsulate the library's properties and methods away from the global namespace
    @namespace
 */
this.AeroGear = {};

/**
    AeroGear.Core is a base for all of the library modules to extend. It is not to be instantiated and will throw an error when attempted
    @class
    @private
 */
AeroGear.Core = function() {
    // Prevent instantiation of this base class
    if ( this instanceof AeroGear.Core ) {
        throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
        This function is used by the different parts of AeroGear to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current );
                } else {
                    collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings || {} );
                }
            }
        } else {
            // config is an object so use that signature
            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings || {} );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by pipeline, datamanager, etc. to remove an Object (pipe, store, etc.) from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
        var i,
            current,
            collection = this[ this.collectionName ] || {};

        if ( typeof config === "string" ) {
            // config is a string so delete that item by name
            delete collection[ config ];
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    delete collection[ current ];
                } else {
                    delete collection[ current.name ];
                }
            }
        } else if ( config ) {
            // config is an object so use that signature
            delete collection[ config.name ];
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
};

/**
    Utility function to test if an object is an Array
    @private
    @method
    @param {Object} obj - This can be any object to test
*/
AeroGear.isArray = function( obj ) {
    return ({}).toString.call( obj ) === "[object Array]";
};

/**
    This callback is executed when an HTTP request completes whether it was successful or not.
    @callback AeroGear~completeCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
 */
/**
    This callback is executed when an HTTP error is encountered during a request.
    @callback AeroGear~errorCallbackREST
    @param {Object} jqXHR - The jQuery specific XHR object
    @param {String} textStatus - The text status message returned from the server
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
 */
/**
    This callback is executed when an HTTP success message is returned during a request.
    @callback AeroGear~successCallbackREST
    @param {Object} data - The data, if any, returned in the response
    @param {String} textStatus - The text status message returned from the server
    @param {Object} jqXHR - The jQuery specific XHR object
 */
/**
    This callback is executed when an error is encountered saving to local or session storage.
    @callback AeroGear~errorCallbackStorage
    @param {Object} errorThrown - The HTTP error thrown which caused the is callback to be called
    @param {Object|Array} data - An object or array of objects representing the data for the failed save attempt.
 */
/**
    This callback is executed when data is successfully saved to session or local storage.
    @callback AeroGear~successCallbackStorage
    @param {Object} data - The updated data object after the new saved data has been added
 */

//     node-uuid/uuid.js
//
//     Copyright (c) 2010 Robert Kieffer
//     Dual licensed under the MIT and GPL licenses.
//     Documentation and details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator, but
  // Math.random() does not guarantee "cryptographic quality".  So we feature
  // detect for more robust APIs, normalizing each method to return 128-bits
  // (16 bytes) of random data.
  var mathRNG, nodeRNG, whatwgRNG;

  // Math.random()-based RNG.  All platforms, very fast, unknown quality
  var _rndBytes = new Array(16);
  mathRNG = function() {
    var r, b = _rndBytes, i = 0;

    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      b[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return b;
  }

  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
  // WebKit only (currently), moderately fast, high quality
  if (_global.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function() {
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < 16; c++) {
        _rndBytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return _rndBytes;
    }
  }

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  // Node.js only, moderately fast, high quality
  try {
    var _rb = require('crypto').randomBytes;
    nodeRNG = _rb && function() {
      return _rb(16);
    };
  } catch (e) {}

  // Select RNG with best quality
  var _rng = nodeRNG || whatwgRNG || mathRNG;

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(byte) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[byte];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  // Export RNG options
  uuid.mathRNG = mathRNG;
  uuid.nodeRNG = nodeRNG;
  uuid.whatwgRNG = whatwgRNG;

  if (typeof(module) != 'undefined') {
    // Play nice with node.js
    module.exports = uuid;
  } else {
    // Play nice with browsers
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    }
    _global.uuid = uuid;
  }
}());

;(function () {

  var
    object = typeof window != 'undefined' ? window : exports,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

/**
    The AeroGear.Pipeline provides a persistence API that is protocol agnostic and does not depend on any certain data model. Through the use of adapters, this library provides common methods like read, save and delete that will just work.
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the pipe(s) being created along with the Pipeline. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the pipe will later be referenced by
    @param {String} [config.type="rest"] - the type of pipe as determined by the adapter used
    @param {String} [config.recordId="id"] - the identifier used to denote the unique id for each record in the data associated with this pipe
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {Object} pipeline - The created Pipeline containing any pipes that may have been created
    @example
// Create an empty Pipeline
var pl = AeroGear.Pipeline();

// Create a single pipe using the default adapter
var pl2 = AeroGear.Pipeline( "tasks" );

// Create multiple pipes using the default adapter
var pl3 = AeroGear.Pipeline( [ "tasks", "projects" ] );

//Create a new REST pipe with a custom ID using an object
var pl4 = AeroGear.Pipeline({
    name: "customPipe",
    type: "rest",
    recordId: "CustomID"
});

//Create multiple REST pipes using objects
var pl5 = AeroGear.Pipeline([
    {
        name: "customPipe",
        type: "rest",
        recordId: "CustomID"
    },
    {
        name: "customPipe2",
        type: "rest",
        recordId: "CustomID"
    }
]);
 */
AeroGear.Pipeline = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Pipeline ) ) {
        return new AeroGear.Pipeline( config );
    }

    // Super constructor
    AeroGear.Core.call( this );

    this.lib = "Pipeline";
    this.type = config ? config.type || "Rest" : "Rest";

    /**
        The name used to reference the collection of pipe instances created from the adapters
        @memberOf AeroGear.Pipeline
        @type Object
        @default pipes
     */
    this.collectionName = "pipes";

    this.add( config );
};

AeroGear.Pipeline.prototype = AeroGear.Core;
AeroGear.Pipeline.constructor = AeroGear.Pipeline;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Pipeline namespace dynamically and still be accessible to the add method
    @augments AeroGear.Pipeline
 */
AeroGear.Pipeline.adapters = {};

/**
    The REST adapter is the default type used when creating a new pipe. It uses jQuery.ajax to communicate with the server. By default, the RESTful endpoint used by this pipe is the app's current context, followed by the pipe name. For example, if the app is running on http://mysite.com/myApp, then a pipe named `tasks` would use http://mysite.com/myApp/tasks as its REST endpoint.
    This constructor is instantiated when the "PipeLine.add()" method is called
    @constructs AeroGear.Pipeline.adapters.Rest
    @param {String} pipeName - the name used to reference this particular pipe
    @param {String} [type="Rest"] - the name used to reference this particular pipe
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {Object} [settings.authenticator=null] - the AeroGear.auth object used to pass credentials to a secure endpoint
    @param {String} [settings.baseURL] - defines the base URL to use for an endpoint
    @param {String} [settings.contentType="application/json"] - the default type of content being sent to the server
    @param {String} [settings.dataType="json"] - the default type of data expected to be returned from the server
    @param {String} [settings.endpoint=pipename] - overrides the default naming of the endpoint which uses the pipeName
    @param {Object|Boolean} [settings.pageConfig] - an object containing the current paging configuration, true to use all defaults or false/undefined to not use paging
    @param {String} [settings.pageConfig.metadataLocation="webLinking"] - indicates whether paging information is received from the response "header", the response "body" or via RFC 5988 "webLinking", which is the default.
    @param {String} [settings.pageConfig.previousIdentifier="previous"] - the name of the prev link header, content var or web link rel
    @param {String} [settings.pageConfig.nextIdentifier="next"] - the name of the next link header, content var or web link rel
    @param {Function} [settings.pageConfig.parameterProvider] - a function for handling custom parameter placement within header and body based paging - for header paging, the function receives a jqXHR object and for body paging, the function receives the JSON formatted body as an object. the function should then return an object containing keys named for the previous/nextIdentifier options and whos values are either a map of parameters and values or a properly formatted query string
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {Number} [settings.timeout=60] - the amount of time, in seconds, to wait before timing out a connection and firing the complete callback for that request
    @returns {Object} The created pipe
    @example
    //Create an empty pipeline
    var pipeline = AeroGear.Pipeline();

    //Add a new Pipe with a custom baseURL, custom endpoint and default paging turned on
    pipeline.add( "customPipe", {
        baseURL: "http://customURL.com",
        endpoint: "customendpoint",
        pageConfig: true
    });

    //Add a new Pipe with a custom paging options
    pipeline.add( "customPipe", {
        pageConfig: {
            metadataLocation: "header",
            previousIdentifier: "back",
            nextIdentifier: "forward"
        }
    });

 */
AeroGear.Pipeline.adapters.Rest = function( pipeName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Pipeline.adapters.Rest ) ) {
        return new AeroGear.Pipeline.adapters.Rest( pipeName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var endpoint = settings.endpoint || pipeName,
        ajaxSettings = {
            // use the pipeName as the default rest endpoint
            url: settings.baseURL ? settings.baseURL + endpoint : endpoint,
            contentType: settings.contentType || "application/json",
            dataType: settings.dataType || "json"
        },
        recordId = settings.recordId || "id",
        authenticator = settings.authenticator || null,
        type = "Rest",
        pageConfig = settings.pageConfig,
        timeout = settings.timeout ? settings.timeout * 1000 : 60000;

    // Privileged Methods
    /**
        Returns the value of the private ajaxSettings var
        @private
        @augments Rest
        @returns {Object}
     */
    this.getAjaxSettings = function() {
        return ajaxSettings;
    };

    /**
        Returns the value of the private authenticator var
        @private
        @augments Rest
        @returns {AeroGear.Authenticator}
     */
    this.getAuthenticator = function() {
        return authenticator;
    };

    /**
        Returns the value of the private recordId var
        @private
        @augments Rest
        @returns {String}
     */
    this.getRecordId = function() {
        return recordId;
    };

    /**
        Returns the value of the private timeout var
        @private
        @augments Rest
        @returns {Number}
     */
    this.getTimeout = function() {
        return timeout;
    };

    /**
        Returns the value of the private pageConfig var
        @private
        @augments Rest
        @returns {Object}
     */
    this.getPageConfig = function() {
        return pageConfig;
    };

    /**
        Updates the value of the private pageConfig var with only the items specified in newConfig unless the reset option is specified
        @private
        @augments Rest
     */
    this.updatePageConfig = function( newConfig, reset ) {
        if ( reset ) {
            pageConfig = {};
            pageConfig.metadataLocation = newConfig.metadataLocation ? newConfig.metadataLocation : "webLinking";
            pageConfig.previousIdentifier = newConfig.previousIdentifier ? newConfig.previousIdentifier : "previous";
            pageConfig.nextIdentifier = newConfig.nextIdentifier ? newConfig.nextIdentifier : "next";
            pageConfig.parameterProvider = newConfig.parameterProvider ? newConfig.parameterProvider : null;
        } else {
            jQuery.extend( pageConfig, newConfig );
        }
    };

    // Set pageConfig defaults
    if ( pageConfig ) {
        this.updatePageConfig( pageConfig, true );
    }

    // Paging Helpers
    this.webLinkingPageParser = function( jqXHR ) {
        var linkAr, linksAr, currentLink, params, paramAr, identifier,
            query = {};

        linksAr = jqXHR.getResponseHeader( "Link" ).split( "," );
        for ( var link in linksAr ) {
            linkAr = linksAr[ link ].trim().split( ";" );
            for ( var item in linkAr ) {
                currentLink = linkAr[ item ].trim();
                if ( currentLink.indexOf( "<" ) === 0 && currentLink.lastIndexOf( ">" ) === linkAr[ item ].length - 1 ) {
                    params = currentLink.substr( 1, currentLink.length - 2 ).split( "?" )[ 1 ];
                } else if ( currentLink.indexOf( "rel=" ) === 0 ) {
                    if ( currentLink.indexOf( pageConfig.previousIdentifier ) >= 0 ) {
                        identifier = pageConfig.previousIdentifier;
                    } else if ( currentLink.indexOf( pageConfig.nextIdentifier ) >= 0 ) {
                        identifier = pageConfig.nextIdentifier;
                    }
                }
            }

            if( identifier ) {
                query[ identifier ] = params;
                identifier = undefined;
            }
        }

        return query;
    };

    this.headerPageParser = function( jqXHR ) {
        var previousQueryString = jqXHR.getResponseHeader( pageConfig.previousIdentifier ),
            nextQueryString = jqXHR.getResponseHeader( pageConfig.nextIdentifier ),
            pagingMetadata = {},
            query = {};

        if ( pageConfig.parameterProvider ) {
            pagingMetadata = pageConfig.parameterProvider( jqXHR );
            query[ pageConfig.previousIdentifier ] = pagingMetadata[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = pagingMetadata[ pageConfig.nextIdentifier ];
        } else {
            query[ pageConfig.previousIdentifier ] = previousQueryString ? previousQueryString.split( "?" )[ 1 ] : null;
            query[ pageConfig.nextIdentifier ] = nextQueryString ? nextQueryString.split( "?" )[ 1 ] : null;
        }

        return query;
    };

    this.bodyPageParser = function( body ) {
        var query = {},
            pagingMetadata = {};

        if ( pageConfig.parameterProvider ) {
            pagingMetadata = pageConfig.parameterProvider( body );

            query[ pageConfig.previousIdentifier ] = pagingMetadata[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = pagingMetadata[ pageConfig.nextIdentifier ];
        } else {
            query[ pageConfig.previousIdentifier ] = body[ pageConfig.previousIdentifier ];
            query[ pageConfig.nextIdentifier ] = body[ pageConfig.nextIdentifier ];
        }

        return query;
    };

    this.formatJSONError = function( xhr ) {
        if ( this.getAjaxSettings().dataType === "json" ) {
            try {
                xhr.responseJSON = JSON.parse( xhr.responseText );
            } catch( error ) {
                // Response was not JSON formatted
            }
        }
        return xhr;
    };
};

// Public Methods
/**
    Reads data from the specified endpoint
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.id] - the value to append to the endpoint URL,  should be the same as the pipelines recordId
    @param {Mixed} [options.jsonp] - Turns jsonp on/off for reads, Set to true, or an object with options
    @param {String} [options.jsonp.callback] - Override the callback function name in a jsonp request. This value will be used instead of 'callback' in the 'callback=?' part of the query string in the url
    @param {String} [options.jsonp.customCallback] - Specify the callback function name for a JSONP request. This value will be used instead of the random name automatically generated by jQuery
    @param {Number} [options.limitValue=10] - the maximum number of results the server should return when using a paged pipe
    @param {String} [options.offsetValue="0"] - the offset of the first element that should be included in the returned collection when using a paged pipe
    @param {Object|Boolean} [options.paging] - this object can be used to overwrite the default paging parameters to request data from other pages or completely customize the paging functionality, leaving undefined will cause paging to use defaults, setting to false will turn off paging and request all data for this single read request
    @param {Object} [options.query] - a hash of key/value pairs that can be passed to the server as additional information for use when determining what data to return
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

// Get a set of key/value pairs of all data on the server associated with this pipe
var allData = myPipe.read();

// A data object can be passed to filter the data and in the case of REST,
// this object is converted to query string parameters which the server can use.
// The values would be determined by what the server is expecting
var filteredData = myPipe.read({
    query: {
        limit: 10,
        date: "2012-08-01"
        ...
    }
});

    @example
//JSONP - Default JSONP call to a JSONP server
myPipe.read({
    jsonp: true,
    success: function( data ){
        .....
    }
});

//JSONP - JSONP call with a changed callback parameter
myPipe.read({
    jsonp: {
        callback: "jsonp"
    },
    success: function( data ){
        .....
    }
});

    @example
//Paging - using the default weblinking protocal
var defaultPagingPipe = AeroGear.Pipeline([{
    name: "webLinking",
    settings: {
        endpoint: "pageTestWebLink",
        pageConfig: true
    }
}]).pipes[0];

//Get a limit of 2 pieces of data from the server, starting from the first page
//Calling the "next" function will get the next 2 pieces of data, if available.
//Similarily, calling the "previous" function will get the previous 2 pieces of data, if available
defaultPagingPipe.read({
    offsetValue: 1,
    limitValue: 2,
    success: function( data, textStatus, jqXHR ) {
        data.next({
            success: function( data ) {
                data.previous({
                    success: function() {
                    }
                });
            }
        });
    }
});

//Create a new Pipe with a custom paging options
var customPagingPipe = AeroGear.Pipeline([{
    name: "customPipe",
    settings: {
        pageConfig: {
            metadataLocation: "header",
            previousIdentifier: "back",
            nextIdentifier: "forward"
        }
    }
}]).pipes[0];

//Even with custom options, you use "next" and "previous" the same way
customPagingPipe.read({
    offsetValue: 1,
    limitValue: 2,
    success: function( data, textStatus, jqXHR ) {
        data.next({
            success: function( data ) {
                data.previous({
                    success: function() {
                    }
                });
            }
        });
    }
});
 */
AeroGear.Pipeline.adapters.Rest.prototype.read = function( options ) {
    var url, success, error, extraOptions,
        that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        pageConfig = this.getPageConfig();

    options = options ? options : {};
    options.query = options.query ? options.query : {};

    if ( options[ recordId ] ) {
        url = ajaxSettings.url + "/" + options[ recordId ];
    } else {
        url = ajaxSettings.url;
    }

    // Handle paging
    if ( pageConfig && options.paging !== false ) {
        // Set custom paging to defaults if not used
        if ( !options.paging ) {
            options.paging = {
                offset: options.offsetValue || 0,
                limit: options.limitValue || 10
            };
        }

        // Apply paging to request
        options.query = options.query || {};
        for ( var item in options.paging ) {
            options.query[ item ] = options.paging[ item ];
        }
    }

    success = function( data, textStatus, jqXHR ) {
        var paramMap;

        // Generate paged response
        if ( pageConfig && options.paging !== false ) {
            paramMap = that[ pageConfig.metadataLocation + "PageParser" ]( pageConfig.metadataLocation === "body" ? data : jqXHR );

            [ "previous", "next" ].forEach( function( element ) {
                data[ element ] = (function( pipe, parameters, options ) {
                    return function( callbacks ) {
                        options.paging = true;
                        options.offsetValue = options.limitValue = undefined;
                        options.query = parameters;
                        options.success = callbacks && callbacks.success ? callbacks.success : options.success;
                        options.error = callbacks && callbacks.error ? callbacks.error : options.error;

                        return pipe.read( options );
                    };
                })( that, paramMap[ pageConfig[ element + "Identifier" ] ], options );
            });
        }

        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = {
        type: "GET",
        data: options.query,
        success: success,
        error: error,
        url: url,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    };

    if( options.jsonp ) {
        extraOptions.dataType = "jsonp";
        extraOptions.jsonp = options.jsonp.callback ? options.jsonp.callback : "callback";
        if( options.jsonp.customCallback ) {
            extraOptions.jsonpCallback = options.jsonp.customCallback;
        }
    }

    return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
};

/**
    Save data asynchronously to the server. If this is a new object (doesn't have a record identifier provided by the server), the data is created on the server (POST) and then that record is sent back to the client including the new server-assigned id, otherwise, the data on the server is updated (PUT).
    @param {Object} data - For new data, this will be an object representing the data to be saved to the server. For updating data, a hash of key/value pairs one of which must be the `recordId` you set during creation of the pipe representing the identifier the server will use to update this record and then any other number of pairs representing the data. The data object is then stringified and passed to the server to be processed.
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
    var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

    // Store a new task
    myPipe.save({
        title: "Created Task",
        date: "2012-07-13",
        ...
    });

    // Pass a success and error callback, in this case using the REST pipe and jQuery.ajax so the functions take the same parameters.
    myPipe.save({
        title: "Another Created Task",
        date: "2012-07-13",
        ...
    },
    {
        success: function( data, textStatus, jqXHR ) {
            console.log( "Success" );
        },
        error: function( jqXHR, textStatus, errorThrown ) {
            console.log( "Error" );
        }
    });

    // Update an existing piece of data
    var toUpdate = {
        id: "Some Existing ID",
        title: "Updated Task"
    }
    myPipe.save( toUpdate );
 */
AeroGear.Pipeline.adapters.Rest.prototype.save = function( data, options ) {
    var that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        type,
        url,
        success,
        error,
        extraOptions;

    data = data || {};
    options = options || {};
    type = data[ recordId ] ? "PUT" : "POST";

    if ( data[ recordId ] ) {
        url = ajaxSettings.url + "/" + data[ recordId ];
    } else {
        url = ajaxSettings.url;
    }

    success = function( data, textStatus, jqXHR ) {
        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = jQuery.extend( {}, ajaxSettings, {
        data: data,
        type: type,
        url: url,
        success: success,
        error: error,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    });

    // Stringify data if we actually want to POST/PUT JSON data
    if ( extraOptions.contentType === "application/json" && extraOptions.data && typeof extraOptions.data !== "string" ) {
        extraOptions.data = JSON.stringify( extraOptions.data );
    }

    return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
};

/**
    Remove data asynchronously from the server. Passing nothing will inform the server to remove all data at this pipe's endpoint.
    @param {String|Object} [data] - A variety of objects can be passed to specify the item(s) to remove
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @returns {Object} The jqXHR created by jQuery.ajax. To cancel the request, simply call the abort() method of the jqXHR object which will then trigger the error and complete callbacks for this request. For more info, see the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @example
    var myPipe = AeroGear.Pipeline( "tasks" ).pipes[ 0 ];

    // Store a new task
    myPipe.save({
        title: "Created Task",
        id: 1
    });

    // Store another new task
    myPipe.save({
        title: "Another Created Task",
        id: 2
    });

    // Store one more new task
    myPipe.save({
        title: "And Another Created Task",
        id: 3
    });

    // Remove a particular item from the server by its id
    myPipe.remove( 1 );

    // Delete all remaining data from the server associated with this pipe
    myPipe.remove();
 */
AeroGear.Pipeline.adapters.Rest.prototype.remove = function( toRemove, options ) {
    var that = this,
        recordId = this.getRecordId(),
        ajaxSettings = this.getAjaxSettings(),
        delPath = "",
        delId,
        url,
        success,
        error,
        extraOptions;

    if ( typeof toRemove === "string" || typeof toRemove === "number" ) {
        delId = toRemove;
    } else if ( toRemove && toRemove[ recordId ] ) {
        delId = toRemove[ recordId ];
    } else if ( toRemove && !options ) {
        // No remove item specified so treat as options
        options = toRemove;
    }

    options = options || {};

    delPath = delId ? "/" + delId : "";
    url = ajaxSettings.url + delPath;

    success = function( data, textStatus, jqXHR ) {
        if ( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( jqXHR, textStatus, errorThrown ) {
        jqXHR = that.formatJSONError( jqXHR );
        if ( options.error ) {
            options.error.apply( this, arguments );
        }
    };
    extraOptions = {
        type: "DELETE",
        url: url,
        success: success,
        error: error,
        statusCode: options.statusCode,
        complete: options.complete,
        headers: options.headers,
        timeout: this.getTimeout()
    };

    return jQuery.ajax( jQuery.extend( {}, ajaxSettings, extraOptions ) );
};

/**
    A collection of data connections (stores) and their corresponding data models. This object provides a standard way to interact with client side data no matter the data format or storage mechanism used.
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the store(s) being created along with the DataManager. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the store will later be referenced by
    @param {String} [config.type="memory"] - the type of store as determined by the adapter used
    @param {String} [config.recordId="id"] - the identifier used to denote the unique id for each record in the data associated with this store
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {object} dataManager - The created DataManager containing any stores that may have been created
    @example
// Create an empty DataManager
var dm = AeroGear.DataManager();

// Create a single store using the default adapter
var dm2 = AeroGear.DataManager( "tasks" );

// Create multiple stores using the default adapter
var dm3 = AeroGear.DataManager( [ "tasks", "projects" ] );

//Create a custom store
var dm3 = AeroGear.DataManager({
    name: "mySessionStorage",
    type: "SessionLocal",
    id: "customID"
});

//Create multiple custom stores
var dm4 = AeroGear.DataManager([
    {
        name: "mySessionStorage",
        type: "SessionLocal",
        id: "customID"
    },
    {
        name: "mySessionStorage2",
        type: "SessionLocal",
        id: "otherId",
        settings: { ... }
    }
]);
 */
AeroGear.DataManager = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager ) ) {
        return new AeroGear.DataManager( config );
    }

    // Super Constructor
    AeroGear.Core.call( this );

    this.lib = "DataManager";
    this.type = config ? config.type || "Memory" : "Memory";

    /**
        The name used to reference the collection of data store instances created from the adapters
        @memberOf AeroGear.DataManager
        @type Object
        @default stores
     */
    this.collectionName = "stores";

    this.add( config );
};

AeroGear.DataManager.prototype = AeroGear.Core;
AeroGear.DataManager.constructor = AeroGear.DataManager;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.DataManager namespace dynamically and still be accessible to the add method
    @augments AeroGear.DataManager
 */
AeroGear.DataManager.adapters = {};

// Constants
AeroGear.DataManager.STATUS_NEW = 1;
AeroGear.DataManager.STATUS_MODIFIED = 2;
AeroGear.DataManager.STATUS_REMOVED = 0;

/**
    The Memory adapter is the default type used when creating a new store. Data is simply stored in a data var and is lost on unload (close window, leave page, etc.)
    This constructor is instantiated when the "DataManager.add()" method is called
    @constructs AeroGear.DataManager.adapters.Memory
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @returns {Object} The created store
    @example
//Create an empty DataManager
var dm = AeroGear.DataManager();

//Add a custom memory store
dm.add( "newStore", {
    recordId: "customID"
});
 */
AeroGear.DataManager.adapters.Memory = function( storeName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager.adapters.Memory ) ) {
        return new AeroGear.DataManager.adapters.Memory( storeName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var recordId = settings.recordId ? settings.recordId : "id",
        type = "Memory",
        data = null;

    // Privileged Methods
    /**
        Returns the value of the private recordId var
        @private
        @augments Memory
        @returns {String}
     */
    this.getRecordId = function() {
        return recordId;
    };

    /**
        Returns the value of the private data var
        @private
        @augments Memory
        @returns {Array}
     */
    this.getData = function() {
        return data;
    };

    /**
        Sets the value of the private data var
        @private
        @augments Memory
     */
    this.setData = function( newData ) {
        data = newData;
    };

    /**
        Empties the value of the private data var
        @private
        @augments Memory
     */
    this.emptyData = function() {
        data = null;
    };

    /**
        Adds a record to the store's data set
        @private
        @augments Memory
     */
    this.addDataRecord = function( record ) {
        data = data || [];
        data.push( record );
    };

    /**
        Adds a record to the store's data set
        @private
        @augments Memory
     */
    this.updateDataRecord = function( index, record ) {
        data[ index ] = record;
    };

    /**
        Removes a single record from the store's data set
        @private
        @augments Memory
     */
    this.removeDataRecord = function( index ) {
        data.splice( index, 1 );
    };

    /**
        Little utility used to compare nested object values in the filter method
        @private
        @augments Memory
        @param {String} nestedKey - Filter key to test
        @param {Object} nestedFilter - Filter object to test
        @param {Object} nestedValue - Value object to test
        @returns {Boolean}
     */
    this.traverseObjects = function( nestedKey, nestedFilter, nestedValue ) {
        while ( typeof nestedFilter === "object" ) {
            if ( nestedValue ) {
                // Value contains this key so continue checking down the object tree
                nestedKey = Object.keys( nestedFilter )[ 0 ];
                nestedFilter = nestedFilter[ nestedKey ];
                nestedValue = nestedValue[ nestedKey ];
            } else {
                break;
            }
        }
        if ( nestedFilter === nestedValue ) {
            return true;
        } else {
            return false;
        }
    };
};

// Public Methods
/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @returns {Array} Returns data from the store, optionally filtered by an id
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// Get an array of all data in the store
var allData = dm.read();

//Read a specific piece of data based on an id
var justOne = dm.read( 12345 );
 */
AeroGear.DataManager.adapters.Memory.prototype.read = function( id ) {
    var filter = {};
    filter[ this.getRecordId() ] = id;
    return id ? this.filter( filter ) : this.getData();
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Boolean} [reset] - If true, this will empty the current data and set it to the data being saved
    @returns {Array} Returns the updated data from the store
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task",
    date: "2012-07-13",
    ...
});

//Store an array of new Tasks
dm.save([
    {
        title: "Task2",
        date: "2012-07-13"
    },
    {
        title: "Task3",
        date: "2012-07-13"
        ...
    }
]);

// Update an existing piece of data
var toUpdate = dm.read()[ 0 ];
toUpdate.data.title = "Updated Task";
dm.save( toUpdate );
 */
AeroGear.DataManager.adapters.Memory.prototype.save = function( data, reset ) {
    var itemFound = false;

    data = AeroGear.isArray( data ) ? data : [ data ];

    if ( reset ) {
        this.setData( data );
    } else {
        if ( this.getData() ) {
            for ( var i = 0; i < data.length; i++ ) {
                for( var item in this.getData() ) {
                    if ( this.getData()[ item ][ this.getRecordId() ] === data[ i ][ this.getRecordId() ] ) {
                        this.updateDataRecord( item, data[ i ] );
                        itemFound = true;
                        break;
                    }
                }
                if ( !itemFound ) {
                    this.addDataRecord( data[ i ] );
                }

                itemFound = false;
            }
        } else {
            this.setData( data );
        }
    }

    return this.getData();
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @returns {Array} Returns the updated data from the store
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task"
});

// Store another new task
dm.save({
    title: "Another Created Task"
});

// Store one more new task
dm.save({
    title: "And Another Created Task"
});

// Remove a particular item from the store by its id
var toRemove = dm.read()[ 0 ];
dm.remove( toRemove.id );

// Remove an item from the store using the data object
toRemove = dm.read()[ 0 ];
dm.remove( toRemove );

// Delete all remaining data from the store
dm.remove();
 */
AeroGear.DataManager.adapters.Memory.prototype.remove = function( toRemove ) {
    if ( !toRemove ) {
        // empty data array and return
        this.emptyData();
        return this.getData();
    } else {
        toRemove = AeroGear.isArray( toRemove ) ? toRemove : [ toRemove ];
    }
    var delId,
        data,
        item;

    for ( var i = 0; i < toRemove.length; i++ ) {
        if ( typeof toRemove[ i ] === "string" || typeof toRemove[ i ] === "number" ) {
            delId = toRemove[ i ];
        } else if ( toRemove ) {
            delId = toRemove[ i ][ this.getRecordId() ];
        } else {
            // Missing record id so just skip this item in the arrray
            continue;
        }

        data = this.getData( true );
        for( item in data ) {
            if ( data[ item ][ this.getRecordId() ] === delId ) {
                this.removeDataRecord( item );
            }
        }
    }

    return this.getData();
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @returns {Array} Returns a filtered array of data objects based on the contents of the store's data object and the filter parameters. This method only returns a copy of the data and leaves the original data object intact.
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// An object can be passed to filter the data
// This would return all records with a user named 'admin' **AND** a date of '2012-08-01'
var filteredData = dm.filter({
    date: "2012-08-01",
    user: "admin"
});

// The matchAny parameter changes the search to an OR operation
// This would return all records with a user named 'admin' **OR** a date of '2012-08-01'
var filteredData = dm.filter({
    date: "2012-08-01",
    user: "admin"
}, true);
 */
AeroGear.DataManager.adapters.Memory.prototype.filter = function( filterParameters, matchAny ) {
    var filtered, key, j, k, l, nestedKey, nestedFilter, nestedValue,
        that = this;

    if ( !filterParameters ) {
        filtered = this.getData() || [];
        return filtered;
    }

    filtered = this.getData().filter( function( value, index, array) {
        var match = matchAny ? false : true,
            keys = Object.keys( filterParameters ),
            filterObj, paramMatch, paramResult;

        for ( key = 0; key < keys.length; key++ ) {
            if ( filterParameters[ keys[ key ] ].data ) {
                // Parameter value is an object
                filterObj = filterParameters[ keys[ key ] ];
                paramResult = filterObj.matchAny ? false : true;

                for ( j = 0; j < filterObj.data.length; j++ ) {
                    if( AeroGear.isArray( value[ keys[ key ] ] ) ) {
                        if( value[ keys [ key ] ].length ) {
                            if( jQuery( value[ keys ] ).not( filterObj.data ).length === 0 && jQuery( filterObj.data ).not( value[ keys ] ).length === 0 ) {
                                paramResult = true;
                                break;
                            } else {
                                for( k = 0; k < value[ keys[ key ] ].length; k++ ) {
                                    if ( filterObj.matchAny && filterObj.data[ j ] === value[ keys[ key ] ][ k ] ) {
                                        // At least one value must match and this one does so return true
                                        paramResult = true;
                                        if( matchAny ) {
                                            break;
                                        } else {
                                            for( l = 0; l < value[ keys[ key ] ].length; l++ ) {
                                                if( !matchAny && filterObj.data[ j ] !== value[ keys[ key ] ][ l ] ) {
                                                    // All must match but this one doesn't so return false
                                                    paramResult = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if ( !filterObj.matchAny && filterObj.data[ j ] !== value[ keys[ key ] ][ k ] ) {
                                        // All must match but this one doesn't so return false
                                        paramResult = false;
                                        break;
                                    }
                                }
                            }
                        } else {
                            paramResult = false;
                        }
                    } else {
                        if ( typeof filterObj.data[ j ] === "object" ) {
                            if ( filterObj.matchAny && that.traverseObjects( keys[ key ], filterObj.data[ j ], value[ keys[ key ] ] ) ) {
                                // At least one value must match and this one does so return true
                                paramResult = true;
                                break;
                            }
                            if ( !filterObj.matchAny && !that.traverseObjects( keys[ key ], filterObj.data[ j ], value[ keys[ key ] ] ) ) {
                                // All must match but this one doesn't so return false
                                paramResult = false;
                                break;
                            }
                        } else {
                            if ( filterObj.matchAny && filterObj.data[ j ] === value[ keys[ key ] ] ) {
                                // At least one value must match and this one does so return true
                                paramResult = true;
                                break;
                            }
                            if ( !filterObj.matchAny && filterObj.data[ j ] !== value[ keys[ key ] ] ) {
                                // All must match but this one doesn't so return false
                                paramResult = false;
                                break;
                            }
                        }
                    }
                }
            } else {
                // Filter on parameter value
                if( AeroGear.isArray( value[ keys[ key ] ] ) ) {
                    paramResult = matchAny ? false: true;

                    if( value[ keys[ key ] ].length ) {
                        for(j = 0; j < value[ keys[ key ] ].length; j++ ) {
                            if( matchAny && filterParameters[ keys[ key ] ] === value[ keys[ key ] ][ j ]  ) {
                                //at least one must match and this one does so return true
                                paramResult = true;
                                break;
                            }
                            if( !matchAny && filterParameters[ keys[ key ] ] !== value[ keys[ key ] ][ j ] ) {
                                //All must match but this one doesn't so return false
                                paramResult = false;
                                break;
                            }
                        }
                    } else {
                        paramResult = false;
                    }
                } else {
                    if ( typeof filterParameters[ keys[ key ] ] === "object" ) {
                        paramResult = that.traverseObjects( keys[ key ], filterParameters[ keys[ key ] ], value[ keys[ key ] ] );
                    } else {
                        paramResult = filterParameters[ keys[ key ] ] === value[ keys[ key ] ] ? true : false;
                    }
                }
            }

            if ( matchAny && paramResult ) {
                // At least one item must match and this one does so return true
                match = true;
                break;
            }
            if ( !matchAny && !paramResult ) {
                // All must match but this one doesn't so return false
                match = false;
                break;
            }
        }

        return match;
    });

    return filtered;
};

/**
    The SessionLocal adapter extends the Memory adapter to store data in either session or local storage which makes it a little more persistent than memory
    This constructor is instantiated when the "DataManager.add()" method is called
    @constructs AeroGear.DataManager.adapters.SessionLocal
    @mixes AeroGear.DataManager.adapters.Memory
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {String} [settings.storageType="sessionStorage"] - the type of store can either be sessionStorage or localStorage
    @returns {Object} The created store
    @example
//Create an empty DataManager
var dm = AeroGear.DataManager();

//Add a custom SessionLocal store using local storage as its storage type
dm.add( "newStore", {
    recordId: "customID",
    storageType: "localStorage"
});
 */
AeroGear.DataManager.adapters.SessionLocal = function( storeName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager.adapters.SessionLocal ) ) {
        return new AeroGear.DataManager.adapters.SessionLocal( storeName, settings );
    }

    AeroGear.DataManager.adapters.Memory.apply( this, arguments );

    // Private Instance vars
    var data = null,
        type = "SessionLocal",
        storeType = settings.storageType || "sessionStorage",
        name = storeName,
        appContext = document.location.pathname.replace(/[\/\.]/g,"-"),
        storeKey = name + appContext,
        content = window[ storeType ].getItem( storeKey ),
        currentData = content ? JSON.parse( content ) : null ;

    // Initialize data from the persistent store if it exists
    if ( currentData ) {
        AeroGear.DataManager.adapters.Memory.prototype.save.call( this, currentData, true );
    }

    // Privileged Methods
    /**
        Returns the value of the private storeType var
        @private
        @augments SessionLocal
        @returns {String}
     */
    this.getStoreType = function() {
        return storeType;
    };

    /**
        Returns the value of the private storeKey var
        @private
        @augments SessionLocal
        @returns {String}
     */
    this.getStoreKey = function() {
        return storeKey;
    };
};

// Inherit from the Memory adapter
AeroGear.DataManager.adapters.SessionLocal.prototype = Object.create( new AeroGear.DataManager.adapters.Memory(), {
    // Public Methods
    /**
        Saves data to the store, optionally clearing and resetting the data
        @method
        @memberof AeroGear.DataManager.adapters.SessionLocal
        @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
        @param {Object} [options] - The options to be passed to the save method
        @param {Function} [options.error] - A callback to be executed when an error is thrown trying to save data to the store. The most likely error is when the localStorage is full. The callback is passed the error object and the data that was attempted to be saved as arguments.
        @param {AeroGear~errorCallbackStorage} [options.success] - A callback to be called if the save was successful. This probably isn't necessary since the save is synchronous but is provided for API symmetry.
        @param {AeroGear~successCallbackStorage} [options.reset] - If true, this will empty the current data and set it to the data being saved
        @returns {Array} Returns the updated data from the store or in the case of a storage error, returns the unchanged data
        @example
var dm = AeroGear.DataManager([{ name: "tasks", type: "SessionLocal" }]).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task",
    date: "2012-07-13",
    ...
});

//Store an array of new Tasks
dm.save([
    {
        title: "Task2",
        date: "2012-07-13"
    },
    {
        title: "Task3",
        date: "2012-07-13"
        ...
    }
]);

// Update an existing piece of data
var toUpdate = dm.read()[ 0 ];
toUpdate.data.title = "Updated Task";
dm.save( toUpdate );
     */
    save: {
        value: function( data, options ) {
            // Call the super method
            var reset = options && options.reset ? options.reset : false,
                oldData = window[ this.getStoreType() ].getItem( this.getStoreKey() ),
                newData = AeroGear.DataManager.adapters.Memory.prototype.save.apply( this, [ arguments[ 0 ], reset ] );

            // Sync changes to persistent store
            try {
                window[ this.getStoreType() ].setItem( this.getStoreKey(), JSON.stringify( newData ) );
                if ( options && options.storageSuccess ) {
                    options.storageSuccess( newData );
                }
            } catch( error ) {
                oldData = oldData ? JSON.parse( oldData ) : [];
                newData = AeroGear.DataManager.adapters.Memory.prototype.save.apply( this, [ oldData, true ] );
                if ( options && options.storageError ) {
                    options.storageError( error, data );
                } else {
                    throw error;
                }
            }

            return newData;
        }, enumerable: true, configurable: true, writable: true
    },
    /**
        Removes data from the store
        @method
        @memberof AeroGear.DataManager.adapters.SessionLocal
        @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
        @returns {Array} Returns the updated data from the store
        @example
var dm = AeroGear.DataManager([{ name: "tasks", type: "SessionLocal" }]).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task"
});

// Store another new task
dm.save({
    title: "Another Created Task"
});

// Store one more new task
dm.save({
    title: "And Another Created Task"
});

// Remove a particular item from the store by its id
var toRemove = dm.read()[ 0 ];
dm.remove( toRemove.id );

// Remove an item from the store using the data object
toRemove = dm.read()[ 0 ];
dm.remove( toRemove );

// Delete all remaining data from the store
dm.remove();
     */
    remove: {
        value: function( toRemove ) {
            // Call the super method
            var newData = AeroGear.DataManager.adapters.Memory.prototype.remove.apply( this, arguments );

            // Sync changes to persistent store
            window[ this.getStoreType() ].setItem( this.getStoreKey(), JSON.stringify( newData ) );

            return newData;
        }, enumerable: true, configurable: true, writable: true
    }
});

/**
    The AeroGear.Auth namespace provides an authentication and enrollment API. Through the use of adapters, this library provides common methods like enroll, login and logout that will just work.
    @class
    @param {String|Array|Object} [config] - A configuration for the modules(s) being created along with the authenticator. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the module will later be referenced by
    @param {String} [config.type="rest"] - the type of module as determined by the adapter used
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {Object} The created authenticator containing any auth modules that may have been created
    @example
// Create an empty authenticator
var auth = AeroGear.Auth();

// Create a single module using the default adapter
var auth2 = AeroGear.Auth( "myAuth" );

// Create multiple modules using the default adapter
var auth3 = AeroGear.Auth( [ "someAuth", "anotherAuth" ] );

//Create a single module by passing an object using the default adapter
var auth4 = AeroGear.Auth(
    {
        name: "objectAuth"
    }
);

//Create multiple modules by passing an array of objects using the default adapter
var auth5 = AeroGear.Auth([
    {
        name: "objectAuth"
    },
    {
        name: "objectAuth2",
        settings: { ... }
    }
]);
 */
AeroGear.Auth = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Auth ) ) {
        return new AeroGear.Auth( config );
    }
    // Super Constructor
    AeroGear.Core.call( this );

    this.lib = "Auth";
    this.type = config ? config.type || "Rest" : "Rest";

    /**
        The name used to reference the collection of authentication module instances created from the adapters
        @memberOf AeroGear.Auth
        @type Object
        @default modules
     */
    this.collectionName = "modules";

    this.add( config );
};

AeroGear.Auth.prototype = AeroGear.Core;
AeroGear.Auth.constructor = AeroGear.Auth;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Auth namespace dynamically and still be accessible to the add method
    @augments AeroGear.Auth
 */
AeroGear.Auth.adapters = {};

/**
    The REST adapter is the default type used when creating a new authentication module. It uses jQuery.ajax to communicate with the server.
    This constructor is instantiated when the "Auth.add()" method is called
    @constructs AeroGear.Auth.adapters.Rest
    @param {String} moduleName - the name used to reference this particular auth module
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.baseURL] - defines the base URL to use for an endpoint
    @param {Object} [settings.endpoints={}] - a set of REST endpoints that correspond to the different public methods including enroll, login and logout
    @returns {Object} The created auth module
    @example
//Create an empty Authenticator
var auth = AeroGear.Auth();

//Add a custom REST module to it
auth.add( "module1", {
    baseURL: "http://customURL.com"
});

//Add a custom REST module to it with custom security endpoints
auth.add( "module2", {
    endpoints: {
        enroll: "register",
        login: "go",
        logout: "leave"
    }
});
 */
AeroGear.Auth.adapters.Rest = function( moduleName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Auth.adapters.Rest ) ) {
        return new AeroGear.Auth.adapters.Rest( moduleName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var endpoints = settings.endpoints || {},
        type = "Rest",
        name = moduleName,
        baseURL = settings.baseURL || "";

    // Privileged methods
    /**
        Returns the value of the private settings var
        @private
        @augments Rest
     */
    this.getSettings = function() {
        return settings;
    };


    /**
        Returns the value of the private settings var
        @private
        @augments Rest
     */
    this.getEndpoints = function() {
        return endpoints;
    };

    /**
        Returns the value of the private name var
        @private
        @augments Rest
     */
    this.getName = function() {
        return name;
    };

    /**
        Returns the value of the private baseURL var
        @private
        @augments Rest
     */
    this.getBaseURL = function() {
        return baseURL;
    };

    /**
        Process the options passed to a method
        @private
        @augments Rest
     */
     this.processOptions = function( options ) {
        var processedOptions = {};
        if ( options.contentType ) {
            processedOptions.contentType = options.contentType;
        }

        if ( options.dataType ) {
            processedOptions.dataType = options.dataType;
        }

        if ( options.baseURL ) {
            processedOptions.url = options.baseURL;
        } else {
            processedOptions.url = baseURL;
        }

        return processedOptions;
     };
};

//Public Methods
/**
    Enroll a new user in the authentication system
    @param {Object} data - User profile to enroll
    @param {Object} [options={}] - Options to pass to the enroll method
    @param {String} [options.baseURL] - defines the base URL to use for an endpoint
    @param {String} [options.contentType] - set the content type for the AJAX request
    @param {String} [options.dataType] - specify the data expected to be returned by the server
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
var auth = AeroGear.Auth( "userAuth" ).modules[ 0 ],
    data = { userName: "user", password: "abc123", name: "John" };

// Enroll a new user
auth.enroll( data );

//Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules[ 0 ],
data = { userName: "user", password: "abc123", name: "John" };

custom.enroll( data, {
    baseURL: "http://customurl/",
    success: function( data ) { ... },
    error: function( error ) { ... }
});
 */
AeroGear.Auth.adapters.Rest.prototype.enroll = function( data, options ) {
    options = options || {};

    var that = this,
        name = this.getName(),
        endpoints = this.getEndpoints(),
        success = function( data, textStatus, jqXHR ) {
            if ( options.success ) {
                options.success.apply( this, arguments );
            }
        },
        error = function( jqXHR, textStatus, errorThrown ) {
            var args;

            try {
                jqXHR.responseJSON = JSON.parse( jqXHR.responseText );
                args = [ jqXHR, textStatus, errorThrown ];
            } catch( error ) {
                args = arguments;
            }

            if ( options.error ) {
                options.error.apply( this, args );
            }
        },
        extraOptions = jQuery.extend( {}, this.processOptions( options ), {
            complete: options.complete,
            success: success,
            error: error,
            data: data
        });

    if ( endpoints.enroll ) {
        extraOptions.url += endpoints.enroll;
    } else {
        extraOptions.url += "auth/enroll";
    }

    // Stringify data if we actually want to POST JSON data
    if ( extraOptions.contentType === "application/json" && extraOptions.data && typeof extraOptions.data !== "string" ) {
        extraOptions.data = JSON.stringify( extraOptions.data );
    }

    return jQuery.ajax( jQuery.extend( {}, this.getSettings(), { type: "POST" }, extraOptions ) );
};

/**
    Authenticate a user
    @param {Object} data - A set of key value pairs representing the user's credentials
    @param {Object} [options={}] - An object containing key/value pairs representing options
    @param {String} [options.baseURL] - defines the base URL to use for an endpoint
    @param {String} [options.contentType] - set the content type for the AJAX request
    @param {String} [options.dataType] - specify the data expected to be returned by the server
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
var auth = AeroGear.Auth( "userAuth" ).modules[ 0 ],
    data = { userName: "user", password: "abc123" };

// Enroll a new user
auth.login( data );

//Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules[ 0 ],
data = { userName: "user", password: "abc123", name: "John" };

custom.login( data, {
    baseURL: "http://customurl/",
    success: function( data ) { ... },
    error: function( error ) { ... }
});
 */
AeroGear.Auth.adapters.Rest.prototype.login = function( data, options ) {
    options = options || {};

    var that = this,
        name = this.getName(),
        endpoints = this.getEndpoints(),
        success = function( data, textStatus, jqXHR ) {
            if ( options.success ) {
                options.success.apply( this, arguments );
            }
        },
        error = function( jqXHR, textStatus, errorThrown ) {
            var args;

            try {
                jqXHR.responseJSON = JSON.parse( jqXHR.responseText );
                args = [ jqXHR, textStatus, errorThrown ];
            } catch( error ) {
                args = arguments;
            }

            if ( options.error ) {
                options.error.apply( this, args );
            }
        },
        extraOptions = jQuery.extend( {}, this.processOptions( options ), {
            complete: options.complete,
            success: success,
            error: error,
            data: data
        });

    if ( endpoints.login ) {
        extraOptions.url += endpoints.login;
    } else {
        extraOptions.url += "auth/login";
    }

    // Stringify data if we actually want to POST/PUT JSON data
    if ( extraOptions.contentType === "application/json" && extraOptions.data && typeof extraOptions.data !== "string" ) {
        extraOptions.data = JSON.stringify( extraOptions.data );
    }

    return jQuery.ajax( jQuery.extend( {}, this.getSettings(), { type: "POST" }, extraOptions ) );
};

/**
    End a user's authenticated session
    @param {Object} [options={}] - An object containing key/value pairs representing options
    @param {String} [options.baseURL] - defines the base URL to use for an endpoint
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
var auth = AeroGear.Auth( "userAuth" ).modules[ 0 ];

// Enroll a new user
auth.logout();

    //Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules[ 0 ],
data = { userName: "user", password: "abc123", name: "John" };

custom.logout({
    baseURL: "http://customurl/",
    success: function( data ) { ... },
    error: function( error ) { ... }
});
 */
AeroGear.Auth.adapters.Rest.prototype.logout = function( options ) {
    options = options || {};

    var that = this,
        name = this.getName(),
        endpoints = this.getEndpoints(),
        success = function( data, textStatus, jqXHR ) {
            if ( options.success ) {
                options.success.apply( this, arguments );
            }
        },
        error = function( jqXHR, textStatus, errorThrown ) {
            var args;

            try {
                jqXHR.responseJSON = JSON.parse( jqXHR.responseText );
                args = [ jqXHR, textStatus, errorThrown ];
            } catch( error ) {
                args = arguments;
            }

            if ( options.error ) {
                options.error.apply( this, args );
            }
        },
        extraOptions = jQuery.extend( {}, this.processOptions( options ), {
            complete: options.complete,
            success: success,
            error: error
        });

    if ( endpoints.logout ) {
        extraOptions.url += endpoints.logout;
    } else {
        extraOptions.url += "auth/logout";
    }

    return jQuery.ajax( jQuery.extend( {}, this.getSettings(), { type: "POST" }, extraOptions ) );
};

(function( AeroGear, $, undefined ) {
    /**
        The UnifiedPushClient object is used to perfom register and unregister operations against the AeroGear UnifiedPush server.
        @constructs AeroGear.UnifiedPushClient
        @param {String} variantID - the id representing the mobile application variant
        @param {String} variantSecret - the secret for the mobile application variant
        @param {String} pushServerURL - the location of the UnifiedPush server
        @returns {Object} The created unified push server client
        @example
        //Create the UnifiedPush client object:
        var client = AeroGear.UnifiedPushClient(
            "myVariantID",
            "myVariantSecret",
            "http://SERVER:PORT/CONTEXT/rest/registry/device"
        );

        // assemble the metadata for the registration:
        var metadata = {
            deviceToken: "theDeviceToken",
            alias: "some_username",
            category: "email",
            simplePushEndpoint: "http://server.com/simplePushEndpoint"
        };

        // perform the registration against the UnifiedPush server:
        client.registerWithPushServer(metadata);

     */
    AeroGear.UnifiedPushClient = function( variantID, variantSecret, pushServerURL ) {

        // we require all arguments to be present, otherwise it does not work
        if ( !variantID || !variantSecret || !pushServerURL ) {
            throw "UnifiedPushClientException";
        }

        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.UnifiedPushClient ) ) {
            return new AeroGear.UnifiedPushClient( variantID, variantSecret, pushServerURL );
        }

        /**
            Performs a register request against the UnifiedPush Server using the given metadata which represents a client that wants to register with the server.
            @param {Object} metadata - the metadata for the client
            @param {String} metadata.deviceToken - identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} metadata.simplePushEndpoint - the URL of the given SimplePush server/network that is needed in order to trigger a notification to be sent to the SimplePush client.
            @param {String} [metadata.alias] - Application specific alias to identify users with the system. Common use case would be an email address or a username.
            @param {String} [metadata.category] - In SimplePush this is the name of the registration endpoint. On Hybrid platforms like Apache Cordova this is used for tagging the registered client.
            @param {String} [metadata.operatingSystem] - Useful on Hybrid platforms like Apache Cordova to specifiy the underlying operating system.
            @param {String} [metadata.osVersion] - Useful on Hybrid platforms like Apache Cordova to specify the version of the underlying operating system.
            @param {String} [metadata.deviceType] - Useful on Hybrid platforms like Apache Cordova to specify the type of the used device, like iPad or Android-Phone.
         */
        this.registerWithPushServer = function( metadata ) {

            // we need a deviceToken, registrationID or a channelID:
            if ( !metadata.deviceToken ) {
                throw "UnifiedPushRegistrationException";
            }

            // if we see a category that is not the (SimplePush) broadcast, we require the alias to be present:
            if ( metadata.category !== "broadcast" && !metadata.alias ) {
                throw "UnifiedPushRegistrationException";
            }

            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "POST",
                url: pushServerURL,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify( metadata )
            });
        };

        /**
            Performs an unregister request against the UnifiedPush Server for the given deviceToken. The deviceToken identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} deviceToken - unique String which identifies the client that is being unregistered.
         */
        this.unregisterWithPushServer = function( deviceToken ) {
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "DELETE",
                url: pushServerURL + "/" + deviceToken,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify({
                    deviceToken: deviceToken
                })
            });
        };
    };

})( AeroGear, jQuery );

(function( AeroGear, $, undefined ) {
    /**
        The SimplePushClient object is used as a sort of polyfill/implementation of the SimplePush spec implemented in Firefox OS and the Firefox browser and provides a mechanism for subscribing to and acting on push notifications in a web application. See https://wiki.mozilla.org/WebAPI/SimplePush
        @constructs AeroGear.SimplePushClient
        @param {Object} options - an object used to initialize the connection to the SimplePush server
        @param {Boolean} [options.useNative=false] - if true, the connection will first try to use the Mozilla push network (still in development and not ready for production) before falling back to the SimplePush server specified
        @param {String} [options.simplePushServerURL] - the URL of the SimplePush server. This option is optional but only if you don't want to support browsers that are missing websocket support and you trust the not yet production ready Mozilla push server.
        @param {Function} options.onConnect - a callback to fire when a connection is established with the SimplePush server. This is a deviation from the SimplePush spec as it is not necessary when you using the in browser functionality since the browser establishes the connection before the application is started.
        @param {Function} options.onClose - a callback to fire when a connection to the SimplePush server is closed or lost.
        @returns {Object} The created unified push server client
        @example
        //Create the SimplePushClient object:
        var client = AeroGear.SimplePushClient({
            simplePushServerURL: "https://localhost:7777/simplepush",
            onConnect: myConnectCallback,
            onClose: myCloseCallback
        });
     */
    AeroGear.SimplePushClient = function( options ) {
        // Allow instantiation without using new
        if ( !( this instanceof AeroGear.SimplePushClient ) ) {
            return new AeroGear.SimplePushClient( options );
        }

        this.options = options || {};

        // Check for native push support
        if ( !!navigator.push && this.options.useNative ) {
            // Browser supports push so let it handle it
            return;
        }

        if ( this.options.useNative ) {
            if ("WebSocket" in window ) {
                // No native push support but want to use Mozilla servers
                this.options.simplePushServerURL = "wss://push.services.mozilla.com";
            } else if ( !this.options.simplePushServerURL ) {
                // No native push support and no websocket support so can't talk to Mozilla server
                throw "SimplePushConfigurationError";
            } else {
                // No websocket, no native support but SimplePush server specified so try SockJS connection
                this.options.useNative = false;
            }
        }

        var spClient = this,
            connectOptions = {
                onConnect: function() {
                    /**
                        The window.navigator object
                        @namespace navigator
                     */

                    /**
                        Add the push object to the global navigator object
                        @constructs navigator.push
                     */
                    navigator.push = (function() {
                        return {
                            /**
                                Register a push notification channel with the SimplePush server
                                @function
                                @memberof navigator.push
                                @returns {Object} - The request object where a connection success callback can be registered
                                @example
                                var mailRequest = navigator.push.register();
                             */
                            register: function() {
                                var request = {
                                    onsuccess: function( event ) {}
                                };

                                if ( !spClient.simpleNotifier ) {
                                    throw "SimplePushConnectionError";
                                }

                                spClient.simpleNotifier.subscribe({
                                    requestObject: request,
                                    callback: function( message ) {
                                        $( navigator.push ).trigger({
                                            type: "push",
                                            message: message
                                        });
                                    }
                                });

                                return request;
                            },

                            /**
                                Unregister a push notification channel from the SimplePush server
                                @function
                                @memberof navigator.push
                                @example
                                navigator.push.unregister( mailEndpoint );
                             */
                            unregister: function( endpoint ) {
                                spClient.simpleNotifier.unsubscribe( endpoint );
                            },

                            /**
                                Reestablish the connection with the SimplePush server when closed or lost. This is an addition and not part of the SimplePush spec
                                @function
                                @memberof navigator.push
                                @param {Object} options - an object used to initialize the connection to the SimplePush server
                                @param {String} options.simplePushServerURL - the URL of the SimplePush server
                                @param {Function} options.onConnect - a callback to fire when a connection is established with the SimplePush server. This is a deviation from the SimplePush spec as it is not necessary when you using the in browser functionality since the browser establishes the connection before the application is started.
                                @param {Function} options.onClose - a callback to fire when a connection to the SimplePush server is closed or lost.
                                @example
                                navigator.push.reconnect({
                                    simplePushServerURL: "https://localhost:7777/simplepush",
                                    onConnect: myConnectCallback,
                                    onClose: myCloseCallback
                                });
                             */
                            reconnect: function() {
                                spClient.simpleNotifier.connect( connectOptions );
                            }
                        };
                    })();

                    /**
                        Add the setMessageHandler function to the global navigator object
                        @constructs navigator.setMessageHandler
                        @param {String} messageType - a name or category to give the messages being received and in this implementation, likely 'push'
                        @param {Function} callback - the function to be called when a message of this type is received
                        @example
                        navigator.setMessageHandler( "push", function( message ) {
                            if ( message.channelID === mailEndpoint.channelID ) {
                                console.log("Mail Message Received");
                            }
                        });
                     */
                    navigator.setMessageHandler = function( messageType, callback ) {
                        $( navigator.push ).on( messageType, function( event ) {
                            var message = event.message;
                            callback.call( this, message );
                        });
                    };

                    if ( spClient.options.onConnect ) {
                        spClient.options.onConnect();
                    }
                },
                onClose: function() {
                    spClient.simpleNotifier.disconnect( spClient.options.onClose );
                }
            };

        // Create a Notifier connection to the Push Network
        spClient.simpleNotifier = AeroGear.Notifier({
            name: "agPushNetwork",
            type: "SimplePush",
            settings: {
                connectURL: spClient.options.simplePushServerURL,
                useNative: spClient.options.useNative
            }
        }).clients.agPushNetwork;

        spClient.simpleNotifier.connect( connectOptions );
    };
})( AeroGear, jQuery );

/**
    The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the client(s) being created along with the notifier. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the client will later be referenced by
    @param {String} [config.type="vertx"] - the type of client as determined by the adapter used
    @param {Object} [config.settings={}] - the settings to be passed to the adapter
    @returns {Object} The created notifier containing any messaging clients that may have been created
    @example
    // Create an empty notifier
    var notifier = AeroGear.Notifier();

    // Create a single client using the default adapter
    var notifier2 = AeroGear.Notifier( "myNotifier" );

    // Create multiple clients using the default adapter
    var notifier3 = AeroGear.Notifier( [ "someNotifier", "anotherNotifier" ] );

    // Create a default adapter with settings
    var notifier4 = AeroGear.Notifier({
        name: "vertxNotifier",
        type: "vertx",
        settings: { ... }
    });

    // Create a stompws adapter with settings
    var notifier5 = AeroGear.Notifier({
        name: "STOMPNotifier",
        type: "stompws",
        settings: { ... }
    });

    // Create a vertx and stompws adapter with settings
    var notifier6 = AeroGear.Notifier([
        {
            name: "vertxNotifier",
            type: "vertx",
            settings: { ... }
        },
        {
            name: "STOMPNotifier",
            type: "stompws",
            settings: { ... }
        }
    ]);
 */
AeroGear.Notifier = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier ) ) {
        return new AeroGear.Notifier( config );
    }
    // Super Constructor
    AeroGear.Core.call( this );

    this.lib = "Notifier";
    this.type = config ? config.type || "vertx" : "vertx";

    /**
        The name used to reference the collection of notifier client instances created from the adapters
        @memberOf AeroGear.Notifier
        @type Object
        @default modules
     */
    this.collectionName = "clients";

    this.add( config );
};

AeroGear.Notifier.prototype = AeroGear.Core;
AeroGear.Notifier.constructor = AeroGear.Notifier;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Notifier namespace dynamically and still be accessible to the add method
    @augments AeroGear.Notifier
 */
AeroGear.Notifier.adapters = {};

/**
    A set of constants used to track the state of a client connection.
 */
AeroGear.Notifier.CONNECTING = 0;
AeroGear.Notifier.CONNECTED = 1;
AeroGear.Notifier.DISCONNECTING = 2;
AeroGear.Notifier.DISCONNECTED = 3;

/**
    This adapter allows communication with the AeroGear implementation of the SimplePush server protocol. Most of this functionality will be hidden behind the SimplePush client polyfill but is accessible if necessary.
    @constructs AeroGear.Notifier.adapters.SimplePush
    @param {String} clientName - the name used to reference this particular notifier client
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
    @param {Boolean} [settings.useNative=false] - Create a WebSocket connection to the Mozilla SimplePush server instead of a SockJS connection to a custom server
    @returns {Object} The created notifier client
 */
AeroGear.Notifier.adapters.SimplePush = function( clientName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier.adapters.SimplePush ) ) {
        return new AeroGear.Notifier.adapters.SimplePush( clientName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var type = "SimplePush",
        name = clientName,
        connectURL = settings.connectURL || "",
        useNative = settings.useNative || false,
        client = null,
        pushStore = JSON.parse( localStorage.getItem("ag-push-store") || '{}' );

    pushStore.channels = pushStore.channels || [];
    for ( var channel in pushStore.channels ) {
        pushStore.channels[ channel ].state = "available";
    }
    localStorage.setItem( "ag-push-store", JSON.stringify( pushStore ) );

    // Privileged methods
    /**
        Returns the value of the private settings var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getSettings = function() {
        return settings;
    };

    /**
        Returns the value of the private name var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getName = function() {
        return name;
    };

    /**
        Returns the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getConnectURL = function() {
        return connectURL;
    };

    /**
        Set the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
        @param {String} url - New connectURL for this client
     */
    this.setConnectURL = function( url ) {
        connectURL = url;
    };

    /**
        Returns the value of the private useNative var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getUseNative = function() {
        return useNative;
    };

    /**
        Returns the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getClient = function() {
        return client;
    };

    /**
        Sets the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.setClient = function( newClient ) {
        client = newClient;
    };

    /**
        Returns the value of the private pushStore var
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.getPushStore = function() {
        return pushStore;
    };

    /**
        Sets the value of the private pushStore var as well as the local store
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.setPushStore = function( newStore ) {
        pushStore = newStore;
        localStorage.setItem( "ag-push-store", JSON.stringify( newStore ) );
    };

    /**
        Processes all incoming messages from the SimplePush server
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.processMessage = function( message ) {
        var channel, updates;
        if ( message.messageType === "register" && message.status === 200 ) {
            channel = {
                channelID: message.channelID,
                version: message.version,
                state: "used"
            };
            pushStore.channels = this.updateChannel( pushStore.channels, channel );
            this.setPushStore( pushStore );

            // Send the push endpoint to the client for app registration
            channel.pushEndpoint = message.pushEndpoint;
            console.log(channel.pushEndpoint);

            // Trigger registration success callback
            jQuery( navigator.push ).trigger( jQuery.Event( message.channelID + "-success", {
                target: {
                    result: channel
                }
            }));
        } else if ( message.messageType === "register" ) {
            throw "SimplePushRegistrationError";
        } else if ( message.messageType === "unregister" && message.status === 200 ) {
            pushStore.channels.splice( this.findChannelIndex( pushStore.channels, "channelID", message.channelID ), 1 );
            this.setPushStore( pushStore );
        } else if ( message.messageType === "unregister" ) {
            throw "SimplePushUnregistrationError";
        } else if ( message.messageType === "notification" ) {
            updates = message.updates;

            // Notifications could come in a batch so process all
            for ( var i = 0, updateLength = updates.length; i < updateLength; i++ ) {

                // Trigger the push event which apps will create their listeners to respond to when receiving messages
                jQuery( navigator.push ).trigger( jQuery.Event( "push", {
                    message: updates[ i ]
                }));
            }

            // Acknowledge all updates sent in this notification message
            message.messageType = "ack";
            client.send( JSON.stringify( message ) );
        }
    };

    /**
        Generate the hello message send during the initial handshake with the SimplePush server. Sends any pre-existing channels for reregistration as well
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.generateHello = function() {
        var channels = pushStore.channels,
            msg = {
            messageType: "hello",
            uaid: "",
            channelIDs: []
        };

        if ( pushStore.uaid ) {
            msg.uaid = pushStore.uaid;
        }
        if ( channels && msg.uaid !== "" ) {
            for ( var length = channels.length, i = length - 1; i > -1; i-- ) {
                msg.channelIDs.push( pushStore.channels[ i ].channelID );
            }
        }

        return JSON.stringify( msg );
    };

    // Utility Functions
    /**
        Find the array index of a particular channel based on a particular field value
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.findChannelIndex = function( channels, filterField, filterValue ) {
        for ( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ][ filterField ] === filterValue ) {
                return i;
            }
        }
    };

    /**
        Update a channel with new information
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.updateChannel = function( channels, channel ) {
        for( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ].channelID === channel.channelID ) {
                channels[ i ].version = channel.version;
                channels[ i ].state = channel.state;
                break;
            }
        }

        return channels;
    };

    /**
        Proxies the binding of subscription success handlers
        @private
        @augments AeroGear.Notifier.adapters.SimplePush
     */
    this.bindSubscribeSuccess = function( channelID, request ) {
        jQuery( navigator.push ).off( channelID + "-success" );
        jQuery( navigator.push ).on( channelID + "-success", function( event ) {
            request.onsuccess( event );
        });
    };
};

//Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options] - Options to pass to the connect method
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
    @param {Function} [options.onConnect] - callback to be executed when a connection is established and hello message has been acknowledged
    @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
    @param {Function} [options.onClose] - callback to be executed when a connection to the server is closed
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    // Use all defaults
    SPNotifier.connect();

    // Custom options
    SPNotifier.connect({
        simplePushServerURL: "http://some.other.domain",
        onConnect: spConnect,
        onClose: spClose
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.connect = function( options ) {
    options = options || {};

    var that = this,
        client = this.getUseNative() ? new WebSocket( options.url || this.getConnectURL() ) : new SockJS( options.url || this.getConnectURL() );

    client.onopen = function() {
        // Immediately send hello message
        client.send( that.generateHello() );
    };

    client.onerror = function( error ) {
        if ( options.onConnectError ) {
            options.onConnectError.apply( this, arguments );
        }
    };

    client.onmessage = function( message ) {
        var pushStore = that.getPushStore();
        message = JSON.parse( message.data );

        if ( message.messageType === "hello" ) {
            if ( message.uaid !== pushStore.uaid ) {
                pushStore.uaid = message.uaid;
                that.setPushStore( pushStore );
            }

            if ( options.onConnect ) {
                options.onConnect( message );
            }
        } else {
            that.processMessage( message );
        }
    };

    client.onclose = function() {
        if ( options.onClose ) {
            options.onClose.apply( this, arguments );
        }
    };

    this.setClient( client );
};

/**
    Disconnect the client from the messaging service
    @param {Function} [onDisconnect] - callback to be executed when a connection is terminated
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    // Default
    SPNotifier.disconnect();

    // Pass disconnect callback
    SPNotifier.disconnect(function() {
        console.log("Disconnected");
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.disconnect = function( onDisconnect ) {
    var client = this.getClient();

    client.close();
    if ( onDisconnect ) {
        onDisconnect();
    }
};

/**
    Subscribe this client to a new channel
    @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. At a minimum, each channel should contain a requestObject which will eventually contain the subscription success callback and a callback, which is fired when notifications are received. Reused channels may also contain channelID and other metadata.
    @param {Boolean} [reset] - if true, remove all channels from the set and replace with the supplied channel(s)
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    SPNotifier.subscribe({
        requestObject: {},
        callback: function( message ) {
            console.log("Notification Received");
        }
    });
 */
AeroGear.Notifier.adapters.SimplePush.prototype.subscribe = function( channels, reset ) {
    var index, response, channelID, channelLength,
        processed = false,
        client = this.getClient(),
        pushStore = this.getPushStore();

    if ( reset ) {
        this.unsubscribe( this.getChannels() );
    }

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    pushStore.channels = pushStore.channels || [];
    channelLength = pushStore.channels.length;

    for ( var i = 0; i < channels.length; i++ ) {
        // check for previously registered channels
        if ( channelLength ) {
            index = this.findChannelIndex( pushStore.channels, "state", "available" );
            if ( index !== undefined ) {
                this.bindSubscribeSuccess( pushStore.channels[ index ].channelID, channels[ i ].requestObject );
                channels[ i ].channelID = pushStore.channels[ index ].channelID;
                channels[ i ].state = "used";

                // Trigger the registration event since there will be no register message
                setTimeout((function(channel) {
                    return function() {
                        jQuery( navigator.push ).trigger( jQuery.Event( channel.channelID + "-success", {
                            target: {
                                result: channel
                            }
                        }));
                    };
                })(channels[ i ]), 0);

                pushStore.channels[ index ] = channels[ i ];
                processed = true;
            }
        }

        // No previous channels available so add a new one
        if ( !processed ) {
            channels[ i ].channelID = channels[ i ].channelID || uuid();
            channels[ i ].state = "used";
            this.bindSubscribeSuccess( channels[ i ].channelID, channels[ i ].requestObject );
            client.send('{"messageType": "register", "channelID": "' + channels[ i ].channelID + '"}');

            pushStore.channels.push( channels[ i ] );
        }

        processed = false;
    }

    this.setPushStore( pushStore );
};

/**
    Unsubscribe this client from a channel
    @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
    @example
    var SPNotifier = AeroGear.Notifier({
        name: "sp",
        type: "SimplePush",
        settings: {
            connectURL: "http://localhost:7777/simplepush"
        }
    }).clients.sp;

    SPNotifier.unsubscribe( channelObject );
 */
AeroGear.Notifier.adapters.SimplePush.prototype.unsubscribe = function( channels ) {
    var client = this.getClient();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        client.send( '{"messageType": "unregister", "channelID": "' + channels[ i ].channelID + '"}');
    }
};

/**
    The vertx adapter is the default type used when creating a new notifier client. It uses the vert.x bus and underlying SockJS implementation for messaging.
    @constructs AeroGear.Notifier.adapters.vertx
    @param {String} clientName - the name used to reference this particular notifier client
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {Boolean} [settings.autoConnect=false] - Automatically connect the client to the connectURL on creation. This option is ignored and a connection is automatically established if channels are provided as the connection is necessary prior to channel subscription
    @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
    @param {Function} [settings.onConnect] - callback to be executed when a connection is established if autoConnect === true
    @param {Function} [settings.onDisconnect] - callback to be executed when a connection is terminated if autoConnect === true
    @param {Function} [settings.onConnectError] - callback to be executed when connecting to a service is unsuccessful if autoConnect === true
    @param {Array} [settings.channels=[]] - a set of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
    @returns {Object} The created notifier client
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global",
        callback: channelCallback
    };

    function channelCallback( message ) {
        console.log( message );
    }

    // Add a vertx client with all the settings
    notifier.add({
        name: "client1",
        settings: {
            autoConnect: true,
            connectURL: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onDisconnect: function() {
                console.log( "Disconnected" );
            },
            channels: [ channelObject ]
        }
    });
 */
AeroGear.Notifier.adapters.vertx = function( clientName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier.adapters.vertx ) ) {
        return new AeroGear.Notifier.adapters.vertx( clientName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var type = "vertx",
        name = clientName,
        channels = settings.channels || [],
        autoConnect = !!settings.autoConnect || channels.length,
        connectURL = settings.connectURL || "",
        state = AeroGear.Notifier.CONNECTING,
        bus = null;

    // Privileged methods
    /**
        Returns the value of the private connectURL var
        @private
        @augments vertx
     */
    this.getConnectURL = function() {
        return connectURL;
    };

    /**
        Set the value of the private connectURL var
        @private
        @augments vertx
        @param {String} url - New connectURL for this client
     */
    this.setConnectURL = function( url ) {
        connectURL = url;
    };

    /**
        Returns the value of the private channels var
        @private
        @augments vertx
     */
    this.getChannels = function() {
        return channels;
    };

    /**
        Adds a channel to the set
        @param {Object} channel - The channel object to add to the set
        @private
        @augments vertx
     */
    this.addChannel = function( channel ) {
        channels.push( channel );
    };

    /**
        Check if subscribed to a channel
        @param {String} address - The address of the channel object to search for in the set
        @private
        @augments vertx
     */
    this.getChannelIndex = function( address ) {
        for ( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ].address === address ) {
                return i;
            }
        }
        return -1;
    };

    /**
        Removes a channel from the set
        @param {Object} channel - The channel object to remove from the set
        @private
        @augments vertx
     */
    this.removeChannel = function( channel ) {
        var index = this.getChannelIndex( channel.address );
        if ( index >= 0 ) {
            channels.splice( index, 1 );
        }
    };

    /**
        Returns the value of the private state var
        @private
        @augments vertx
     */
    this.getState = function() {
        return state;
    };

    /**
        Sets the value of the private state var
        @private
        @augments vertx
     */
    this.setState = function( newState ) {
        state = newState;
    };

    /**
        Returns the value of the private bus var
        @private
        @augments vertx
     */
    this.getBus = function() {
        return bus;
    };

    /**
        Sets the value of the private bus var
        @private
        @augments vertx
     */
    this.setBus = function( newBus ) {
        bus = newBus;
    };

    // Handle auto-connect
    if ( autoConnect || channels.length ) {
        this.connect({
            url: connectURL,
            onConnect: settings.onConnect,
            onDisconnect: settings.onDisconnect,
            onConnectError: settings.onConnectError
        });
    }
};

//Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options={}] - Options to pass to the connect method
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
    @param {Function} [options.onConnect] - callback to be executed when a connection is established
    @param {Function} [options.onDisconnect] - callback to be executed when a connection is terminated
    @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Add a vertx client
    notifier.add({
        name: "client1",
        settings: {
            connectURL: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onDisconnect: function() {
                console.log( "Disconnected" );
            }
        }
    });

    // Connect to the vertx messaging service
    notifierVertx.clients.client1.connect();

 */
AeroGear.Notifier.adapters.vertx.prototype.connect = function( options ) {
    options = options || {};
    var that = this,
        bus = new vertx.EventBus( options.url || this.getConnectURL() );

    bus.onopen = function() {
        // Make a Copy of the channel array instead of a reference.
        var channels = that.getChannels().slice( 0 );

        that.setState( AeroGear.Notifier.CONNECTED );

        that.subscribe( channels, true );

        if ( options.onConnect ) {
            options.onConnect.apply( this, arguments );
        }
    };

    bus.onclose = function() {
        if ( that.getState() === AeroGear.Notifier.DISCONNECTING ) {
            // Fire disconnect as usual
            that.setState( AeroGear.Notifier.DISCONNECTED );
            if ( options.onDisconnect ) {
                options.onDisconnect.apply( this, arguments );
            }
        } else {
            // Error connecting so fire error callback
            if ( options.onConnectError ) {
                options.onConnectError.apply( this, arguments );
            }
        }
    };

    this.setBus( bus );
};

/**
    Disconnect the client from the messaging service
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Add a vertx client
    notifier.add({
        name: "client1",
        settings: {
            connectURL: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onDisconnect: function() {
                console.log( "Disconnected" );
            }
        }
    });

    // Connect to the vertx messaging service
    notifierVertx.clients.client1.connect();

    // Disconnect from the vertx messaging service
    notifierVertx.clients.client1.disconnect();

 */
AeroGear.Notifier.adapters.vertx.prototype.disconnect = function() {
    var bus = this.getBus();
    if ( this.getState() === AeroGear.Notifier.CONNECTED ) {
        this.setState( AeroGear.Notifier.DISCONNECTING );
        bus.close();
    }
};

/**
    Subscribe this client to a new channel
    @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
    @param {Boolean} [reset] - if true, remove all channels from the set and replace with the supplied channel(s)
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global",
        callback: channelCallback
    };

    function channelCallback( message ) {
        console.log( message );
    }

    // Add a vertx client with autoConnect === true and no channels
    notifier.add({
        name: "client1",
        settings: {
            autoConnect: true,
            connectURL: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onDisconnect: function() {
                console.log( "Disconnected" );
            }
        }
    });

    //Subscribe to a channel
    notifierVertx.clients.client1.subscribe( channelObject );

    //Subscribe to multiple channels at once
    notifierVertx.clients.client1.subscribe([
        {
            address: "newChannel",
            callback: function(){...}
        },
        {
            address: "anotherChannel",
            callback: function(){ ... }
        }
    ]);

    //Subscribe to a channel, but first unsubscribe from all currently subscribed channels by adding the reset parameter
    notifierVertx.clients.client1.subscribe({
            address: "newChannel",
            callback: function(){ ... }
        }, true );
 */
AeroGear.Notifier.adapters.vertx.prototype.subscribe = function( channels, reset ) {
    var bus = this.getBus();

    if ( reset ) {
        this.unsubscribe( this.getChannels() );
    }

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        this.addChannel( channels[ i ] );
        bus.registerHandler( channels[ i ].address, channels[ i ].callback );
    }
};

/**
    Unsubscribe this client from a channel
    @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
    @example
    // Unsubscribe from a previously subscribed channel
    notifierVertx.clients.client1.unsubscribe(
        {
            address: "org.aerogear.messaging.global",
            callback: channelCallback
        }
    );

    // Unsubscribe from multiple channels
    notifierVertx.clients.client1.unsubscribe([
        {
            address: "newChannel",
            callback: newCallbackFunction
        },
        {
            address: "anotherChannel",
            callback: "anotherChannelCallbackFunction"
        }
    ]);


 */
AeroGear.Notifier.adapters.vertx.prototype.unsubscribe = function( channels ) {
    var bus = this.getBus();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        this.removeChannel( channels[ i ] );
        bus.unregisterHandler( channels[ i ].address, channels[ i ].callback );
    }
};

/**
    Send a message to a particular channel
    @param {String} channel - the channel to which to send the message
    @param {String|Object} [message=""] - the message object to send
    @example
    // Send an empty message to a channel
    notifier.clients.client1.send( "test.address" );

    // Send a "Hello" message to a channel
    notifier.clients.client1.send( "test.address", "Hello" );

    // Send a "Hello" message as an object
    notifier.clients.client1.send( "test.address", { "message": "Hello" } );

 */
AeroGear.Notifier.adapters.vertx.prototype.send = function( channel, message ) {
    var bus = this.getBus();

    message = message || "";

    bus.send( channel, message );
};

/**
    The stomp adapter uses an underlying stomp.js implementation for messaging.
    @constructs AeroGear.Notifier.adapters.stompws
    @param {String} clientName - the name used to reference this particular notifier client
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {Boolean} [settings.autoConnect=false] - Automatically connect the client to the connectURL on creation IF LOGIN IS NOT NEEDED. This option is ignored and a connection is automatically established if channels are provided as the connection is necessary prior to channel subscription
    @param {String} [settings.connectURL=""] - defines the URL for connecting to the messaging service
    @param {Function} [settings.onConnect] - callback to be executed when a connection is established if autoConnect === true
    @param {Function} [settings.onConnectError] - callback to be executed when connecting to a service is unsuccessful if autoConnect === true
    @param {Array} [settings.channels=[]] - a set of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
    @returns {Object} The created notifier client
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global",
        callback: channelCallback
    };

    function channelCallback( message ) {
        console.log( message );
    }

    // Add a stompws client with all the settings that will autoConnect to the server and subscribe to a channel
    notifier.add({
        name: "client1",
        type: "stompws"
        settings: {
            autoConnect: true,
            connectURL: "ws://localhost:61614/stomp",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            channels: [ channelObject ]
        }
    });
 */
AeroGear.Notifier.adapters.stompws = function( clientName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier.adapters.stompws ) ) {
        return new AeroGear.Notifier.adapters.stompws( clientName, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var type = "stompws",
        name = clientName,
        channels = settings.channels || [],
        autoConnect = !!settings.autoConnect || channels.length,
        connectURL = settings.connectURL || "",
        state = AeroGear.Notifier.CONNECTING,
        client = null;

    // Privileged methods
    /**
        Returns the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.getConnectURL = function() {
        return connectURL;
    };

    /**
        Set the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.stompws
        @param {String} url - New connectURL for this client
     */
    this.setConnectURL = function( url ) {
        connectURL = url;
    };

    /**
        Returns the value of the private channels var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.getChannels = function() {
        return channels;
    };

    /**
        Adds a channel to the set
        @param {Object} channel - The channel object to add to the set
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.addChannel = function( channel ) {
        channels.push( channel );
    };


    /**
        Check if subscribed to a channel
        @param {String} address - The address of the channel object to search for in the set
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.getChannelIndex = function( address ) {
        for ( var i = 0; i < channels.length; i++ ) {
            if ( channels[ i ].address === address ) {
                return i;
            }
        }
        return -1;
    };

    /**
        Removes a channel from the set
        @param {Object} channel - The channel object to remove from the set
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.removeChannel = function( channel ) {
        var index = this.getChannelIndex( channel.address );
        if ( index >= 0 ) {
            channels.splice( index, 1 );
        }
    };

    /**
        Returns the value of the private state var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.getState = function() {
        return state;
    };

    /**
        Sets the value of the private state var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.setState = function( newState ) {
        state = newState;
    };

    /**
        Returns the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.getClient = function() {
        return client;
    };

    /**
        Sets the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.stompws
     */
    this.setClient = function( newClient ) {
        client = newClient;
    };

    // Handle auto-connect.
    // If Login or Password are needed, autoConnect won't happen
    if ( ( autoConnect || channels.length ) && ( !settings.login && !settings.password ) ) {
        this.connect({
            url: connectURL,
            onConnect: settings.onConnect,
            onConnectError: settings.onConnectError
        });
    }
};

//Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options={}] - Options to pass to the connect method
    @param {String} [options.login] - login name used to connect to the server
    @param {String} [options.password] - password used to connect to the server
    @param {String|Array} [options.protocol="v11.stomp"] - STOMP protocol to use. Can either be a string with a single protocol or an array of protocol strings
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
    @param {Function} [options.onConnect] - callback to be executed when a connection is established
    @param {Function} [options.onConnectError] - callback to be executed when connecting to a service is unsuccessful
    @param {String} [options.host] - name of a virtual host on the stomp server that the client wishes to connect to
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global",
        callback: channelCallback
    };

    function channelCallback( message ) {
        console.log( message );
    }

    // Add stompws clients
    notifier.add({
        name: "client1",
        type: "stompws"
        settings: {
            connectURL: "ws://localhost:61614/stomp",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            channels: [ channelObject ]
        }
    },
    {
        name: "client2",
        type: "stompws"
        settings: {
            connectURL: "ws://localhost:61614/stomp1",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            }
        }
    });

    // Connect to the Server with login/password
    notifier.clients.client1.connect({
        login: "guest",
        password: "guest"
        onConnect: function() {
            console.log( "connected" );
        },
        onConnectError: function( event ) {
            console.log( "connection error", event );
        }
    });

    // Connect to an unsecured Server
    notifier.clients.client2.connect({
        onConnect: function() {
            console.log( "connected" );
        },
        onConnectError: function( event ) {
            console.log( "connection error", event );
        }
    });
 */
AeroGear.Notifier.adapters.stompws.prototype.connect = function( options ) {
    options = options || {};
    var that = this,
        client = new Stomp.client( options.url || this.getConnectURL(), options.protocol || "v11.stomp" ),
        onConnect = function() {
            // Make a copy of the channel array instead of a reference.
            var channels = that.getChannels().slice( 0 );

            that.setState( AeroGear.Notifier.CONNECTED );

            that.subscribe( channels, true );

            if ( options.onConnect ) {
                options.onConnect.apply( this, arguments );
            }
        },
        onConnectError = function() {
            that.setState( AeroGear.Notifier.DISCONNECTED );
            if ( options.onConnectError ) {
                options.onConnectError.apply( this, arguments );
            }
        };

    client.connect( options.login, options.password, onConnect, onConnectError, options.host );
    this.setClient( client );
};

/**
    Disconnect the client from the messaging service
    @param {Function} [onDisconnect] - callback to be executed when a connection is terminated
    @example
    // Disconnect from the messaging service and pass a function to be called after disconnecting
    notifier.clients.client2.disconnect({
        onDisconnect: function() {
            console.log( "connected" );
        }
    });

 */
AeroGear.Notifier.adapters.stompws.prototype.disconnect = function( onDisconnect ) {
    var that = this,
        client = this.getClient(),
        disconnected = function() {
            if ( that.getState() === AeroGear.Notifier.DISCONNECTING ) {
                // Fire disconnect as usual
                that.setState( AeroGear.Notifier.DISCONNECTED );
                if ( onDisconnect ) {
                    onDisconnect.apply( this, arguments );
                }
            }
        };

    if ( this.getState() === AeroGear.Notifier.CONNECTED ) {
        this.setState( AeroGear.Notifier.DISCONNECTING );
        client.disconnect( disconnected );
    }
};

/**
    Subscribe this client to a new channel
    @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. Each object should have a String address as well as a callback to be executed when a message is received on that channel.
    @param {Boolean} [reset] - if true, remove all channels from the set and replace with the supplied channel(s)
    @example
    // Subscribe to a channel
    notifier.clients.client2.subscribe({
        address: "channelAddress",
        callback: function(){ ... }
    });

    //Subscribe to multiple channels
    notifier.clients.client2.subscribe([
        {
            address: "channelAddress1",
            callback: function(){ ... }
        },
        {
            address: "channelAddress2",
            callback: function(){ ... }
        },
    ]);

    // Subscribe to a channel, but first unsubscribe from all currently subscribed channels by adding the reset parameter
    notifier.clients.client2.subscribe({
        address: "channelAddress3",
        callback: function(){ ... }
    }, true );

 */
AeroGear.Notifier.adapters.stompws.prototype.subscribe = function( channels, reset ) {
    var client = this.getClient();

    if ( reset ) {
        this.unsubscribe( this.getChannels() );
    }

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        channels[ i ].id = client.subscribe( channels[ i ].address, channels[ i ].callback );
        this.addChannel( channels[ i ] );
    }
};

/**
    Unsubscribe this client from a channel
    @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe
    @example
    // Unsubscribe from a channel
    notifier.clients.client2.unsubscribe({
        address: "channelAddress",
        callback: function(){ ... }
    });

    //Unsubscribe from multiple channels
    notifier.clients.client2.unsubscribe([
        {
            address: "channelAddress1",
            callback: function(){ ... }
        },
        {
            address: "channelAddress2",
            callback: function(){ ... }
        },
    ]);
 */
AeroGear.Notifier.adapters.stompws.prototype.unsubscribe = function( channels ) {
    var client = this.getClient();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        client.unsubscribe( channels[ i ].id );
        this.removeChannel( channels[ i ] );
    }
};

/**
    Send a message to a particular channel
    @param {String} channel - the channel to which to send the message
    @param {String|Object} [message=""] - the message object to send
    @example
    // Send an empty message to a channel
    notifier.clients.client2.send( "jms.topic.chat" );

    // Send a "Hello" message to a channel
    notifier.clients.client2.send( "jms.topic.chat", "Hello" );

    // Send a "Hello" message as an object,  requires headers( can just be an empty object )
    notifier.clients.client2.send( "jms.topic.chat", { "headers": {}, "body": "Hello" } );

    // Send a "Hello" message as an object,  with non empty headers
    notifier.clients.client2.send( "jms.topic.chat", { "headers": { priority: 9 }, "body": "Hello" } );

 */
AeroGear.Notifier.adapters.stompws.prototype.send = function( channel, message ) {
    var headers = {},
        client = this.getClient();

    message = message || "";
    if ( message.headers ) {
        headers = message.headers;
        message = message.body;
    }

    client.send( channel, headers, message );
};
})( this );
