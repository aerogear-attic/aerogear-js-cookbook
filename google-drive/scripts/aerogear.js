/*! AeroGear JavaScript Library - v1.4.0-dev - 2014-03-03
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
        this[ this.collectionName ] = collection;

        if ( !config ) {
            return this;
        } else if ( typeof config === "string" ) {
            // config is a string so use default adapter type
            collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config, this.config );
        } else if ( AeroGear.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current, this.config );
                } else {
                    if( current.name ) {

                        // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
                        current.settings = AeroGear.extend( current.settings || {}, this.config );

                        collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
                    }
                }
            }
        } else {
            if( !config.name ) {
                return this;
            }

            // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
            // config is an object so use that signature
            config.settings = AeroGear.extend( config.settings || {}, this.config );

            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
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
    Utility function to merge 2 Objects together.
    @private
    @method
    @param {Object} obj1 - An Object to be merged.
    @param {Object} obj2 - An Object to be merged.  This Objects Value takes precendence.
*/
AeroGear.extend = function( obj1, obj2 ) {
    var name;
    for( name in obj2 ) {
        obj1[ name ] = obj2[ name ];
    }
    return obj1;
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
    This callback is executed when an HTTP progress message is returned during a request.
    @callback AeroGear~progressCallbackREST
    @param {Object} XMLHttpRequestProgressEvent - The progress event
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

"use strict";var r=void 0,t=!0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!=typeof module&&module.exports&&(module.exports=sjcl);
sjcl.cipher.aes=function(a){this.n[0][0][0]||this.K();var b,c,d,e,f=this.n[0][4],g=this.n[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl.exception.invalid("invalid aes key size");this.c=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return w(this,a,0)},decrypt:function(a){return w(this,a,1)},n:[[[],[],[],[],[]],[[],[],[],[],[]]],K:function(){var a=this.n[0],b=this.n[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,p,n,m;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){n=g^g<<1^g<<2^g<<3^g<<4;n=n>>8^n&255^99;c[f]=n;d[n]=f;p=h[e=h[k=h[f]]];m=0x1010101*p^0x10001*e^0x101*k^0x1010100*f;p=0x101*h[n]^0x1010100*n;for(e=0;4>e;e++)a[e][f]=p=p<<24^p>>>8,b[e][n]=m=m<<24^m>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function w(a,b,c){if(4!==b.length)throw new sjcl.exception.invalid("invalid aes block size");var d=a.c[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,p=d.length/4-2,n,m=4,s=[0,0,0,0];h=a.n[c];a=h[0];var q=h[1],v=h[2],x=h[3],y=h[4];for(n=0;n<p;n++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^x[b&255]^d[m],l=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^x[e&255]^d[m+1],k=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^x[f&255]^d[m+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^x[g&255]^d[m+3],m+=4,e=h,f=l,g=k;for(n=
0;4>n;n++)s[c?3&-n:n]=y[e>>>24]<<24^y[f>>16&255]<<16^y[g>>8&255]<<8^y[b&255]^d[m++],h=e,e=f,f=g,g=b,b=h;return s}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.U(a.slice(b/32),32-(b&31)).slice(1);return c===r?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.U(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},U:function(a,b,c,d){var e;e=0;for(d===r&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},ba:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};sjcl.hash.sha256=function(a){this.c[0]||this.K();a?(this.u=a.u.slice(0),this.p=a.p.slice(0),this.k=a.k):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.u=this.R.slice(0);this.p=[];this.k=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.p=sjcl.bitArray.concat(this.p,a);b=this.k;a=this.k=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)z(this,c.splice(0,16));return this},finalize:function(){var a,b=this.p,c=this.u,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.k/
4294967296));for(b.push(this.k|0);b.length;)z(this,b.splice(0,16));this.reset();return c},R:[],c:[],K:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.R[b]=a(Math.pow(c,0.5)));this.c[b]=a(Math.pow(c,1/3));b++}}};
function z(a,b){var c,d,e,f=b.slice(0),g=a.u,h=a.c,l=g[0],k=g[1],p=g[2],n=g[3],m=g[4],s=g[5],q=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(q^m&(s^q))+h[c],v=q,q=s,s=m,m=n+d|0,n=p,p=k,k=l,l=d+(k&p^n&(k^p))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+p|0;g[3]=g[3]+n|0;g[4]=g[4]+m|0;g[5]=g[5]+s|0;g[6]=
g[6]+q|0;g[7]=g[7]+v|0}
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.O(t,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.O(u,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return a.data},aa:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.ba;e=[0,0,0,
0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.aa(b,a);return b},O:function(a,b,c,d,e,f){var g,h,l,k,p,n,m,s,q=sjcl.bitArray;n=c.length;m=q.bitLength(c);s=q.bitLength(d);h=q.bitLength(e);
g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl.mode.gcm.j(g,[0,0,0,0],e),e=sjcl.mode.gcm.j(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.j(g,[0,0,0,0],d);p=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.j(g,h,c));for(k=0;k<n;k+=4)p[3]++,l=b.encrypt(p),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=q.clamp(c,m);a&&(d=sjcl.mode.gcm.j(g,h,c));a=[Math.floor(s/0x100000000),s&0xffffffff,Math.floor(m/0x100000000),m&0xffffffff];d=sjcl.mode.gcm.j(g,d,a);l=b.encrypt(e);
d[0]^=l[0];d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.Q=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.q=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.q[0].update(c[0]);this.q[1].update(c[1])};sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){a=(new this.Q(this.q[0])).update(a).finalize();return(new this.Q(this.q[1])).update(a).finalize()};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;if(0>d||0>c)throw sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],p=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(p.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=p.clamp(k,d));return k};
sjcl.prng=function(a){this.e=[new sjcl.hash.sha256];this.l=[0];this.L=0;this.B={};this.J=0;this.N={};this.T=this.g=this.m=this.$=0;this.c=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.H=r;this.I=a;this.s=u;this.F={progress:{},seeded:{}};this.o=this.Z=0;this.C=1;this.D=2;this.X=0x10000;this.M=[0,48,64,96,128,192,0x100,384,512,768,1024];this.Y=3E4;this.W=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.o)throw new sjcl.exception.notReady("generator isn't seeded");if(d&this.D){d=!(d&this.C);e=[];var f=0,g;this.T=e[0]=(new Date).valueOf()+this.Y;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.e.length&&!(e=e.concat(this.e[g].finalize()),f+=this.l[g],this.l[g]=0,!d&&this.L&1<<g);g++);this.L>=1<<this.e.length&&(this.e.push(new sjcl.hash.sha256),this.l.push(0));this.g-=f;f>this.m&&(this.m=
f);this.L++;this.c=sjcl.hash.sha256.hash(this.c.concat(e));this.H=new sjcl.cipher.aes(this.c);for(d=0;4>d&&!(this.h[d]=this.h[d]+1|0,this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.X&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a){this.I=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),g=this.B[c],h=this.isReady(),l=0;d=this.N[c];d===r&&(d=this.N[c]=this.$++);g===r&&(g=this.B[c]=0);this.B[c]=(this.B[c]+1)%this.e.length;
switch(typeof a){case "number":b===r&&(b=1);this.e[g].update([d,this.J++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!=typeof a[c]&&(l=1)}if(!l){if(b===r)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e>>>=1;this.e[g].update([d,this.J++,2,b,f,a.length].concat(a))}break;case "string":b===r&&(b=a.length);this.e[g].update([d,this.J++,
3,b,f,a.length]);this.e[g].update(a);break;default:l=1}if(l)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.l[g]+=b;this.g+=b;h===this.o&&(this.isReady()!==this.o&&C("seeded",Math.max(this.m,this.g)),C("progress",this.getProgress()))},isReady:function(a){a=this.M[a!==r?a:this.I];return this.m&&this.m>=a?this.l[0]>this.W&&(new Date).valueOf()>this.T?this.D|this.C:this.C:this.g>=a?this.D|this.o:this.o},getProgress:function(a){a=this.M[a?a:this.I];
return this.m>=a?1:this.g>a?1:this.g/a},startCollectors:function(){if(!this.s){if(window.addEventListener)window.addEventListener("load",this.v,u),window.addEventListener("mousemove",this.w,u);else if(document.attachEvent)document.attachEvent("onload",this.v),document.attachEvent("onmousemove",this.w);else throw new sjcl.exception.bug("can't attach event");this.s=t}},stopCollectors:function(){this.s&&(window.removeEventListener?(window.removeEventListener("load",this.v,u),window.removeEventListener("mousemove",
this.w,u)):window.detachEvent&&(window.detachEvent("onload",this.v),window.detachEvent("onmousemove",this.w)),this.s=u)},addEventListener:function(a,b){this.F[a][this.Z++]=b},removeEventListener:function(a,b){var c,d,e=this.F[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},w:function(a){sjcl.random.addEntropy([a.x||a.clientX||a.offsetX||0,a.y||a.clientY||a.offsetY||0],2,"mouse")},v:function(){sjcl.random.addEntropy((new Date).valueOf(),2,"loadtime")}};
function C(a,b){var c,d=sjcl.random.F[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function A(a){a.c=B(a).concat(B(a));a.H=new sjcl.cipher.aes(a.c)}function B(a){for(var b=0;4>b&&!(a.h[b]=a.h[b]+1|0,a.h[b]);b++);return a.H.encrypt(a.h)}sjcl.random=new sjcl.prng(6);
try{if("undefined"!==typeof module&&module.exports){var D=require("crypto").randomBytes(128);sjcl.random.addEntropy(D,1024,"crypto['randomBytes']")}else if(window&&window.crypto&&window.crypto.getRandomValues){var E=new Uint32Array(32);window.crypto.getRandomValues(E);sjcl.random.addEntropy(E,1024,"crypto['getRandomValues']")}}catch(F){}sjcl.bn=function(a){this.initWith(a)};
sjcl.bn.prototype={radix:24,maxMul:8,d:sjcl.bn,copy:function(){return new this.d(this)},initWith:function(a){var b=0,c;switch(typeof a){case "object":this.limbs=a.limbs.slice(0);break;case "number":this.limbs=[a];this.normalize();break;case "string":a=a.replace(/^0x/,"");this.limbs=[];c=this.radix/4;for(b=0;b<a.length;b+=c)this.limbs.push(parseInt(a.substring(Math.max(a.length-b-c,0),a.length-b),16));break;default:this.limbs=[0]}return this},equals:function(a){"number"===typeof a&&(a=new this.d(a));
var b=0,c;this.fullReduce();a.fullReduce();for(c=0;c<this.limbs.length||c<a.limbs.length;c++)b|=this.getLimb(c)^a.getLimb(c);return 0===b},getLimb:function(a){return a>=this.limbs.length?0:this.limbs[a]},greaterEquals:function(a){"number"===typeof a&&(a=new this.d(a));var b=0,c=0,d,e,f;for(d=Math.max(this.limbs.length,a.limbs.length)-1;0<=d;d--)e=this.getLimb(d),f=a.getLimb(d),c|=f-e&~b,b|=e-f&~c;return(c|~b)>>>31},toString:function(){this.fullReduce();var a="",b,c,d=this.limbs;for(b=0;b<this.limbs.length;b++){for(c=
d[b].toString(16);b<this.limbs.length-1&&6>c.length;)c="0"+c;a=c+a}return"0x"+a},addM:function(a){"object"!==typeof a&&(a=new this.d(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]+=c[a];return this},doubleM:function(){var a,b=0,c,d=this.radix,e=this.radixMask,f=this.limbs;for(a=0;a<f.length;a++)c=f[a],c=c+c+b,f[a]=c&e,b=c>>d;b&&f.push(b);return this},halveM:function(){var a,b=0,c,d=this.radix,e=this.limbs;for(a=e.length-1;0<=a;a--)c=e[a],e[a]=c+b>>
1,b=(c&1)<<d;e[e.length-1]||e.pop();return this},subM:function(a){"object"!==typeof a&&(a=new this.d(a));var b=this.limbs,c=a.limbs;for(a=b.length;a<c.length;a++)b[a]=0;for(a=0;a<c.length;a++)b[a]-=c[a];return this},mod:function(a){var b=!this.greaterEquals(new sjcl.bn(0));a=(new sjcl.bn(a)).normalize();var c=(new sjcl.bn(this)).normalize(),d=0;for(b&&(c=(new sjcl.bn(0)).subM(c).normalize());c.greaterEquals(a);d++)a.doubleM();for(b&&(c=a.sub(c).normalize());0<d;d--)a.halveM(),c.greaterEquals(a)&&
c.subM(a).normalize();return c.trim()},inverseMod:function(a){var b=new sjcl.bn(1),c=new sjcl.bn(0),d=new sjcl.bn(this),e=new sjcl.bn(a),f,g=1;if(!(a.limbs[0]&1))throw new sjcl.exception.invalid("inverseMod: p must be odd");do{d.limbs[0]&1&&(d.greaterEquals(e)||(f=d,d=e,e=f,f=b,b=c,c=f),d.subM(e),d.normalize(),b.greaterEquals(c)||b.addM(a),b.subM(c));d.halveM();b.limbs[0]&1&&b.addM(a);b.normalize();b.halveM();for(f=g=0;f<d.limbs.length;f++)g|=d.limbs[f]}while(g);if(!e.equals(1))throw new sjcl.exception.invalid("inverseMod: p and x must be relatively prime");
return c},add:function(a){return this.copy().addM(a)},sub:function(a){return this.copy().subM(a)},mul:function(a){"number"===typeof a&&(a=new this.d(a));var b,c=this.limbs,d=a.limbs,e=c.length,f=d.length,g=new this.d,h=g.limbs,l,k=this.maxMul;for(b=0;b<this.limbs.length+a.limbs.length+1;b++)h[b]=0;for(b=0;b<e;b++){l=c[b];for(a=0;a<f;a++)h[b+a]+=l*d[a];--k||(k=this.maxMul,g.cnormalize())}return g.cnormalize().reduce()},square:function(){return this.mul(this)},power:function(a){"number"===typeof a?
a=[a]:a.limbs!==r&&(a=a.normalize().limbs);var b,c,d=new this.d(1),e=this;for(b=0;b<a.length;b++)for(c=0;c<this.radix;c++)a[b]&1<<c&&(d=d.mul(e)),e=e.square();return d},mulmod:function(a,b){return this.mod(b).mul(a.mod(b)).mod(b)},powermod:function(a,b){for(var c=new sjcl.bn(1),d=new sjcl.bn(this),e=new sjcl.bn(a);;){e.limbs[0]&1&&(c=c.mulmod(d,b));e.halveM();if(e.equals(0))break;d=d.mulmod(d,b)}return c.normalize().reduce()},trim:function(){var a=this.limbs,b;do b=a.pop();while(a.length&&0===b);
a.push(b);return this},reduce:function(){return this},fullReduce:function(){return this.normalize()},normalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f||0!==a&&-1!==a;b++)a=(e[b]||0)+a,d=e[b]=a&g,a=(a-d)*c;-1===a&&(e[b-1]-=this.placeVal);return this},cnormalize:function(){var a=0,b,c=this.ipv,d,e=this.limbs,f=e.length,g=this.radixMask;for(b=0;b<f-1;b++)a=e[b]+a,d=e[b]=a&g,a=(a-d)*c;e[b]+=a;return this},toBits:function(a){this.fullReduce();a=a||this.exponent||
this.bitLength();var b=Math.floor((a-1)/24),c=sjcl.bitArray,d=[c.partial((a+7&-8)%this.radix||this.radix,this.getLimb(b))];for(b--;0<=b;b--)d=c.concat(d,[c.partial(Math.min(this.radix,a),this.getLimb(b))]),a-=this.radix;return d},bitLength:function(){this.fullReduce();for(var a=this.radix*(this.limbs.length-1),b=this.limbs[this.limbs.length-1];b;b>>>=1)a++;return a+7&-8}};
sjcl.bn.fromBits=function(a){var b=new this,c=[],d=sjcl.bitArray,e=this.prototype,f=Math.min(this.bitLength||0x100000000,d.bitLength(a)),g=f%e.radix||e.radix;for(c[0]=d.extract(a,0,g);g<f;g+=e.radix)c.unshift(d.extract(a,g,e.radix));b.limbs=c;return b};sjcl.bn.prototype.ipv=1/(sjcl.bn.prototype.placeVal=Math.pow(2,sjcl.bn.prototype.radix));sjcl.bn.prototype.radixMask=(1<<sjcl.bn.prototype.radix)-1;
sjcl.bn.pseudoMersennePrime=function(a,b){function c(a){this.initWith(a)}var d=c.prototype=new sjcl.bn,e,f;e=d.modOffset=Math.ceil(f=a/d.radix);d.exponent=a;d.offset=[];d.factor=[];d.minOffset=e;d.fullMask=0;d.fullOffset=[];d.fullFactor=[];d.modulus=c.modulus=new sjcl.bn(Math.pow(2,a));d.fullMask=0|-Math.pow(2,a%d.radix);for(e=0;e<b.length;e++)d.offset[e]=Math.floor(b[e][0]/d.radix-f),d.fullOffset[e]=Math.ceil(b[e][0]/d.radix-f),d.factor[e]=b[e][1]*Math.pow(0.5,a-b[e][0]+d.offset[e]*d.radix),d.fullFactor[e]=
b[e][1]*Math.pow(0.5,a-b[e][0]+d.fullOffset[e]*d.radix),d.modulus.addM(new sjcl.bn(Math.pow(2,b[e][0])*b[e][1])),d.minOffset=Math.min(d.minOffset,-d.offset[e]);d.d=c;d.modulus.cnormalize();d.reduce=function(){var a,b,c,d=this.modOffset,e=this.limbs,f=this.offset,m=this.offset.length,s=this.factor,q;for(a=this.minOffset;e.length>d;){c=e.pop();q=e.length;for(b=0;b<m;b++)e[q+f[b]]-=s[b]*c;a--;a||(e.push(0),this.cnormalize(),a=this.minOffset)}this.cnormalize();return this};d.V=-1===d.fullMask?d.reduce:
function(){var a=this.limbs,b=a.length-1,c,d;this.reduce();if(b===this.modOffset-1){d=a[b]&this.fullMask;a[b]-=d;for(c=0;c<this.fullOffset.length;c++)a[b+this.fullOffset[c]]-=this.fullFactor[c]*d;this.normalize()}};d.fullReduce=function(){var a,b;this.V();this.addM(this.modulus);this.addM(this.modulus);this.normalize();this.V();for(b=this.limbs.length;b<this.modOffset;b++)this.limbs[b]=0;a=this.greaterEquals(this.modulus);for(b=0;b<this.limbs.length;b++)this.limbs[b]-=this.modulus.limbs[b]*a;this.cnormalize();
return this};d.inverse=function(){return this.power(this.modulus.sub(2))};c.fromBits=sjcl.bn.fromBits;return c};var G=sjcl.bn.pseudoMersennePrime;
sjcl.bn.prime={p127:G(127,[[0,-1]]),p25519:G(255,[[0,-19]]),p192k:G(192,[[32,-1],[12,-1],[8,-1],[7,-1],[6,-1],[3,-1],[0,-1]]),p224k:G(224,[[32,-1],[12,-1],[11,-1],[9,-1],[7,-1],[4,-1],[1,-1],[0,-1]]),p256k:G(0x100,[[32,-1],[9,-1],[8,-1],[7,-1],[6,-1],[4,-1],[0,-1]]),p192:G(192,[[0,-1],[64,-1]]),p224:G(224,[[0,1],[96,-1]]),p256:G(0x100,[[0,-1],[96,1],[192,1],[224,-1]]),p384:G(384,[[0,-1],[32,1],[96,-1],[128,-1]]),p521:G(521,[[0,-1]])};
sjcl.bn.random=function(a,b){"object"!==typeof a&&(a=new sjcl.bn(a));for(var c,d,e=a.limbs.length,f=a.limbs[e-1]+1,g=new sjcl.bn;;){do c=sjcl.random.randomWords(e,b),0>c[e-1]&&(c[e-1]+=0x100000000);while(Math.floor(c[e-1]/f)===Math.floor(0x100000000/f));c[e-1]%=f;for(d=0;d<e-1;d++)c[d]&=a.radixMask;g.limbs=c;if(!g.greaterEquals(a))return g}};sjcl.ecc={};sjcl.ecc.point=function(a,b,c){b===r?this.isIdentity=t:(this.x=b,this.y=c,this.isIdentity=u);this.curve=a};
sjcl.ecc.point.prototype={toJac:function(){return new sjcl.ecc.pointJac(this.curve,this.x,this.y,new this.curve.field(1))},mult:function(a){return this.toJac().mult(a,this).toAffine()},mult2:function(a,b,c){return this.toJac().mult2(a,this,b,c).toAffine()},multiples:function(){var a,b,c;if(this.S===r){c=this.toJac().doubl();a=this.S=[new sjcl.ecc.point(this.curve),this,c.toAffine()];for(b=3;16>b;b++)c=c.add(this),a.push(c.toAffine())}return this.S},isValid:function(){return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))))},
toBits:function(){return sjcl.bitArray.concat(this.x.toBits(),this.y.toBits())}};sjcl.ecc.pointJac=function(a,b,c,d){b===r?this.isIdentity=t:(this.x=b,this.y=c,this.z=d,this.isIdentity=u);this.curve=a};
sjcl.ecc.pointJac.prototype={add:function(a){var b,c,d,e;if(this.curve!==a.curve)throw"sjcl['ecc']['add'](): Points must be on the same curve to add them!";if(this.isIdentity)return a.toJac();if(a.isIdentity)return this;b=this.z.square();c=a.x.mul(b).subM(this.x);if(c.equals(0))return this.y.equals(a.y.mul(b.mul(this.z)))?this.doubl():new sjcl.ecc.pointJac(this.curve);b=a.y.mul(b.mul(this.z)).subM(this.y);d=c.square();a=b.square();e=c.square().mul(c).addM(this.x.add(this.x).mul(d));a=a.subM(e);b=
this.x.mul(d).subM(a).mul(b);d=this.y.mul(c.square().mul(c));b=b.subM(d);c=this.z.mul(c);return new sjcl.ecc.pointJac(this.curve,a,b,c)},doubl:function(){if(this.isIdentity)return this;var a=this.y.square(),b=a.mul(this.x.mul(4)),c=a.square().mul(8),a=this.z.square(),d=this.curve.a.toString()==(new sjcl.bn(-3)).toString()?this.x.sub(a).mul(3).mul(this.x.add(a)):this.x.square().mul(3).add(a.square().mul(this.curve.a)),a=d.square().subM(b).subM(b),b=b.sub(a).mul(d).subM(c),c=this.y.add(this.y).mul(this.z);
return new sjcl.ecc.pointJac(this.curve,a,b,c)},toAffine:function(){if(this.isIdentity||this.z.equals(0))return new sjcl.ecc.point(this.curve);var a=this.z.inverse(),b=a.square();return new sjcl.ecc.point(this.curve,this.x.mul(b).fullReduce(),this.y.mul(b.mul(a)).fullReduce())},mult:function(a,b){"number"===typeof a?a=[a]:a.limbs!==r&&(a=a.normalize().limbs);var c,d,e=(new sjcl.ecc.point(this.curve)).toJac(),f=b.multiples();for(c=a.length-1;0<=c;c--)for(d=sjcl.bn.prototype.radix-4;0<=d;d-=4)e=e.doubl().doubl().doubl().doubl().add(f[a[c]>>
d&15]);return e},mult2:function(a,b,c,d){"number"===typeof a?a=[a]:a.limbs!==r&&(a=a.normalize().limbs);"number"===typeof c?c=[c]:c.limbs!==r&&(c=c.normalize().limbs);var e,f=(new sjcl.ecc.point(this.curve)).toJac();b=b.multiples();var g=d.multiples(),h,l;for(d=Math.max(a.length,c.length)-1;0<=d;d--){h=a[d]|0;l=c[d]|0;for(e=sjcl.bn.prototype.radix-4;0<=e;e-=4)f=f.doubl().doubl().doubl().doubl().add(b[h>>e&15]).add(g[l>>e&15])}return f},isValid:function(){var a=this.z.square(),b=a.square(),a=b.mul(a);
return this.y.square().equals(this.curve.b.mul(a).add(this.x.mul(this.curve.a.mul(b).add(this.x.square()))))}};sjcl.ecc.curve=function(a,b,c,d,e,f){this.field=a;this.r=new sjcl.bn(b);this.a=new a(c);this.b=new a(d);this.G=new sjcl.ecc.point(this,new a(e),new a(f))};
sjcl.ecc.curve.prototype.fromBits=function(a){var b=sjcl.bitArray,c=this.field.prototype.exponent+7&-8;a=new sjcl.ecc.point(this,this.field.fromBits(b.bitSlice(a,0,c)),this.field.fromBits(b.bitSlice(a,c,2*c)));if(!a.isValid())throw new sjcl.exception.corrupt("not on the curve!");return a};
sjcl.ecc.curves={c192:new sjcl.ecc.curve(sjcl.bn.prime.p192,"0xffffffffffffffffffffffff99def836146bc9b1b4d22831",-3,"0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1","0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012","0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),c224:new sjcl.ecc.curve(sjcl.bn.prime.p224,"0xffffffffffffffffffffffffffff16a2e0b8f03e13dd29455c5c2a3d",-3,"0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4","0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21",
"0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),c256:new sjcl.ecc.curve(sjcl.bn.prime.p256,"0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",-3,"0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b","0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296","0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),c384:new sjcl.ecc.curve(sjcl.bn.prime.p384,"0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973",
-3,"0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef","0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7","0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"),k192:new sjcl.ecc.curve(sjcl.bn.prime.p192k,"0xfffffffffffffffffffffffe26f2fc170f69466a74defd8d",0,3,"0xdb4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d","0x9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"),
k224:new sjcl.ecc.curve(sjcl.bn.prime.p224k,"0x010000000000000000000000000001dce8d2ec6184caf0a971769fb1f7",0,5,"0xa1455b334df099df30fc28a169a467e9e47075a90f7e650eb6b7a45c","0x7e089fed7fba344282cafbd6f7e319f7c0b0bd59e2ca4bdb556d61a5"),k256:new sjcl.ecc.curve(sjcl.bn.prime.p256k,"0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",0,7,"0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798","0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")};
sjcl.ecc.P=function(a){sjcl.ecc[a]={publicKey:function(a,c){this.f=a;this.i=a.r.bitLength();this.A=c instanceof Array?a.fromBits(c):c;this.get=function(){var a=this.A.toBits(),b=sjcl.bitArray.bitLength(a),c=sjcl.bitArray.bitSlice(a,0,b/2),a=sjcl.bitArray.bitSlice(a,b/2);return{x:c,y:a}}},secretKey:function(a,c){this.f=a;this.i=a.r.bitLength();this.t=c;this.get=function(){return this.t.toBits()}},generateKeys:function(b,c,d){b===r&&(b=0x100);if("number"===typeof b&&(b=sjcl.ecc.curves["c"+b],b===r))throw new sjcl.exception.invalid("no such curve");
d===r&&(d=sjcl.bn.random(b.r,c));c=b.G.mult(d);return{pub:new sjcl.ecc[a].publicKey(b,c),sec:new sjcl.ecc[a].secretKey(b,d)}}}};sjcl.ecc.P("elGamal");sjcl.ecc.elGamal.publicKey.prototype={kem:function(a){a=sjcl.bn.random(this.f.r,a);var b=this.f.G.mult(a).toBits();return{key:sjcl.hash.sha256.hash(this.A.mult(a).toBits()),tag:b}}};sjcl.ecc.elGamal.secretKey.prototype={unkem:function(a){return sjcl.hash.sha256.hash(this.f.fromBits(a).mult(this.t).toBits())},dh:function(a){return sjcl.hash.sha256.hash(a.A.mult(this.t).toBits())}};
sjcl.ecc.P("ecdsa");sjcl.ecc.ecdsa.secretKey.prototype={sign:function(a,b,c,d){sjcl.bitArray.bitLength(a)>this.i&&(a=sjcl.bitArray.clamp(a,this.i));var e=this.f.r,f=e.bitLength();d=d||sjcl.bn.random(e.sub(1),b).add(1);b=this.f.G.mult(d).x.mod(e);a=sjcl.bn.fromBits(a).add(b.mul(this.t));c=c?a.inverseMod(e).mul(d).mod(e):a.mul(d.inverseMod(e)).mod(e);return sjcl.bitArray.concat(b.toBits(f),c.toBits(f))}};
sjcl.ecc.ecdsa.publicKey.prototype={verify:function(a,b,c){sjcl.bitArray.bitLength(a)>this.i&&(a=sjcl.bitArray.clamp(a,this.i));var d=sjcl.bitArray,e=this.f.r,f=this.i,g=sjcl.bn.fromBits(d.bitSlice(b,0,f)),d=sjcl.bn.fromBits(d.bitSlice(b,f,2*f)),h=c?d:d.inverseMod(e),f=sjcl.bn.fromBits(a).mul(h).mod(e),h=g.mul(h).mod(e),f=this.f.G.mult2(f,h,this.A).x;if(g.equals(0)||d.equals(0)||g.greaterEquals(e)||d.greaterEquals(e)||!f.equals(g)){if(c===r)return this.verify(a,b,t);throw new sjcl.exception.corrupt("signature didn't check out");
}return t}};

/**
    The AeroGear.Pipeline provides a persistence API that is protocol agnostic and does not depend on any certain data model. Through the use of adapters, this library provides common methods like read, save and delete that will just work.
    @status Stable
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the pipe(s) being created along with the Pipeline. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the pipe will later be referenced by
    @param {String} [config.type="Rest"] - the type of pipe as determined by the adapter used
    @param {Object} [config.authenticator=null] - the AeroGear.auth object used to pass credentials to a secure endpoint
    @param {Object} [settings.authorizer=null] - the AeroGear.authz object used to pass credentials to a secure endpoint
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {Object} pipeline - The created Pipeline containing any pipes that may have been created
    @example
// Create an empty Pipeline
var pl = AeroGear.Pipeline();

// Create a single pipe using the default adapter
var pl2 = AeroGear.Pipeline( "tasks" );

// Create multiple pipes using the default adapter
var pl3 = AeroGear.Pipeline( [ "tasks", "projects" ] );

// Create a new REST pipe with a custom ID using an object
var pl4 = AeroGear.Pipeline({
    name: "customPipe",
    type: "rest",
    settings: {
        recordId: "CustomID"
    }
});

// Create multiple REST pipes using objects
var pl5 = AeroGear.Pipeline([
    {
        name: "customPipe",
        type: "rest",
        settings: {
            recordId: "CustomID"
        }
    },
    {
        name: "customPipe2",
        type: "rest",
        settings: {
            recordId: "CustomID"
        }
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

    // Save a reference to the Pipeline Config
    this.config = config || {};

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
    @status Stable
    @constructs AeroGear.Pipeline.adapters.Rest
    @param {String} pipeName - the name used to reference this particular pipe
    @param {Object} [settings={}] - the settings to be passed to the adapter
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
    @param {Object} [settings.xhrFields] - specify extra xhr options, like the withCredentials flag
    @returns {Object} The created pipe
    @example
    // Create an empty pipeline
    var pipeline = AeroGear.Pipeline();

    // Add a new Pipe with a custom baseURL, custom endpoint and default paging turned on
    pipeline.add( "customPipe", {
        baseURL: "http://customURL.com",
        endpoint: "customendpoint",
        pageConfig: true
    });

    // Add a new Pipe with a custom paging options
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
            dataType: settings.dataType || "json",
            xhrFields: settings.xhrFields
        },
        recordId = settings.recordId || "id",
        authorizer = settings.authorizer || null,
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
    this.getAuthorizer = function() {
        return authorizer;
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
// JSONP - Default JSONP call to a JSONP server
myPipe.read({
    jsonp: true,
    success: function( data ){
        .....
    }
});

// JSONP - JSONP call with a changed callback parameter
myPipe.read({
    jsonp: {
        callback: "jsonp"
    },
    success: function( data ){
        .....
    }
});

    @example
// Paging - using the default weblinking protocal
var defaultPagingPipe = AeroGear.Pipeline([{
    name: "webLinking",
    settings: {
        endpoint: "pageTestWebLink",
        pageConfig: true
    }
}]).pipes[0];

// Get a limit of 2 pieces of data from the server, starting from the first page
// Calling the "next" function will get the next 2 pieces of data, if available.
// Similarily, calling the "previous" function will get the previous 2 pieces of data, if available
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

// Create a new Pipe with a custom paging options
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

// Even with custom options, you use "next" and "previous" the same way
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

    if( !this.getAuthorizer() ) {
        return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
    } else {
        return this.getAuthorizer().execute( jQuery.extend( {}, options, extraOptions ) );
    }
};

/**
    Save data asynchronously to the server. If this is a new object (doesn't have a record identifier provided by the server), the data is created on the server (POST) and then that record is sent back to the client including the new server-assigned id, otherwise, the data on the server is updated (PUT).
    @param {Object} data - For new data, this will be an object representing the data to be saved to the server. For updating data, a hash of key/value pairs one of which must be the `recordId` you set during creation of the pipe representing the identifier the server will use to update this record and then any other number of pairs representing the data. The data object is then stringified and passed to the server to be processed.  To upload a File,  pass in a File or Blob object.  *IE Users - File Upload is only supported in IE 10 and above*
    @param {Object} [options={}] - Additional options
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - a callback to be called when the request to the server results in an error
    @param {Object} [options.statusCode] - a collection of status codes and callbacks to fire when the request to the server returns on of those codes. For more info see the statusCode option on the <a href="http://api.jquery.com/jQuery.ajax/">jQuery.ajax page</a>.
    @param {AeroGear~successCallbackREST} [options.success] - a callback to be called when the result of the request to the server is successful
    @param {AeroGear~progressCallbackREST} [options.progress] - a callback that is a hook to monitor the upload progress when uploading a File.( if available )
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
        extraOptions,
        formData,
        key;

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

    // Check to see if there is a file and create a FormData Object to upload
    if( "FormData" in window ) {
        formData = new FormData();
        for( key in data ) {
            formData.append( key, data[ key ] );

            if( data[ key ] instanceof File || data[ key ] instanceof Blob ) {
                // Options to tell jQuery not to process data or worry about content-type.
                extraOptions.contentType = false;
                extraOptions.processData = false;
            }
        }

        if( extraOptions.contentType === false ) {
            extraOptions.data = formData;
        }

        // the jqXHR doesn't expose upload progress, so we need to create a custom xhr object
        extraOptions.xhr = function() {
            var myXhr = jQuery.ajaxSettings.xhr();
            if( myXhr.upload ){
                myXhr.upload.addEventListener( "progress", function() {
                    if( options.progress ) {
                        options.progress.apply( this, arguments );
                    }
                }, false );
            }
            return myXhr;
        };
    }
    // Stringify data if we actually want to POST/PUT JSON data
    if ( extraOptions.contentType === "application/json" && extraOptions.data && typeof extraOptions.data !== "string" ) {
        extraOptions.data = JSON.stringify( extraOptions.data );
    }

    if( !this.getAuthorizer() ) {
        return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
    } else {
        return this.getAuthorizer().execute( jQuery.extend( {}, options, extraOptions ) );
    }
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

    if( !this.getAuthorizer() ) {
        return jQuery.ajax( jQuery.extend( {}, this.getAjaxSettings(), extraOptions ) );
    } else {
        return this.getAuthorizer().execute( jQuery.extend( {}, options, extraOptions ) );
    }
};

/**
    A collection of data connections (stores) and their corresponding data models. This object provides a standard way to interact with client side data no matter the data format or storage mechanism used.
    @status Stable
    @class
    @augments AeroGear.Core
    @param {String|Array|Object} [config] - A configuration for the store(s) being created along with the DataManager. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the store will later be referenced by
    @param {String} [config.type="Memory"] - the type of store as determined by the adapter used
    @param {String} [config.recordId="id"] - @deprecated the identifier used to denote the unique id for each record in the data associated with this store
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @param {Boolean} [config.settings.fallback=true] - falling back to a supported adapter is on by default, to opt-out, set this setting to false
    @param {Array} [config.settings.preferred] - a list of preferred adapters to try when falling back. Defaults to [ "IndexedDB", "WebSQL", "SessionLocal", "Memory" ]
    @returns {object} dataManager - The created DataManager containing any stores that may have been created
    @example
// Create an empty DataManager
var dm = AeroGear.DataManager();

// Create a single store using the default adapter
var dm2 = AeroGear.DataManager( "tasks" );

// Create multiple stores using the default adapter
var dm3 = AeroGear.DataManager( [ "tasks", "projects" ] );

// Create a custom store
var dm3 = AeroGear.DataManager({
    name: "mySessionStorage",
    type: "SessionLocal",
    id: "customID"
});

// Create multiple custom stores
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

    /**
        This function is used by the AeroGear.DataManager to add a new Object to its respective collection.
        @name AeroGear.add
        @method
        @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
        @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ){
        config = config || {};

        var i, type, fallback, preferred, settings;

        config = AeroGear.isArray( config ) ? config : [ config ];

        config = config.map( function( value, index, array ) {
            settings = value.settings || {};
            fallback = settings.fallback === false ? false : true;
            if( fallback ) {
                preferred = settings.preferred ? settings.preferred : AeroGear.DataManager.preferred;
                if ( typeof value !== "string" ) {
                    type = value.type || "Memory";
                    if( !( type in AeroGear.DataManager.validAdapters ) ) {
                        for( i = 0; i < preferred.length; i++ ) {
                            if( preferred[ i ] in AeroGear.DataManager.validAdapters ) {
                                // For Deprecation purposes in 1.3.0  will be removed in 1.4.0
                                if( type === "IndexedDB" || type === "WebSQL" ) {
                                    value.settings = AeroGear.extend( value.settings || {}, { async: true } );
                                }
                                value.type = preferred[ i ];
                                return value;
                            }
                        }
                    }
                }
            }
            return value;
        }, this );

        AeroGear.Core.call( this );
        this.add( config );

        // Put back DataManager.add
        this.add = this._add;
    };

    // Save a reference to DataManager.add to put back later
    this._add = this.add;

    /**
        This function is used internally by datamanager to remove an Object from the respective collection.
        @name AeroGear.remove
        @method
        @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object.
        @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ){
        AeroGear.Core.call( this );
        this.remove( config );

        // Put back DataManager.remove
        this.remove = this._remove;
    };

    // Save a reference to DataManager.remove to put back later
    this._remove = this.remove;

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
    Stores the valid adapters
*/
AeroGear.DataManager.validAdapters = {};

/**
    preferred adapters for the fallback strategy
*/
AeroGear.DataManager.preferred = [ "IndexedDB", "WebSQL", "SessionLocal", "Memory" ];

/**
    Method to determine and store what adapters are valid for this environment
*/
AeroGear.DataManager.validateAdapter = function( id, obj ) {
    if( obj.isValid() ) {
        AeroGear.DataManager.validAdapters[ id ] = obj;
    }
};

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
    The Base adapter that all other adapters will extend from.
    Not to be Instantiated directly
 */
AeroGear.DataManager.adapters.base = function( storeName, settings ) {
    if ( this instanceof AeroGear.DataManager.adapters.base ) {
        throw "Invalid instantiation of base class AeroGear.DataManager.adapters.base";
    }

    settings = settings || {};

    // Private Instance vars
    var data = null,
        recordId = settings.recordId ? settings.recordId : "id",
        crypto = settings.crypto || {},
        cryptoOptions = crypto.options || {};

    // Privileged Methods
    /**
        Returns the value of the private data var
        @private
        @augments base
        @returns {Array}
     */
    this.getData = function() {
        return data || [];
    };

    /**
        Sets the value of the private data var
        @private
        @augments base
     */
    this.setData = function( newData ) {
        data = newData;
    };
    /**
        Returns the value of the private recordId var
        @private
        @augments base
        @returns {String}
     */
    this.getRecordId = function() {
        return recordId;
    };

    /**
        A Function for a jQuery.Deferred to always call
        @private
        @augments base
     */
    this.always = function( value, status, callback ) {
        if( callback ) {
            callback.call( this, value, status );
        }
    };

    /**
        Encrypt data being saved or updated if applicable
        @private
        @augments base
     */
    this.encrypt = function( data ) {
        var content;

        if( crypto.agcrypto ) {
            cryptoOptions.data = sjcl.codec.utf8String.toBits( JSON.stringify( data ) );
            content = {
                id: data[ recordId ],
                data: crypto.agcrypto.encrypt( cryptoOptions )
            };
            window.localStorage.setItem( "ag-" + storeName + "-IV", JSON.stringify( { id: crypto.agcrypto.getIV() } ) );
            return content;
        }

        return data;
    };

    /**
        Decrypt data being read if applicable
        @private
        @augments base
     */
    this.decrypt = function( data, isSessionLocal ) {
        var content, IV;

        if( crypto.agcrypto ) {
            IV = JSON.parse( window.localStorage.getItem( "ag-" + storeName + "-IV" ) ) || {};
            cryptoOptions.IV = IV.id;
            data = AeroGear.isArray( data ) ? data : [ data ];
            content = data.map( function( value ) {
                cryptoOptions.data = value.data;
                return JSON.parse( sjcl.codec.utf8String.fromBits( crypto.agcrypto.decrypt( cryptoOptions ) ) );
            });

            return isSessionLocal ? content[ 0 ] : content;
        }

        return data;
    };
};

/**
    The Memory adapter is the default type used when creating a new store. Data is simply stored in a data var and is lost on unload (close window, leave page, etc.)
    This constructor is instantiated when the "DataManager.add()" method is called
    @status Stable
    @constructs AeroGear.DataManager.adapters.Memory
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @returns {Object} The created store
    @example
// Create an empty DataManager
var dm = AeroGear.DataManager();

// Add a custom memory store
dm.add( "newStore", {
    recordId: "customID"
});
 */
AeroGear.DataManager.adapters.Memory = function( storeName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager.adapters.Memory ) ) {
        return new AeroGear.DataManager.adapters.Memory( storeName, settings );
    }

    AeroGear.DataManager.adapters.base.apply( this, arguments );
    /**
        Empties the value of the private data var
        @private
        @augments Memory
     */
    this.emptyData = function() {
        this.setData( null );
    };

    /**
        Adds a record to the store's data set
        @private
        @augments Memory
     */
    this.addDataRecord = function( record ) {
        this.getData().push( record );
    };

    /**
        Adds a record to the store's data set
        @private
        @augments Memory
     */
    this.updateDataRecord = function( index, record ) {
        this.getData()[ index ] = record;
    };

    /**
        Removes a single record from the store's data set
        @private
        @augments Memory
     */
    this.removeDataRecord = function( index ) {
        this.getData().splice( index, 1 );
    };

    /**
        A Function for a jQuery.Deferred to always call
        @private
        @augments Memory
     */
    this.always = function( value, status, callback ) {
        if( callback ) {
            callback.call( this, value, status );
        }
    };

    /**
        Returns a synchronous jQuery.Deferred for api symmetry
        @private
        @augments base
     */
    this.open = function( options ) {
        return jQuery.Deferred().resolve( undefined, "success", options && options.success );
    };

    /**
        Returns a synchronous jQuery.Deferred for api symmetry
        @private
        @augments base
    */
    this.close = function() {
        // purposefully left empty
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
    Determine if this adapter is supported in the current environment
*/
AeroGear.DataManager.adapters.Memory.isValid = function() {
    return true;
};

/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @param {Object} [options={}] - options
    @param {AeroGear~successCallbackMEMORY} [options.success] - a callback to be called after successfully reading a Memory Store -  this read is synchronous but the callback is provided for API symmetry.
    @returns {Object} A jQuery.Deferred promise
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// Get an array of all data in the store
dm.read()
    .then( function( data ) {
        console.log( data );
    });

// Read a specific piece of data based on an id
dm.read( 12345 )
    .then( function( data ) {
        console.log( data );
    });
 */
AeroGear.DataManager.adapters.Memory.prototype.read = function( id, options ) {
    var filter = {},
        data,
        deferred = jQuery.Deferred();

    filter[ this.getRecordId() ] = id;
    if( id ) {
        this.filter( filter ).then( function( filtered ) { data = filtered; } );
    } else {
        data = this.getData();
    }

    deferred.always( this.always );
    return deferred.resolve( data, "success", options ? options.success : undefined );
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @param {AeroGear~successCallbackMEMORY} [options.success] - a callback to be called after successfully saving data from a Memory Store -  this save is synchronous but the callback is provided for API symmetry.
    @returns {Object} A jQuery.Deferred promise
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task",
    date: "2012-07-13",
    ...
});

// Store an array of new Tasks
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
AeroGear.DataManager.adapters.Memory.prototype.save = function( data, options ) {
    var itemFound = false,
        deferred = jQuery.Deferred();

    data = AeroGear.isArray( data ) ? data : [ data ];

    if ( options && options.reset ) {
        this.setData( data );
    } else {
        if ( this.getData() && this.getData().length !== 0 ) {
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
    deferred.always( this.always );
    return deferred.resolve( this.getData(), "success", options ? options.success : undefined );
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @param {Object} [options={}] - options
    @param {AeroGear~successCallbackMEMORY} [options.success] - a callback to be called after successfully removing data from a  Memory Store -  this remove is synchronous but the callback is provided for API symmetry.
    @returns {Object} A jQuery.Deferred promise
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

// Delete a record
dm.remove( 1, {
    success: function( data ) { ... },
    error: function( error ) { ... }
});

// Remove all data
dm.remove( undefined, {
    success: function( data ) { ... },
    error: function( error ) { ... }
});

// Delete all remaining data from the store
dm.remove();
 */
AeroGear.DataManager.adapters.Memory.prototype.remove = function( toRemove, options ) {
    var delId, data, item,
        deferred = jQuery.Deferred();

    deferred.always( this.always );

    if ( !toRemove ) {
        // empty data array and return
        this.emptyData();
        return deferred.resolve( this.getData(), "success", options ? options.success : undefined );
    } else {
        toRemove = AeroGear.isArray( toRemove ) ? toRemove : [ toRemove ];
    }

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

    return deferred.resolve( this.getData(), "success", options ? options.success : undefined );
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @param {Object} [options={}] - options
    @param {AeroGear~successCallbackMEMORY} [options.success] - a callback to be called after successfully filter data from a Memory Store -  this filter is synchronous but the callback is provided for API symmetry.
    @return {Object} A jQuery.Deferred promise
    @example
var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

// An object can be passed to filter the data
// This would return all records with a user named 'admin' **AND** a date of '2012-08-01'
dm.stores.tasks.filter({
        date: "2012-08-01",
        user: "admin"
    },
    {
        success: function( data ) { ... },
        error: function( error ) { ... }
    }
);

// The matchAny parameter changes the search to an OR operation
// This would return all records with a user named 'admin' **OR** a date of '2012-08-01'
dm.stores.tasks.filter({
        date: "2012-08-01",
        user: "admin"
    },
    true,
    {
        success: function( data ) { ... },
        error: function( error ) { ... }
    }
);
 */
AeroGear.DataManager.adapters.Memory.prototype.filter = function( filterParameters, matchAny, options ) {
    var filtered, key, j, k, l, nestedKey, nestedFilter, nestedValue,
        that = this,
        deferred = jQuery.Deferred();

    deferred.always( this.always );

    if ( !filterParameters ) {
        filtered = this.getData() || [];
        return deferred.resolve( filtered, "success", options ? options.success : undefined );
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
                                // at least one must match and this one does so return true
                                paramResult = true;
                                break;
                            }
                            if( !matchAny && filterParameters[ keys[ key ] ] !== value[ keys[ key ] ][ j ] ) {
                                // All must match but this one doesn't so return false
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
    return deferred.resolve( filtered, "success", options ? options.success : undefined );
};

/**
    Validate this adapter and add it to AeroGear.DataManager.validAdapters if valid
*/
AeroGear.DataManager.validateAdapter( "Memory", AeroGear.DataManager.adapters.Memory );

/**
    The SessionLocal adapter extends the Memory adapter to store data in either session or local storage which makes it a little more persistent than memory
    This constructor is instantiated when the "DataManager.add()" method is called
    @status Stable
    @constructs AeroGear.DataManager.adapters.SessionLocal
    @mixes AeroGear.DataManager.adapters.Memory
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {String} [settings.storageType="sessionStorage"] - the type of store can either be sessionStorage or localStorage
    @param {Object} [settings.crypto] - the crypto settings to be passed to the adapter
    @param {Object} [settings.crypto.agcrypto] - the AeroGear.Crypto object to be used
    @param {Object} [settings.crypto.options] - the specific options for the AeroGear.Crypto encrypt/decrypt methods
    @returns {Object} The created store
    @example
// Create an empty DataManager
var dm = AeroGear.DataManager();

// Add a custom SessionLocal store using local storage as its storage type
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
    var storeType = settings.storageType || "sessionStorage",
        name = storeName,
        appContext = document.location.pathname.replace(/[\/\.]/g,"-"),
        storeKey = name + appContext,
        content = window[ storeType ].getItem( storeKey ),
        currentData = content ? this.decrypt( JSON.parse( content ), true ) : null ;

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

/**
    Determine if this adapter is supported in the current environment
*/
AeroGear.DataManager.adapters.SessionLocal.isValid = function() {
    try {
        return !!(window.localStorage && window.sessionStorage);
    } catch( error ){
        return false;
    }
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
        @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
        @param {AeroGear~errorCallbackStorage} [options.error] - A callback to be executed when an error is thrown trying to save data to the store. The most likely error is when the localStorage is full. The callback is passed the error object and the data that was attempted to be saved as arguments.
        @param {AeroGear~success} [options.success] - A callback to be called if the save was successful. This probably isn't necessary since the save is synchronous but is provided for API symmetry.
        @returns {Object} A jQuery.Deferred promise
        @example
var dm = AeroGear.DataManager([{ name: "tasks", type: "SessionLocal" }]).stores[ 0 ];

// Store a new task
dm.save({
    title: "Created Task",
    date: "2012-07-13",
    ...
});

// Store an array of new Tasks
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
            var newData,
                deferred = jQuery.Deferred(),
                reset = options && options.reset ? options.reset : false,
                oldData = window[ this.getStoreType() ].getItem( this.getStoreKey() );

            AeroGear.DataManager.adapters.Memory.prototype.save.apply( this, [ arguments[ 0 ], { reset: reset } ] ).then( function( data ) {
                newData = data;
            });

            deferred.always( this.always );

            // Sync changes to persistent store
            try {
                window[ this.getStoreType() ].setItem( this.getStoreKey(), JSON.stringify( this.encrypt( newData ) ) );
                if ( options && options.success ) {
                    options.storageSuccess( newData );
                }
            } catch( error ) {
                oldData = oldData ? JSON.parse( oldData ) : [];

                AeroGear.DataManager.adapters.Memory.prototype.save.apply( this, [ oldData, { reset: reset } ] ).then( function( data ) {
                    newData = data;
                });

                if ( options && options.error ) {
                    return deferred.reject( data, "error", options ? options.error : undefined );
                } else {
                    deferred.reject();
                    throw error;
                }
            }

            return deferred.resolve( newData, "success", options ? options.success : undefined );
        }, enumerable: true, configurable: true, writable: true
    },
    /**
        Removes data from the store
        @method
        @memberof AeroGear.DataManager.adapters.SessionLocal
        @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
        @param {Object} [options] - The options to be passed to the save method
        @param {AeroGear~successrCallbackStorage} [options.success] - A callback to be called if the remove was successful. This probably isn't necessary since the remove is synchronous but is provided for API symmetry.
        @returns {Object} A jQuery.Deferred promise
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

// Delete a record
dm.remove( 1, {
    success: function( data ) { ... },
    error: function( error ) { ... }
});

// Remove all data
dm.remove( undefined, {
    success: function( data ) { ... },
    error: function( error ) { ... }
});

// Delete all remaining data from the store
dm.remove();
     */
    remove: {
        value: function( toRemove, options ) {
            // Call the super method
            var newData,
                deferred = jQuery.Deferred();

            AeroGear.DataManager.adapters.Memory.prototype.remove.apply( this, arguments ).then( function( data ) {
                newData = data;
            });

            // Sync changes to persistent store
            window[ this.getStoreType() ].setItem( this.getStoreKey(), JSON.stringify( this.encrypt( newData ) ) );

            deferred.always( this.always );
            return deferred.resolve( newData, status, options ? options.success : undefined );
        }, enumerable: true, configurable: true, writable: true
    }
});

/**
    Validate this adapter and add it to AeroGear.DataManager.validAdapters if valid
*/
AeroGear.DataManager.validateAdapter( "SessionLocal", AeroGear.DataManager.adapters.SessionLocal );

/**
    The IndexedDB adapter stores data in an IndexedDB database for more persistent client side storage
    This constructor is instantiated when the "DataManager.add()" method is called
    @constructs AeroGear.DataManager.adapters.IndexedDB
    @status Experimental
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {Boolean} [settings.auto=false] - set to 'true' to enable 'auto-connect' for read/remove/save/filter
    @param {Object} [settings.crypto] - the crypto settings to be passed to the adapter
    @param {Object} [settings.crypto.agcrypto] - the AeroGear.Crypto object to be used
    @param {Object} [settings.crypto.options] - the specific options for the AeroGear.Crypto encrypt/decrypt methods
    @returns {Object} The created store
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

 */
AeroGear.DataManager.adapters.IndexedDB = function( storeName, settings ) {

    if ( !window.indexedDB ) {
        throw "Your browser doesn't support IndexedDB";
    }

    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager.adapters.IndexedDB ) ) {
        return new AeroGear.DataManager.adapters.IndexedDB( storeName, settings );
    }

    AeroGear.DataManager.adapters.base.apply( this, arguments );

    settings = settings || {};

    // Private Instance vars
    var request, database,
        auto = settings.auto;

    // Privileged Methods
    /**
        Returns the value of the private database var
        @private
        @augments IndexedDB
        @returns {Object}
     */
    this.getDatabase = function() {
        return database;
    };

    /**
        Sets the value of the private database var
        @private
        @augments IndexedDB
     */
    this.setDatabase = function( db ) {
        database = db;
    };

    /**
        Returns the value of the private storeName var
        @private
        @augments IndexedDB
        @returns {String}
     */
    this.getStoreName = function() {
        return storeName;
    };

    /**
        @private
        @augments IndexedDB
        Compatibility fix
        Added in 1.3 to remove in 1.4
    */
    this.getAsync = function() {
        return true;
    };

    /**
        This function will check if the database is open.
        If 'auto' is not true, an error is thrown.
        If 'auto' is true, attempt to open the database then
        run the function passed in
        @private
        @augments IndexedDB
     */
    this.run = function( fn ) {
        var that = this;

        if( !database ) {
            if( !auto ) {
                // hasn't been opened yet
                throw "Database not opened";
            } else {
                this.open().always( function( value, status ) {
                    if( status === "error" ) {
                        throw "Database not opened";
                    } else {
                        fn.call( that, database );
                    }
                });
            }
        } else {
            fn.call( this, database );
        }
    };
};

// Public Methods
/**
    Determine if this adapter is supported in the current environment
*/
AeroGear.DataManager.adapters.IndexedDB.isValid = function() {
    return !!window.indexedDB;
};

/**
    Open the Database
    @param {Object} [options={}] - options
    @param {AeroGear~successCallbackINDEXEDDB} [settings.success] - a callback to be called after successfully opening an IndexedDB
    @param {AeroGear~errorCallbackINDEXEDDB} [settings.error] - a callback to be called when there is an error with the opening of an IndexedDB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });
*/
AeroGear.DataManager.adapters.IndexedDB.prototype.open = function( options ) {
    options = options || {};

    var request, database,
        that = this,
        storeName = this.getStoreName(),
        recordId = this.getRecordId(),
        deferred = jQuery.Deferred();

    // Attempt to open the indexedDB database
    request = window.indexedDB.open( storeName );

    request.onsuccess = function( event ) {
        database = event.target.result;
        that.setDatabase( database );
        deferred.resolve( database, "success", options.success );
    };

    request.onerror = function( event ) {
        deferred.reject( event, "error", options.error );
    };

    // Only called when the database doesn't exist and needs to be created
    request.onupgradeneeded = function( event ) {
        database = event.target.result;
        database.createObjectStore( storeName, { keyPath: recordId } );
    };

    deferred.always( this.always );
    return deferred.promise();
};


/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @param {Object} [options={}] - additional options
    @param {AeroGear~successCallbackINDEXEDDB} [options.success] - a callback to be called after the successful reading of an IndexedDB
    @param {AeroGear~errorCallbackINDEXEDDB} [options.error] - a callback to be called when there is an error reading an IndexedDB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.test1.read( undefined, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // read a record with a particular id
    dm.stores.test1.read( 5, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.read = function( id, options ) {
    options = options || {};

    var transaction, objectStore, cursor, request, _read,
        that = this,
        data = [],
        database = this.getDatabase(),
        storeName = this.getStoreName(),
        deferred = jQuery.Deferred();

    _read = function( database ) {

        if( !database.objectStoreNames.contains( storeName ) ) {
            deferred.resolve( [], "success", options.success );
        }

        transaction = database.transaction( storeName );
        objectStore = transaction.objectStore( storeName );

        if( id ) {
            request = objectStore.get( id );

            request.onsuccess = function( event ) {
                data.push( request.result );
            };

        } else {
            cursor = objectStore.openCursor();
            cursor.onsuccess = function( event ) {
                var result = event.target.result;
                if( result ) {
                    data.push( result.value );
                    result.continue();
                }
            };
        }

        transaction.oncomplete = function( event ) {
            deferred.resolve( that.decrypt( data ), "success", options.success );
        };

        transaction.onerror = function( event ) {
            deferred.reject( event, "error", options.error );
        };
    };

    this.run.call( this, _read );

    deferred.always( this.always );

    return deferred.promise();
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - additional options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @param {AeroGear~successCallbackINDEXEDDB} [options.success] - a callback to be called after the successful saving of a record into an IndexedDB
    @param {AeroGear~errorCallbackINDEXEDDB} [options.error] - a callback to be called when there is an error with the saving of a record into an IndexedDB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.newStore.save( { "id": 3, "name": "Grace", "type": "Little Person" }, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // Save multiple Records
    dm.stores.newStore.save(
        [
            { "id": 3, "name": "Grace", "type": "Little Person" },
            { "id": 4, "name": "Graeham", "type": "Really Little Person" }
        ],
        {
            success: function( data ) { ... },
            error: function( error ) { ... }
        }
    );
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.save = function( data, options ) {
    options = options || {};

    var transaction, objectStore, _save,
        that = this,
        database = this.getDatabase(),
        storeName = this.getStoreName(),
        deferred = jQuery.Deferred(),
        i = 0;

    _save = function( database ) {
        transaction = database.transaction( storeName, "readwrite" );
        objectStore = transaction.objectStore( storeName );

        if( options.reset ) {
            objectStore.clear();
        }

        if( AeroGear.isArray( data ) ) {
            for( i; i < data.length; i++ ) {
                objectStore.put( this.encrypt( data[ i ] ) );
            }
        } else {
            objectStore.put( this.encrypt( data ) );
        }

        transaction.oncomplete = function( event ) {
            that.read().done( function( data, status ) {
                if( status === "success" ) {
                    deferred.resolve( data, status, options.success );
                } else {
                    deferred.reject( data, status, options.error );
                }
            });
        };

        transaction.onerror = function( event ) {
            deferred.reject( event, "error", options.error );
        };
    };

    this.run.call( this, _save );

    deferred.always( this.always );

    return deferred.promise();
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @param {AeroGear~successCallbackINDEXEDDB} [options.success] - a callback to be called after successfully removing a record out of an IndexedDB
    @param {AeroGear~errorCallbackINDEXEDDB} [options.error] - a callback to be called when there is an error removing a record out of an IndexedDB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    // Delete a record
    dm.stores.newStore.remove( 1, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // Remove all data
    dm.stores.newStore.remove( undefined, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.remove = function( toRemove, options ) {
    options = options || {};

    var objectStore, transaction, _remove,
        that = this,
        database = this.getDatabase(),
        storeName = this.getStoreName(),
        deferred = jQuery.Deferred(),
        i = 0;

    _remove = function() {
        transaction = database.transaction( storeName, "readwrite" );
        objectStore = transaction.objectStore( storeName );

        if( !toRemove ) {
            objectStore.clear();
        } else  {
            toRemove = AeroGear.isArray( toRemove ) ? toRemove: [ toRemove ];

            for( i; i < toRemove.length; i++ ) {
                if ( typeof toRemove[ i ] === "string" || typeof toRemove[ i ] === "number" ) {
                    objectStore.delete( toRemove[ i ] );
                } else if ( toRemove ) {
                    objectStore.delete( toRemove[ i ][ this.getRecordId() ] );
                } else {
                    continue;
                }
            }
        }

        transaction.oncomplete = function( event ) {
            that.read().done( function( data, status ) {
                if( status === "success" ) {
                    deferred.resolve( data, status, options.success );
                } else {
                    deferred.reject( data, status, options.error );
                }
            });
        };

        transaction.onerror = function( event ) {
            deferred.reject( event, "error", options.error );
        };
    };

    this.run.call( this, _remove );

    deferred.always( this.always );

    return deferred.promise();
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @param {AeroGear~successCallbackINDEXEDDB} [options.success] - a callback to be called after successful filtering of an IndexedDB
    @param {AeroGear~errorCallbackINDEXEDDB} [options.error] - a callback to be called after an error filtering of an IndexedDB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.test1.filter( { "name": "Lucas" }, true, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.filter = function( filterParameters, matchAny, options ) {
    options = options || {};

    var _filter,
        that = this,
        deferred = jQuery.Deferred(),
        database = this.getDatabase();

    _filter = function() {
        this.read().then( function( data, status ) {
            if( status !== "success" ) {
                deferred.reject( data, status, options.error );
                return;
            }

            AeroGear.DataManager.adapters.Memory.prototype.save.call( that, data, true );
            AeroGear.DataManager.adapters.Memory.prototype.filter.call( that, filterParameters, matchAny ).then( function( data ) {
                deferred.resolve( data, "success", options.success );
            });
        });
    };

    this.run.call( this, _filter );

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Close the current store
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store and then delete a record
    dm.add({
        name: "newStore",
        storageType: "IndexedDB"
    });

    dm.stores.newStore.close();
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.close = function() {
    var database = this.getDatabase();
    if( database ) {
        database.close();
    }
};

/**
    Validate this adapter and add it to AeroGear.DataManager.validAdapters if valid
*/
AeroGear.DataManager.validateAdapter( "IndexedDB", AeroGear.DataManager.adapters.IndexedDB );

/**
    The WebSQL adapter stores data in a WebSQL database for more persistent client side storage
    This constructor is instantiated when the "DataManager.add()" method is called
    @constructs AeroGear.DataManager.adapters.WebSQL
    @status Experimental
    @param {String} storeName - the name used to reference this particular store
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.recordId="id"] - the name of the field used to uniquely identify a "record" in the data
    @param {Boolean} [settings.auto=false] - set to 'true' to enable 'auto-connect' for read/remove/save/filter
    @param {Object} [settings.crypto] - the crypto settings to be passed to the adapter
    @param {Object} [settings.crypto.agcrypto] - the AeroGear.Crypto object to be used
    @param {Object} [settings.crypto.options] - the specific options for the AeroGear.Crypto encrypt/decrypt methods
    @returns {Object} The created store
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

 */
AeroGear.DataManager.adapters.WebSQL = function( storeName, settings ) {

    if ( !window.openDatabase ) {
        throw "Your browser doesn't support WebSQL";
    }

    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.DataManager.adapters.WebSQL ) ) {
        return new AeroGear.DataManager.adapters.WebSQL( storeName, settings );
    }

    AeroGear.DataManager.adapters.base.apply( this, arguments );

    settings = settings || {};

    // Private Instance vars
    var database,
        auto = settings.auto;

    // Privileged Methods
    /**
        Returns the value of the private database var
        @private
        @augments WebSQL
        @returns {Object}
     */
    this.getDatabase = function() {
        return database;
    };

    /**
        Sets the value of the private database var
        @private
        @augments WebSQL
     */
    this.setDatabase = function( db ) {
        database = db;
    };

    /**
        Returns the value of the private storeName var
        @private
        @augments WebSQL
        @returns {String}
     */
    this.getStoreName = function() {
        return storeName;
    };

    /**
        @private
        @augments WebSQL
        Compatibility fix
        Added in 1.3 to remove in 1.4
    */
    this.getAsync = function() {
        return true;
    };

    /**
        This function will check if the database is open.
        If 'auto' is not true, an error is thrown.
        If 'auto' is true, attempt to open the databse then
        run the function passed in
        @private
        @augments WebSQL
     */
    this.run = function( callback ) {
        var that = this;

        if( !database ) {
            if( !auto ) {
                // hasn't been opened yet
                throw "Database not opened";
            } else {
                this.open().always( function( value, status ) {
                    if( status === "error" ) {
                        throw "Database not opened";
                    } else {
                        callback.call( that, database );
                    }
                });
            }
        } else {
            callback.call( this, database );
        }
    };
};

// Public Methods
/**
    Determine if this adapter is supported in the current environment
*/
AeroGear.DataManager.adapters.WebSQL.isValid = function() {
    return !!window.openDatabase;
};

/**
    Open the Database
    @param {Object} [options={}] - options
    @param {AeroGear~successCallbackWEBSQL} [settings.success] - a callback to be called when after successful opening of a WebSQL DB
    @param {AeroGear~errorCallbackWEBSQL} [settings.error] - a callback to be called when there is an error opening a WebSQL DB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });
*/
AeroGear.DataManager.adapters.WebSQL.prototype.open = function( options ) {
    options = options || {};

    var success, error, database,
        that = this,
        version = "1",
        databaseSize = 2 * 1024 * 1024,
        recordId = this.getRecordId(),
        storeName = this.getStoreName(),
        deferred = jQuery.Deferred();

    // Do some creation and such
    database = window.openDatabase( storeName, version, "AeroGear WebSQL Store", databaseSize );

    error = function( transaction, error ) {
        deferred.reject( error, "error", options.error );
    };

    success = function( transaction, result ) {
        that.setDatabase( database );
        deferred.resolve( database, "success", options.success );
    };

    database.transaction( function( transaction ) {
        transaction.executeSql( "CREATE TABLE IF NOT EXISTS '" + storeName + "' ( " + recordId + " REAL UNIQUE, json)", [], success, error );
    });

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @param {Object} [options={}] - additional options
    @param {AeroGear~successCallbackWEBSQL} [options.success] - a callback to be called after successfully reading a WebSQL DB
    @param {AeroGear~errorCallbackWEBSQL} [options.error] - a callback to be called when there is an error reading a WebSQL DB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.test1.read( undefined, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // read a record with a particular id
    dm.stores.test1.read( 5, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

 */
AeroGear.DataManager.adapters.WebSQL.prototype.read = function( id, options ) {
    options = options || {};

    var success, error, sql, _read,
        that = this,
        data = [],
        params = [],
        storeName = this.getStoreName(),
        database = this.getDatabase(),
        deferred = jQuery.Deferred(),
        i = 0;

    _read = function( database ) {
        error = function( transaction, error ) {
            deferred.reject( error, "error", options.error );
        };

        success = function( transaction, result ) {
            var rowLength = result.rows.length;
            for( i; i < rowLength; i++ ) {
                data.push( JSON.parse( result.rows.item( i ).json ) );
            }
            deferred.resolve( that.decrypt( data ), "success", options.success );
        };

        sql = "SELECT * FROM '" + storeName + "'";

        if( id ) {
            sql += " WHERE ID = ?";
            params = [ id ];
        }

        database.transaction( function( transaction ) {
            transaction.executeSql( sql, params, success, error );
        });
    };

    this.run.call( this, _read );

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - additional options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @param {AeroGear~successCallbackWEBSQL} [options.success] - a callback to be called after successfully saving records to a WebSQL DB
    @param {AeroGear~errorCallbackWEBSQL} [options.error] - a callback to be called when there is an error saving records to a WebSQL DB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.newStore.save( { "id": 3, "name": "Grace", "type": "Little Person" }, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // Save multiple Records
    dm.stores.newStore.save(
        [
            { "id": 3, "name": "Grace", "type": "Little Person" },
            { "id": 4, "name": "Graeham", "type": "Really Little Person" }
        ],
        {
            success: function( data ) { ... },
            error: function( error ) { ... }
        }
    );
 */
AeroGear.DataManager.adapters.WebSQL.prototype.save = function( data, options ) {
    options = options || {};

    var error, success, readSuccess, _save,
        that = this,
        recordId = this.getRecordId(),
        database = this.getDatabase(),
        storeName = this.getStoreName(),
        deferred = jQuery.Deferred(),
        i = 0;

    _save = function( database ) {
        error = function( transaction, error ) {
            deferred.reject( error, "error", options.error );
        };

        success = function( transaction, result ) {
            that.read().done( function( result, status ) {
                if( status === "success" ) {
                    deferred.resolve( result, status, options.success );
                } else {
                    deferred.reject( result, status, options.error );
                }
            });
        };

        data = AeroGear.isArray( data ) ? data : [ data ];

        database.transaction( function( transaction ) {
            if( options.reset ) {
                transaction.executeSql( "DROP TABLE " + storeName );
                transaction.executeSql( "CREATE TABLE IF NOT EXISTS '" + storeName + "' ( " + recordId + " REAL UNIQUE, json)" );
            }
            data.forEach( function( value ) {
                value = that.encrypt( value );
                transaction.executeSql( "INSERT OR REPLACE INTO '" + storeName + "' ( id, json ) VALUES ( ?, ? ) ", [ value[ recordId ], JSON.stringify( value ) ] );
            });
        }, error, success );
    };

    this.run.call( this, _save );

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @param {AeroGear~successCallbackWEBSQL} [options.success] - a callback to be called after successfully removing a record from a WebSQL DB
    @param {AeroGear~errorCallbackWEBSQL} [options.error] - a callback to be called when there is an error removing a record from a WebSQL DB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    // Delete a record
    dm.stores.newStore.remove( 1, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

    // Remove all data
    dm.stores.newStore.remove( undefined, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });

 */
AeroGear.DataManager.adapters.WebSQL.prototype.remove = function( toRemove, options ) {
    options = options || {};

    var sql, success, error, _remove,
        that = this,
        storeName = this.getStoreName(),
        database = this.getDatabase(),
        deferred = jQuery.Deferred(),
        i = 0;

    _remove = function( database ) {
        error = function( transaction, error ) {
            deferred.reject( error, "error", options.error );
        };

        success = function( transaction, result ) {
            that.read().done( function( result, status ) {
                if( status === "success" ) {
                    deferred.resolve( result, status, options.success );
                } else {
                    deferred.reject( result, status, options.error );
                }
            });
        };

        sql = "DELETE FROM '" + storeName + "'";

        if( !toRemove ) {
            // remove all
            database.transaction( function( transaction ) {
                transaction.executeSql( sql, [], success, error );
            });
        } else {
            toRemove = AeroGear.isArray( toRemove ) ? toRemove: [ toRemove ];
            database.transaction( function( transaction ) {
                for( i; i < toRemove.length; i++ ) {
                    if ( typeof toRemove[ i ] === "string" || typeof toRemove[ i ] === "number" ) {
                        transaction.executeSql( sql + " WHERE ID = ? ", [ toRemove[ i ] ] );
                    } else if ( toRemove ) {
                        transaction.executeSql( sql + " WHERE ID = ? ", [ toRemove[ i ][ this.getRecordId() ] ] );
                    } else {
                        continue;
                    }
                }
            }, error, success );
        }
    };

    this.run.call( this, _remove );

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @param {AeroGear~successCallbackWEBSQL} [options.success] - a callback to be called after a successful filtering of a WebSQL DB
    @param {AeroGear~errorCallbackWEBSQL} [options.error] - a callback to be calledd after an error filtering a WebSQL DB
    @return {Object} A jQuery.Deferred promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        storageType: "WebSQL"
    });

    dm.stores.newStore.open({
        success: function() { ... },
        error: function() { ... }
    });

    dm.stores.test1.filter( { "name": "Lucas" }, true, {
        success: function( data ) { ... },
        error: function( error ) { ... }
    });
 */
AeroGear.DataManager.adapters.WebSQL.prototype.filter = function( filterParameters, matchAny, options ) {
    options = options || {};

    var _filter,
        that = this,
        deferred = jQuery.Deferred(),
        db = this.getDatabase();

    _filter = function() {
        this.read().then( function( data, status ) {
        if( status !== "success" ) {
                deferred.reject( data, status, options.error );
                return;
            }

            AeroGear.DataManager.adapters.Memory.prototype.save.call( that, data, true );
            AeroGear.DataManager.adapters.Memory.prototype.filter.call( that, filterParameters, matchAny ).then( function( data ) {
                deferred.resolve( data, "success", options.success );
            });
        });
    };

    this.run.call( this, _filter );

    deferred.always( this.always );
    return deferred.promise();
};

/**
    Validate this adapter and add it to AeroGear.DataManager.validAdapters if valid
*/
AeroGear.DataManager.validateAdapter( "WebSQL", AeroGear.DataManager.adapters.WebSQL );

/**
    The AeroGear.Auth namespace provides an authentication and enrollment API. Through the use of adapters, this library provides common methods like enroll, login and logout that will just work.
    @status Stable
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

// Create a single module by passing an object using the default adapter
var auth4 = AeroGear.Auth(
    {
        name: "objectAuth"
    }
);

// Create multiple modules by passing an array of objects using the default adapter
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
    @status Stable
    @constructs AeroGear.Auth.adapters.Rest
    @param {String} moduleName - the name used to reference this particular auth module
    @param {Object} [settings={}] - the settings to be passed to the adapter
    @param {String} [settings.baseURL] - defines the base URL to use for an endpoint
    @param {Object} [settings.endpoints={}] - a set of REST endpoints that correspond to the different public methods including enroll, login and logout
    @returns {Object} The created auth module
    @example
// Create an empty Authenticator
var auth = AeroGear.Auth();

// Add a custom REST module to it
auth.add( {
    name: "module1",
    settings: {
        baseURL: "http://customURL.com"
    }
});

// Add a custom REST module to it with custom security endpoints
auth.add( {
    name: "module2",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
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

        if( options.xhrFields ) {
            processedOptions.xhrFields = options.xhrFields;
        }

        return processedOptions;
     };
};

// Public Methods
/**
    Enroll a new user in the authentication system
    @param {Object} data - User profile to enroll
    @param {Object} [options={}] - Options to pass to the enroll method
    @param {String} [options.baseURL] - defines the base URL to use for an endpoint
    @param {String} [options.contentType] - set the content type for the AJAX request
    @param {String} [options.dataType] - specify the data expected to be returned by the server
    @param {Object} [options.xhrFields] - specify extra xhr options, like the withCredentials flag
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
var auth = AeroGear.Auth( "userAuth" ).modules.userAuth,
    data = { userName: "user", password: "abc123", name: "John" };

// Enroll a new user
auth.enroll( data );

// Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules.customModule,
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
    @param {Object} data - A set of key/value pairs representing the user's credentials
    @param {Object} [options={}] - An object containing key/value pairs representing options
    @param {String} [options.baseURL] - defines the base URL to use for an endpoint
    @param {String} [options.contentType] - set the content type for the AJAX request
    @param {String} [options.dataType] - specify the data expected to be returned by the server
    @param {AeroGear~completeCallbackREST} [options.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
var auth = AeroGear.Auth( "userAuth" ).modules.userAuth,
    data = { userName: "user", password: "abc123" };

// Enroll a new user
auth.login( data );

// Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules.customModule,
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
var auth = AeroGear.Auth( "userAuth" ).modules.userAuth;

// Enroll a new user
auth.logout();

    // Add a custom REST module to it with custom security endpoints
var custom = AeroGear.Auth({
    name: "customModule",
    settings: {
        endpoints: {
            enroll: "register",
            login: "go",
            logout: "leave"
        }
    }
}).modules.customModule,
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

/**
    The AeroGear.Authorization namespace provides an authentication API.
    @status Experimental
    @class
    @param {String|Array|Object} [config] - A configuration for the service(s) being created along with the authorizer. If an object or array containing objects is used, the objects can have the following properties:
    @param {String} config.name - the name that the module will later be referenced by
    @param {String} [config.type="OAuth2"] - the type of module as determined by the adapter used
    @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
    @returns {Object} The created authorizer containing any authz services that may have been created
    @example
    // Create an empty authorizer
    var authz = AeroGear.Authorization();
 */
AeroGear.Authorization = function( config ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Authorization ) ) {
        return new AeroGear.Authorization( config );
    }

    // Super constructor
    AeroGear.Core.call( this );

    this.lib = "Authorization";
    this.type = config ? config.type || "OAuth2" : "OAuth2";

    /**
        The name used to reference the collection of service instances created from the adapters
        @memberOf AeroGear.Authorization
        @type Object
        @default services
     */
    this.collectionName = "services";

    this.add( config );
};

AeroGear.Authorization.prototype = AeroGear.Core;
AeroGear.Authorization.constructor = AeroGear.Authorization;

/**
    The adapters object is provided so that adapters can be added to the AeroGear.Authorization namespace dynamically and still be accessible to the add method
    @augments AeroGear.Authorization
 */
AeroGear.Authorization.adapters = {};

/**
    The OAuth2 adapter is the default type used when creating a new authorization module. It uses jQuery.ajax to communicate with the server.
    While this library can be used "standalone", we recommend using it with Pipeline to get the most benefit
    This constructor is instantiated when the "Authorizer.add()" method is called
    @status Experimental
    @constructs AeroGear.Authorization.adapters.OAuth2
    @param {String} name - the name used to reference this particular authz module
    @param {Object} settings={} - the settings to be passed to the adapter
    @param {String} settings.clientId - the client id/ app Id of the protected service
    @param {String} settings.redirectURL - the URL to redirect to
    @param {String} settings.authEndpoint - the endpoint for authorization
    @param {String} [settings.validationEndpoint] - the optional endpoint to validate your token.  Not in the Spec, but recommend for use with Google's API's
    @param {String} settings.scopes - a space separated list of "scopes" or things you want to access
    @returns {Object} The created authz module
    @example
    // Create an empty Authenticator
    var authz = AeroGear.Authorization();

    authz.add({
        name: "coolThing",
        settings: {
            clientId: "12345",
            redirectURL: "http://localhost:3000/redirector.html",
            authEndpoint: "http://localhost:3000/v1/authz",
            scopes: "userinfo coolstuff"
        }
    });
 */
AeroGear.Authorization.adapters.OAuth2 = function( name, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Authorization.adapters.OAuth2 ) ) {
        return new AeroGear.Authorization.adapters.OAuth2( name, settings );
    }

    settings = settings || {};

    // Private Instance vars
    var type = "OAuth2",
        state = uuid(), //Recommended in the spec,
        clientId = settings.clientId, //Required by the spec
        redirectURL = settings.redirectURL, //optional in the spec, but doesn't make sense without it,
        validationEndpoint = settings.validationEndpoint, //optional,  not in the spec, but recommend to use with Google's API's
        scopes = settings.scopes, //Optional by the spec
        accessToken,
        localStorageName = "ag-oauth2-" + clientId,
        authEndpoint = settings.authEndpoint + "?" +
            "response_type=token" +
            "&redirect_uri=" + encodeURIComponent( redirectURL ) +
            "&scope=" + encodeURIComponent( scopes ) +
            "&state=" + encodeURIComponent( state ) +
            "&client_id=" + encodeURIComponent( clientId );

    // Privileged Methods
    /**
        Returns the value of the private settings var
        @private
        @augments OAuth2
     */
    this.getAccessToken = function() {
        if( localStorage[ localStorageName ] ) {
            accessToken = JSON.parse( localStorage[ localStorageName ] ).accessToken;
        }

        return accessToken;
    };

    /**
        Returns the value of the private settings var
        @private
        @augments OAuth2
     */
    this.getState = function() {
        return state;
    };

    /**
        Returns the value of the private settings var
        @private
        @augments OAuth2
     */
    this.getClientId = function() {
        return clientId;
    };

    /**
        Returns the value of the private settings var
        @private
        @augments OAuth2
     */
    this.getLocalStorageName = function() {
        return localStorageName;
    };

    /**
        Returns the value of the private settings var
        @private
        @augments OAuth2
     */
    this.getValidationEndpoint = function() {
        return validationEndpoint;
    };

    /**
        Returns the value of a custom error message
        @private
        @augments OAuth2
     */
    this.createError = function( options ) {
        options = options || {};
        return AeroGear.extend( options, { authURL: authEndpoint } );
    };

    /**
        Returns the value of a parsed query string
        @private
        @augments OAuth2
     */
    this.parseQueryString = function( locationString ) {
        // taken from https://developers.google.com/accounts/docs/OAuth2Login
        // First, parse the query string
        var params = {},
            queryString = locationString.substr( locationString.indexOf( "#" ) + 1 ),
            regex = /([^&=]+)=([^&]*)/g,
            m;
        while ( ( m = regex.exec(queryString) ) ) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    };
};

/**
    Validate the Authorization endpoints - Takes the querystring that is returned after the "dance" unparsed.
    @param {String} queryString - The returned query string to be parsed
    @param {Object} [options={}] - Options to pass to the enroll method
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax
    @example
    // Create the Authorizer
    var authz = AeroGear.Authorization(),
        pipe;

    authz.add({
        name: "coolThing",
        settings: {
            clientId: "12345",
            redirectURL: "http://localhost:3000/redirector.html",
            authEndpoint: "http://localhost:3000/v1/authz",
            scopes: "userinfo coolstuff"
        }
    });

    // Create a new Pipeline with an authorizer
    pipe = AeroGear.Pipeline( { authorizer: authz.services.coolThing } );

    // Add a pipe
    pipe.add([
    {
        name: "cal",
        settings: {
            baseURL: "http://localhost:3000/",
            endpoint: "v1/userinfo"
        }
    }
    ]);

    // Make the call. OAuth2.read() will be called by Pipe.Read
    pipe.pipes.cal.read({
        success:function( response ) {
            ....
        },
        error: function( error ) {
            // an error happened, so take the authURL and do the "OAuth2 Dance",
        }
    });

    // After a successful response from the "OAuth2 Dance", validate that the query string is valid, If all is well, the access_token will be stored.
    authz.services.coolThing.validate( responseFromAuthEndpoint, {
        success: function( response ){
            ...
        },
        error: function( error ) {
            ...
        }
    });

    // Make pipe.read calls
    pipe.pipes.cal.read({
        success:function( response ) {
            // Should be success calls
        },
        error: function( error ) {
            ....
        }
    });

 */
AeroGear.Authorization.adapters.OAuth2.prototype.validate = function( queryString, options ) {
    options = options || {};

    var that = this,
        parsedQuery = this.parseQueryString( queryString ),
        state = this.getState(),
        error,
        success;

    success = function( response ) {
        // Perhaps we can use crypt here to be more secure
        localStorage.setItem( that.getLocalStorageName(), JSON.stringify( { "accessToken": parsedQuery.access_token } ) );
        if( options.success ) {
            options.success.apply( this, arguments );
        }
    };

    error = function( response ) {
        if( options.error ) {
            options.error.call( this, that.createError( response ) );
        }
    };

    if( parsedQuery.error ) {
        error.call( this, parsedQuery  );
        return;
    }

    // Make sure that the "state" value returned is the same one we sent
    if( parsedQuery.state !== state ) {
        // No Good
        error.call( this, { error: "invalid_request", state: state, error_description: "state's do not match"  } );
        return;
    }

    if( this.getValidationEndpoint() ) {
        jQuery.ajax({
            url: this.getValidationEndpoint() + "?access_token=" + parsedQuery.access_token,
            success: function( response ) {
              // Must Check the audience field that is returned.  This should be the same as the registered clientID
                if( that.getClientId() !== response.audience ) {
                    error.call( this, { "error": "invalid_token" } );
                    return ;
                }
                success.call( this, parsedQuery );
            },
            error: function( err ) {
                error.call( this, { "error": "invalid_token" } );
            }
        });
    } else {
        // The Spec does not specify that you need to validate the token
        success.call( this, parsedQuery );
    }
};

/**
    Read a secure endpoint - To be used with the Pipe.read() method
    @param {Object} options={} - Options to pass to the enroll method
    @param {String} options.url - the endpoint to access
    @param {AeroGear~errorCallbackREST} [options.error] - callback to be executed if the AJAX request results in an error
    @param {AeroGear~successCallbackREST} [options.success] - callback to be executed if the AJAX request results in success
    @returns {Object} The jqXHR created by jQuery.ajax - IF an error is returned,  the authentication URL will be appended to the response object
    @example
    // Create the Authorizer
    var authz = AeroGear.Authorization(),
    pipe;

    authz.add({
    name: "coolThing",
    settings: {
        clientId: "12345",
        redirectURL: "http://localhost:3000/redirector.html",
        authEndpoint: "http://localhost:3000/v1/authz",
        scopes: "userinfo coolstuff"
    }
    });

    // Create a new Pipeline with an authorizer
    pipe = AeroGear.Pipeline( { authorizer: authz.services.coolThing } );

    // Add a pipe
    pipe.add([
    {
        name: "cal",
        settings: {
            baseURL: "http://localhost:3000/",
            endpoint: "v1/userinfo"
        }
    }
    ]);

    // Make the call. OAuth2.read() will be called by Pipe.Read
    pipe.pipes.cal.read({
        success:function( response ) {
            ....
        },
        error: function( error ) {
            ....
        }
    });
 */
AeroGear.Authorization.adapters.OAuth2.prototype.execute = function( options ) {
    options = options || {};
    var that = this,
        url = options.url + "?access_token=" + this.getAccessToken(),
        contentType = "application/x-www-form-urlencoded",
        success,
        error;

    success = function( response ) {
        if( options.success ) {
            options.success.apply( this, arguments );
        }
    };
    error = function( response ) {
        if( options.error ) {
            options.error.call( this, that.createError( response ) );
        }
    };

    return jQuery.ajax({
        url: url,
        type: options.type,
        contentType: contentType,
        success: success,
        error: error
    });
};

/**
    The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
    @status Stable
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
    @status Experimental
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

// Public Methods
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
    @status Stable
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

// Public Methods
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

    // Subscribe to a channel
    notifierVertx.clients.client1.subscribe( channelObject );

    // Subscribe to multiple channels at once
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

    // Subscribe to a channel, but first unsubscribe from all currently subscribed channels by adding the reset parameter
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
    @param {Object|Array} channels - a channel object or a set of channel objects to which this client nolonger wishes to subscribe. Each object should have a String address and an optional callback which needs to be the same as the callback passed to the subscribe method while subscribing the client to the channel.
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
    var bus = this.getBus(),
        thisChannels = this.getChannels();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        bus.unregisterHandler( channels[ i ].address, channels[ i ].callback || thisChannels[ this.getChannelIndex( channels[ i ].address ) ].callback );
        this.removeChannel( channels[ i ] );
    }
};

/**
    Send a message to a particular channel
    @param {String} channel - the channel to which to send the message
    @param {String|Object} [message=""] - the message object to send
    @param {Boolean} [publish=false] - tell vert.x if this is a publish to all subscribed clients
    @example
    // Send an empty message to a channel
    notifier.clients.client1.send( "test.address" );

    // Send a "Hello" message to a channel
    notifier.clients.client1.send( "test.address", "Hello" );

    // Send a "Hello" message as an object
    notifier.clients.client1.send( "test.address", { "message": "Hello" } );

    // Send a "Hello" message as an object to all subscribed clients on that channel
    notifier.clients.client1.send( "test.address", { "message": "Hello" }, true );


 */
AeroGear.Notifier.adapters.vertx.prototype.send = function( channel, message, publish ) {
    var bus = this.getBus();

    if ( typeof message === Boolean && !publish ) {
        publish = message;
        message = "";
    }
    message = message || "";

    bus[ publish ? "publish" : "send" ]( channel, message );
};

/**
    The stomp adapter uses an underlying stomp.js implementation for messaging.
    @status Stable
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

// Public Methods
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
    notifier.clients.client2.disconnect(
        function() {
            console.log( "connected" );
        }
    );

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

    // Subscribe to multiple channels
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
    Set the client's debug property. Used to see the data being sent and received.
    @param {Function} [onData] - callback to be executed when data is sent and received
    @example
    // Log data being sent and received
    notifier.clients.client2.debug(
        function(data) {
            console.log( data );
        }
    );
 */
AeroGear.Notifier.adapters.stompws.prototype.debug = function( onData ) {
    var client = this.getClient(),
        debug = function() {
            if ( onData ) {
                onData.apply( this, arguments );
            }
        };

    if ( client ) {
        client.debug = debug;
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

    // Unsubscribe from multiple channels
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
    var client = this.getClient(),
        thisChannels = this.getChannels();

    channels = AeroGear.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        client.unsubscribe( channels[ i ].id || thisChannels[ this.getChannelIndex( channels[ i ].address ) ].id );
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

(function( AeroGear, $, undefined ) {
    /**
        The UnifiedPushClient object is used to perfom register and unregister operations against the AeroGear UnifiedPush server.
        @status Experimental
        @constructs AeroGear.UnifiedPushClient
        @param {String} variantID - the id representing the mobile application variant
        @param {String} variantSecret - the secret for the mobile application variant
        @param {String} pushServerURL - the location of the UnifiedPush server
        @returns {Object} The created unified push server client
        @example
        // Create the UnifiedPush client object:
        var client = AeroGear.UnifiedPushClient(
            "myVariantID",
            "myVariantSecret",
            "http://SERVER:PORT/CONTEXT/rest/registry/device"
        );

        // assemble the metadata for the registration:
        var metadata = {
            deviceToken: "theDeviceToken",
            alias: "some_username",
            categories: [ "email" ],
            simplePushEndpoint: "http://server.com/simplePushEndpoint"
        };

        var settings = {
            success: function(){ ... },
            error: function() { ... }
        };

        settings.metadata = metadata;

        // perform the registration against the UnifiedPush server:
        client.registerWithPushServer( settings );

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
            @param {Object} settings The settings to pass in
            @param {Object} settings.metadata - the metadata for the client
            @param {String} settings.metadata.deviceToken - identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} settings.metadata.simplePushEndpoint - the URL of the given SimplePush server/network that is needed in order to trigger a notification to be sent to the SimplePush client.
            @param {String} [settings.metadata.alias] - Application specific alias to identify users with the system. Common use case would be an email address or a username.
            @param {Array} [settings.metadata.categories] - In SimplePush this is the name of the registration endpoint. On Hybrid platforms like Apache Cordova this is used for tagging the registered client.
            @param {String} [settings.metadata.operatingSystem] - Useful on Hybrid platforms like Apache Cordova to specifiy the underlying operating system.
            @param {String} [settings.metadata.osVersion] - Useful on Hybrid platforms like Apache Cordova to specify the version of the underlying operating system.
            @param {String} [settings.metadata.deviceType] - Useful on Hybrid platforms like Apache Cordova to specify the type of the used device, like iPad or Android-Phone.
            @param {AeroGear~completeCallbackREST} [settings.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
            @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
            @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
            @returns {Object} The jqXHR created by jQuery.ajax
         */
        this.registerWithPushServer = function( settings ) {
            settings = settings || {};
            var metadata = settings.metadata || {};

            // we need a deviceToken, registrationID or a channelID:
            if ( !metadata.deviceToken ) {
                throw "UnifiedPushRegistrationException";
            }

            // Make sure that settings.metadata.categories is an Array
            metadata.categories = AeroGear.isArray( metadata.categories ) ? metadata.categories : ( metadata.categories ? [ metadata.categories ] : [] );

            return $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "POST",
                url: pushServerURL,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify( metadata ),
                success: settings.success,
                error: settings.error,
                complete: settings.complete
            });
        };

        /**
            Performs an unregister request against the UnifiedPush Server for the given deviceToken. The deviceToken identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the channelID of the subscribed channel.
            @param {String} deviceToken - unique String which identifies the client that is being unregistered.
            @param {Object} [settings = {}] The options to pass in
            @param {AeroGear~completeCallbackREST} [settings.complete] - a callback to be called when the result of the request to the server is complete, regardless of success
            @param {AeroGear~errorCallbackREST} [settings.error] - callback to be executed if the AJAX request results in an error
            @param {AeroGear~successCallbackREST} [settings.success] - callback to be executed if the AJAX request results in success
            @returns {Object} The jqXHR created by jQuery.ajax
         */
        this.unregisterWithPushServer = function( deviceToken, settings ) {
            settings = settings || {};
            return $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: "DELETE",
                url: pushServerURL + "/" + deviceToken,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                success: settings.success,
                error: settings.error,
                complete: settings.complete
            });
        };
    };

})( AeroGear, jQuery );

(function( AeroGear, $, undefined ) {
    /**
        The SimplePushClient object is used as a sort of polyfill/implementation of the SimplePush spec implemented in Firefox OS and the Firefox browser and provides a mechanism for subscribing to and acting on push notifications in a web application. See https://wiki.mozilla.org/WebAPI/SimplePush
        @status Experimental
        @constructs AeroGear.SimplePushClient
        @param {Object} options - an object used to initialize the connection to the SimplePush server
        @param {Boolean} [options.useNative=false] - if true, the connection will first try to use the Mozilla push network (still in development and not ready for production) before falling back to the SimplePush server specified
        @param {String} [options.simplePushServerURL] - the URL of the SimplePush server. This option is optional but only if you don't want to support browsers that are missing websocket support and you trust the not yet production ready Mozilla push server.
        @param {Function} options.onConnect - a callback to fire when a connection is established with the SimplePush server. This is a deviation from the SimplePush spec as it is not necessary when you using the in browser functionality since the browser establishes the connection before the application is started.
        @param {Function} options.onClose - a callback to fire when a connection to the SimplePush server is closed or lost.
        @returns {Object} The created unified push server client
        @example
        // Create the SimplePushClient object:
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
                        @status Experimental
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
                        @status Experimental
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
    AeroGear.Crypto is used to provide various crypto methods
    @status Experimental
    @class
    @augments AeroGear.Core
    @returns {object} agCrypto - The created Crypto Object
    @example
    // Create a AeroGear.Crypto Object

    var agCrypto = AeroGear.Crypto();
 */
AeroGear.Crypto = function() {

    if( !window.crypto || !window.crypto.getRandomValues ) {
        throw "Your browser does not support the Web Crypto API";
    }

    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Crypto ) ) {
        return new AeroGear.Crypto();
    }

    // Local Variables
    var privateKey, publicKey, IV, salt;

    /**
        Returns the value of the salt var
        @private
        @augments Crypto
        @returns {Object}
     */
    this.getSalt = function() {
        return salt;
    };
    /**
        Returns the value of the IV var
        @private
        @augments Crypto
        @returns {Object}
     */
    this.getIV = function() {
        return IV;
    };
    /**
        Returns the value of the private key var
        @private
        @augments Crypto
        @returns {Object}
     */
    this.getPrivateKey = function() {
        return privateKey;
    };

    /**
        Returns the value of the public key var
        @private
        @augments Crypto
        @returns {Object}
     */
    this.getPublicKey = function() {
        return publicKey;
    };

    // Method to retrieve random values
    /**
        Returns the random value
        @status Experimental
        @return {Number} - the random value
        @example
        // Random number generator:
        AeroGear.Crypto().getRandomValue();
    */
    this.getRandomValue = function() {
        var random = new Uint32Array( 1 );
        crypto.getRandomValues( random );
        return random[ 0 ];
    };
    // Method to provide key derivation with PBKDF2
    /**
        Returns the value of the key
        @status Experimental
        @param {String} password - master password
        @param {Number} providedSalt - salt provided to recreate the key
        @return {bitArray} - the derived key
        @example
        // Password encryption:
        AeroGear.Crypto().deriveKey( 'mypassword', 42 );
     */
    this.deriveKey = function( password, providedSalt ) {
        salt = providedSalt || ( salt ? salt : this.getRandomValue() );
        var utf8String = sjcl.codec.utf8String,
            count = 2048;
        return sjcl.misc.pbkdf2( password, utf8String.toBits( salt ), count );
    };

    // Method to provide symmetric encryption with GCM by default
    /**
        Encrypts in GCM mode
        @status Experimental
        @param {Object} options - includes IV (Initialization Vector), AAD
            (Additional Authenticated Data), key (private key for encryption),
            plainText (data to be encrypted)
        @return {bitArray} - The encrypted data represented by an array of bytes
        @example
        // Data encryption:
        var options = {
            IV: myIV,
            AAD: myAAD,
            key: mySecretKey,
            data: message
        };
        AeroGear.Crypto().encrypt( options );
     */
    this.encrypt = function( options ) {
        options = options || {};
        var gcm = sjcl.mode.gcm,
            key = new sjcl.cipher.aes ( options.key );

        IV = options.IV || ( IV ? IV : this.getRandomValue() ); // this will always use the value in options.IV if available
                                                                    // or it will check to see if the local var IV is not null/undefined
                                                                    // it that is there, then it uses it, else it gets a randomValue
                                                                    // what ever it uses,  it stores in the local var IV

        return gcm.encrypt( key, options.data, IV, options.aad, 128 );
    };

    // Method to provide symmetric decryption with GCM by default
    /**
        Decrypts in GCM mode
        @status Experimental
        @param {Object} options - includes IV (Initialization Vector), AAD
            (Additional Authenticated Data), key (private key for encryption),
            ciphertext (data to be decrypted)
        @return {bitArray} - The decrypted data
        @example
        // Data decryption:
        var options = {
            IV: myIV,
            AAD: myAAD,
            key: mySecretKey,
            data: ciphertext
        };
        AeroGear.Crypto().decrypt( options );
     */
    this.decrypt = function( options ) {
        options = options || {};
        var gcm = sjcl.mode.gcm,
            key = new sjcl.cipher.aes ( options.key );
        return gcm.decrypt( key, options.data, options.IV || IV, options.aad, 128 );
    };

    // Method to provide secure hashing
    /**
        Generates a hash output based on SHA-256
        @status Experimental
        @param {bitArray|String} data to hash.
        @return {bitArray} - Hash value
        @example
        // Data hashing:
        AeroGear.Crypto().hash( options );
     */
    this.hash = function( data ) {
        return sjcl.hash.sha256.hash( data );
    };

    // Method to provide digital signatures
    /**
        Sign messages with ECDSA
        @status Experimental
        @param {Object} options - includes keys (provided keys to sign the message),
            message (message to be signed)
        @return {bitArray} - Digital signature
        @example
        // Message sign:
        var options = {
            keys: providedKey,
            message: PLAIN_TEXT
        };
        AeroGear.Crypto().sign( options );
     */
    this.sign = function( options ) {
        options = options || {};
        var keys = options.keys || sjcl.ecc.ecdsa.generateKeys( 192 ),
            hash = sjcl.hash.sha256.hash( options.message );
        return keys.sec.sign( hash );
    };

    // Method to verify digital signatures
    /**
        Verify signed messages with ECDSA
        @status Experimental
        @param {Object} options - includes keys (provided keys to sign the message),
            message (message to be verified), signature (Digital signature)
        @return {bitArray} - Signature
        @example
        // Message validation
        var options = {
            keys: sjcl.ecc.ecdsa.generateKeys(192),
            signature: signatureToBeVerified
        };
        AeroGear.Crypto().verify( options );
     */
    this.verify = function ( options ) {
        options = options || {};
        var message = sjcl.hash.sha256.hash( options.message );
        return options.keys.pub.verify( message, options.signature );
    };

    // A pair of cryptographic keys (a public and a private key) used for asymmetric encryption
    /**
        Initialize the key pair with the keys provided
        @status Experimental
        @param {Object} prKey - private key
        @param {Object} pubKey - public key
        @returns {Object} the object containing the key pair
        @example
        AeroGear.Crypto().KeyPair();
     */
    this.KeyPair = function( prKey, pubKey ) {

        var keys, pub;

        if ( prKey && pubKey ) {
            privateKey = prKey;
            publicKey = pubKey;
        } else {
            keys = sjcl.ecc.elGamal.generateKeys( 192,0 );
            // kem - key encapsulation mechanism
            pub = keys.pub.kem();
            publicKey = pub.key;
            privateKey = keys.sec.unkem( pub.tag );
        }

        return this;
    };
};
})( this );
