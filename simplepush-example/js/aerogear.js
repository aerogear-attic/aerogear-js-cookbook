/*! AeroGear JavaScript Library - v2.1.0 - 2015-03-12
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
        } else if ( Array.isArray( config ) ) {
            // config is an array so loop through each item in the array
            for ( i = 0; i < config.length; i++ ) {
                current = config[ i ];

                if ( typeof current === "string" ) {
                    collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current, this.config );
                } else {
                    if( current.name ) {

                        // Merge the Module( authz, datamanger, ... )config with the adapters settings
                        current.settings = AeroGear.extend( current.settings || {}, this.config );

                        collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
                    }
                }
            }
        } else {
            if( !config.name ) {
                return this;
            }

            // Merge the Module( authz, datamanger, ... )config with the adapters settings
            // config is an object so use that signature
            config.settings = AeroGear.extend( config.settings || {}, this.config );

            collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
        }

        // reset the collection instance
        this[ this.collectionName ] = collection;

        return this;
    };
    /**
        This function is used internally by datamanager, etc. to remove an Object (store, etc.) from the respective collection.
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
        } else if ( Array.isArray( config ) ) {
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
    Utility function to merge many Objects in one target Object which is the first object in arguments list.
    @private
    @method
*/
AeroGear.extend = function() {
    var name, i, source,
        target = arguments[ 0 ];
    for( i=1; i<arguments.length; i++ ) {
        source = arguments[ i ];
        for( name in source ) {
            target[ name ] = source[ name ];
        }
    }
    return target;
};

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

  // Play nice with browsers
  var _previousRoot = _global.uuid;

  // **`noConflict()` - (browser only) to reset global 'uuid' var**
  uuid.noConflict = function() {
    _global.uuid = _previousRoot;
    return uuid;
  }
  _global.uuid = uuid;
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

        config = Array.isArray( config ) ? config : [ config ];

        config = config.map( function( value ) {
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
            data = Array.isArray( data ) ? data : [ data ];
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
dm.add({
    name: "newStore",
    settings: {
        recordId: "customID"
    }
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
        Returns a Promise that immediately resolves for api symmetry
        @private
        @augments base
     */
    this.open = function() {
        return Promise.resolve();
    };

    /**
        This method is just for sake of API symmetry with other DataManagers. It immediately returns.
        @private
        @augments base
    */
    this.close = function() {
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
    @returns {Object} A Promise
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
AeroGear.DataManager.adapters.Memory.prototype.read = function( id ) {
    var filter = {};

    filter[ this.getRecordId() ] = id;
    if( id ) {
        return this
            .filter( filter )
            .then(function( filtered ) {
                return filtered;
            });
    } else {
        return Promise.resolve( this.getData() );
    }
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @returns {Object} A Promise
    @example
    var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

    dm.open()
        .then( function() {

            // save one record
            dm.save({
                    title: "Created Task",
                    date: "2012-07-13",
                    ...
                })
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // save multiple records
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
                ])
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Update an existing piece of data
            var toUpdate = dm.read()[ 0 ];
            toUpdate.data.title = "Updated Task";
            dm.save( toUpdate )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });
 */
AeroGear.DataManager.adapters.Memory.prototype.save = function( data, options ) {
    var itemFound = false;

    data = Array.isArray( data ) ? data : [ data ];

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
    return Promise.resolve( this.getData() );
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @returns {Object} A Promise
    @example
    var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

    dm.open()
        .then( function() {

            // Delete a record
            dm.remove( 1, )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Remove all data
            dm.remove( undefined )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // Delete all remaining data from the store
            dm.remove()
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });
 */
AeroGear.DataManager.adapters.Memory.prototype.remove = function( toRemove ) {
    var delId, data, item;

    if ( !toRemove ) {
        // empty data array and return
        this.emptyData();
        return Promise.resolve( this.getData() );
    } else {
        toRemove = Array.isArray( toRemove ) ? toRemove : [ toRemove ];
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

    return Promise.resolve( this.getData() );
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @return {Object} A Promise
    @example
    var dm = AeroGear.DataManager( "tasks" ).stores[ 0 ];

    / Create an empty DataManager
    var dm = AeroGear.DataManager();

    dm.open()
        .then( function() {

            // An object can be passed to filter the data
            // This would return all records with a user named 'admin' **AND** a date of '2012-08-01'
            dm.filter( {
                    date: "2012-08-01",
                    user: "admin"
                } )
                .then( function( filteredData ) { ... } )
                .catch( function( error ) { ... } );

            // The matchAny parameter changes the search to an OR operation
            // This would return all records with a user named 'admin' **OR** a date of '2012-08-01'
            dm.filter( {
                    date: "2012-08-01",
                    user: "admin"
                }, true )
                .then( function( filteredData ) { ... } )
                .catch( function( error ) { ... } );
        });
 */
AeroGear.DataManager.adapters.Memory.prototype.filter = function( filterParameters, matchAny ) {
    var filtered, key, j, k,
        that = this;

    if ( !filterParameters ) {
        filtered = this.getData() || [];
        return Promise.resolve( filtered );
    }

    filtered = this.getData().filter( function( value ) {
        var match = matchAny ? false : true,
            keys = Object.keys( filterParameters ),
            filterObj, paramResult;

        for ( key = 0; key < keys.length; key++ ) {
            if ( filterParameters[ keys[ key ] ].data ) {
                // Parameter value is an object
                filterObj = filterParameters[ keys[ key ] ];
                paramResult = filterObj.matchAny ? false : true;

                for ( j = 0; j < filterObj.data.length; j++ ) {
                    if( Array.isArray( value[ keys[ key ] ] ) ) {
                        if( value[ keys [ key ] ].length ) {
                              if ( matchAny || filterObj.matchAny ) {
                                  for( k = 0; k < value[ keys[ key ] ].length; k++ ) {
                                      if ( filterObj.data[ j ] === value[ keys[ key ] ][ k ] ) {
                                          paramResult = true;
                                          break;
                                      }
                                  }
                              } else {
                                  if ( value[ keys[ key ] ].length !== filterObj.data.length ) {
                                      paramResult = false;
                                  } else {
                                      for( k = 0; k < value[ keys[ key ] ].length; k++ ) {
                                          if ( filterObj.data[ k ] !== value[ keys[ key ] ][ k ] ) {
                                              paramResult = false;
                                              break;
                                          }
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
                if( Array.isArray( value[ keys[ key ] ] ) ) {
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
    return Promise.resolve( filtered );
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
dm.add({
    name: "newStore",
    type: "SessionLocal"
    settings: {
        recordId: "customID",
        storageType: "localStorage"
    }
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
        @returns {Object} A Promise
        @example
        var dm = AeroGear.DataManager([{ name: "tasks", type: "SessionLocal" }]).stores[ 0 ];

        dm.open()
            .then( function() {

                // save one record
                dm.save({
                        title: "Created Task",
                        date: "2012-07-13",
                        ...
                    })
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );

                // save multiple records
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
                    ])
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );

                // Update an existing piece of data
                var toUpdate = dm.read()[ 0 ];
                toUpdate.data.title = "Updated Task";
                dm.save( toUpdate )
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );
            });
     */
    save: {
        value: function( data, options ) {
            // Call the super method
            var that = this,
                reset = options && options.reset ? options.reset : false,
                oldData = window[ this.getStoreType() ].getItem( this.getStoreKey() );

            return AeroGear.DataManager.adapters.Memory.prototype.save.apply( this, [ arguments[ 0 ], { reset: reset } ] )
                .then( function( newData ) {
                    // Sync changes to persistent store
                    try {
                        window[ that.getStoreType() ].setItem( that.getStoreKey(), JSON.stringify( that.encrypt( newData ) ) );
                    } catch( error ) {
                        oldData = oldData ? JSON.parse( oldData ) : [];

                        return AeroGear.DataManager.adapters.Memory.prototype.save.apply( that, [ oldData, { reset: reset } ] )
                            .then( function() {
                                return Promise.reject();
                            });
                    }
                    return newData;
                });
        }, enumerable: true, configurable: true, writable: true
    },
    /**
        Removes data from the store
        @method
        @memberof AeroGear.DataManager.adapters.SessionLocal
        @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
        @returns {Object} A Promise
        @example
        var dm = AeroGear.DataManager([{ name: "tasks", type: "SessionLocal" }]).stores[ 0 ];

        dm.open()
            .then( function() {

                // Delete a record
                dm.remove( 1, )
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );

                // Remove all data
                dm.remove( undefined )
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );

                // Delete all remaining data from the store
                dm.remove()
                    .then( function( newData ) { ... } )
                    .catch( function( error ) { ... } );
            });
     */
    remove: {
        value: function( toRemove ) {
            var that = this;

            return AeroGear.DataManager.adapters.Memory.prototype.remove.apply( this, arguments )
                .then( function( newData ) {
                    // Sync changes to persistent store
                    window[ that.getStoreType() ].setItem( that.getStoreKey(), JSON.stringify( that.encrypt( newData ) ) );
                });
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
    @param {Boolean} [settings.auto=true] - set to 'false' to disable 'auto-connect' for read/remove/save/filter
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
        type: "IndexedDB"
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
    var database,
        auto = ( settings.auto === undefined || settings.auto ) ? true : false;

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
                this.open()
                    .then( function( value, status ) {
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
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "IndexedDB"
    });

    dm.stores.newStore.open()
        .then(function() { ... })
        .catch(function(error) { ... });
*/
AeroGear.DataManager.adapters.IndexedDB.prototype.open = function() {

    var request, database,
        that = this,
        storeName = this.getStoreName(),
        recordId = this.getRecordId();

    return new Promise( function( resolve, reject ) {
        // Attempt to open the indexedDB database
        request = window.indexedDB.open( storeName );

        request.onsuccess = function( event ) {
            database = event.target.result;
            that.setDatabase( database );
            resolve( database );
        };

        request.onerror = function( event ) {
            reject( event );
        };

        // Only called when the database doesn't exist and needs to be created
        request.onupgradeneeded = function( event ) {
            database = event.target.result;
            database.createObjectStore( storeName, { keyPath: recordId } );
        };
    });
};


/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "IndexedDB"
    });

    dm.stores.newStore.open()
        .then( function() {

            // read all records
            dm.stores.test1.read( undefined )
                .then( function( data ) { ... } )
                .catch( function( error ) { ... } );

            // read a record with a particular id
            dm.stores.test1.read( 5 )
                .then( function( data ) { ... } )
                .catch( function( error ) { ... } );
        });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.read = function( id ) {

    var transaction, objectStore, cursor, request,
        that = this,
        data = [],
        storeName = this.getStoreName();

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function( database ) {

            if( !database.objectStoreNames.contains( storeName ) ) {
                return resolve( [] );
            }

            transaction = database.transaction( storeName );
            objectStore = transaction.objectStore( storeName );

            if( id ) {
                request = objectStore.get( id );

                request.onsuccess = function() {
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

            transaction.oncomplete = function() {
                resolve( that.decrypt( data ));
            };

            transaction.onerror = function( event ) {
                reject( event );
            };
        });
    });
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - additional options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "IndexedDB"
    });

    dm.stores.newStore.open()
        .then( function() {

            // save one record
            dm.stores.newStore.save( { "id": 3, "name": "Grace", "type": "Little Person" })
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // save multiple Records
            dm.stores.newStore.save([
                    { "id": 3, "name": "Grace", "type": "Little Person" },
                    { "id": 4, "name": "Graeham", "type": "Really Little Person" }
                ])
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.save = function( data, options ) {
    options = options || {};

    var transaction, objectStore,
        that = this,
        storeName = this.getStoreName(),
        i = 0;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function( database ) {
            transaction = database.transaction( storeName, "readwrite" );
            objectStore = transaction.objectStore( storeName );

            if( options.reset ) {
                objectStore.clear();
            }

            if( Array.isArray( data ) ) {
                for( i; i < data.length; i++ ) {
                    objectStore.put( this.encrypt( data[ i ] ) );
                }
            } else {
                objectStore.put( this.encrypt( data ) );
            }

            transaction.oncomplete = function() {
                that.read()
                    .then( function( newData ) {
                        resolve( newData );
                    })
                    .catch( function() {
                        reject( data, status );
                    });
            };

            transaction.onerror = function( event ) {
                reject( event );
            };
        });
    });
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "IndexedDB"
    });

    dm.stores.newStore.open()
        .then( function() {

        // remove one record
        dm.stores.newStore.remove( 1 )
            .then( function( newData ) { ... } )
            .catch( function( error ) { ... } );

        // save multiple Records
        dm.stores.newStore.remove( undefined )
            .then( function( newData ) { ... } )
            .catch( function( error ) { ... } );
      });
 */
AeroGear.DataManager.adapters.IndexedDB.prototype.remove = function( toRemove ) {

    var objectStore, transaction,
        that = this,
        database = this.getDatabase(),
        storeName = this.getStoreName(),
        i = 0;

    return new Promise( function( resolve, reject) {
        that.run.call( that, function() {
            transaction = database.transaction( storeName, "readwrite" );
            objectStore = transaction.objectStore( storeName );

            if( !toRemove ) {
               objectStore.clear();
            } else  {
               toRemove = Array.isArray( toRemove ) ? toRemove: [ toRemove ];

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

            transaction.oncomplete = function() {
                that.read()
                    .then( function( newData ) {
                        resolve( newData );
                    })
                    .catch( function( error ) {
                        reject( error );
                    });
            };

            transaction.onerror = function( event ) {
               reject( event );
            };
        });
    });
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "IndexedDB"
    });

    dm.stores.newStore.open()
        .then( function() {

        dm.stores.test1.filter( { "name": "Lucas" }, true )
            .then( function( filteredData ) { ... } )
            .catch( function( error ) { ... } );
    });

 */
AeroGear.DataManager.adapters.IndexedDB.prototype.filter = function( filterParameters, matchAny ) {

    var that = this;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function() {
            this.read()
                .then( function( data ) {
                    AeroGear.DataManager.adapters.Memory.prototype.save.call( that, data, true );
                    AeroGear.DataManager.adapters.Memory.prototype.filter.call( that, filterParameters, matchAny ).then( function( filteredData ) {
                        resolve( filteredData );
                    });
                })
                .catch( function( error ) {
                    reject( error );
                });
        });
    });
};

/**
    Close the current store
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store and then delete a record
    dm.add({
        name: "newStore",
        type: "IndexedDB"
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
    @param {Boolean} [settings.auto=true] - set to 'false' to disable 'auto-connect' for read/remove/save/filter
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
        type: "WebSQL"
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
        auto = ( settings.auto === undefined || settings.auto ) ? true : false;

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
                this.open()
                    .then( function() {
                        callback.call( that, database );
                    })
                    .catch( function() {
                        throw "Database not opened";
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
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        type: "WebSQL"
    });

    dm.stores.newStore.open()
        .then(function() { ... })
        .catch(function(error) { ... });
*/
AeroGear.DataManager.adapters.WebSQL.prototype.open = function() {

    var database,
        that = this,
        version = "1",
        databaseSize = 2 * 1024 * 1024,
        recordId = this.getRecordId(),
        storeName = this.getStoreName(),
        success, error;

    // Do some creation and such
    database = window.openDatabase( storeName, version, "AeroGear WebSQL Store", databaseSize );

    return new Promise( function( resolve, reject ) {
        error = function( transaction, error ) {
            reject( error );
        };

        success = function() {
            that.setDatabase( database );
            resolve( database );
        };

        database.transaction( function( transaction ) {
            transaction.executeSql( "CREATE TABLE IF NOT EXISTS '" + storeName + "' ( " + recordId + " REAL UNIQUE, json)", [], success, error );
        });
    });
};

/**
 This method is just for sake of API symmetry with other DataManagers. It immediately returns.
 @private
 @augments base
 */
AeroGear.DataManager.adapters.WebSQL.prototype.close = function() {
};

/**
    Read data from a store
    @param {String|Number} [id] - Usually a String or Number representing a single "record" in the data set or if no id is specified, all data is returned
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        type: "WebSQL"
    });

    dm.stores.newStore.open()
        .then( function() {

        // read all records
        dm.stores.test1.read( undefined )
            .then( function( data ) { ... } )
            .catch( function( error ) { ... } );

        // read a record with a particular id
        dm.stores.test1.read( 5 )
            .then( function( data ) { ... } )
            .catch( function( error ) { ... } );
    });

 */
AeroGear.DataManager.adapters.WebSQL.prototype.read = function( id ) {

    var that = this,
        data = [],
        params = [],
        storeName = this.getStoreName(),
        database = this.getDatabase(),
        sql, success, error,
        i = 0;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function() {

            error = function( transaction, error ) {
                reject( error );
            };

            success = function( transaction, result ) {
                var rowLength = result.rows.length;
                for( i; i < rowLength; i++ ) {
                    data.push( JSON.parse( result.rows.item( i ).json ) );
                }
                resolve( that.decrypt( data ) );
            };

            sql = "SELECT * FROM '" + storeName + "'";

            if( id ) {
                sql += " WHERE ID = ?";
                params = [ id ];
            }

            database.transaction( function( transaction ) {
                transaction.executeSql( sql, params, success, error );
            });
        });
    });
};

/**
    Saves data to the store, optionally clearing and resetting the data
    @param {Object|Array} data - An object or array of objects representing the data to be saved to the server. When doing an update, one of the key/value pairs in the object to update must be the `recordId` you set during creation of the store representing the unique identifier for a "record" in the data set.
    @param {Object} [options={}] - additional options
    @param {Boolean} [options.reset] - If true, this will empty the current data and set it to the data being saved
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an WebSQL store
    dm.add({
        name: "newStore",
        type: "WebSQL"
    });

    dm.stores.newStore.open()
    .then( function() {

        // save one record
        dm.stores.newStore.save( { "id": 3, "name": "Grace", "type": "Little Person" })
            .then( function( newData ) { ... } )
            .catch( function( error ) { ... } );

        // save multiple Records
        dm.stores.newStore.save([
                { "id": 3, "name": "Grace", "type": "Little Person" },
                { "id": 4, "name": "Graeham", "type": "Really Little Person" }
            ])
            .then( function( newData ) { ... } )
            .catch( function( error ) { ... } );
    });
 */
AeroGear.DataManager.adapters.WebSQL.prototype.save = function( data, options ) {
    options = options || {};

    var that = this,
        recordId = this.getRecordId(),
        storeName = this.getStoreName(),
        error, success;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function( database ) {

            error = function( transaction, error ) {
                reject( error );
            };

            success = function() {
                that.read()
                    .then( function( newData ) {
                        resolve( newData );
                    })
                    .catch( function( error ) {
                        reject( error );
                    });
            };

            data = Array.isArray( data ) ? data : [ data ];

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
        });
    });
};

/**
    Removes data from the store
    @param {String|Object|Array} toRemove - A variety of objects can be passed to remove to specify the item or if nothing is provided, all data is removed
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "WebSQL"
    });

    dm.stores.newStore.open()
        .then( function() {

            // remove one record
            dm.stores.newStore.remove( 1 )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );

            // save multiple Records
            dm.stores.newStore.remove( undefined )
                .then( function( newData ) { ... } )
                .catch( function( error ) { ... } );
        });

 */
AeroGear.DataManager.adapters.WebSQL.prototype.remove = function( toRemove ) {

    var that = this,
        storeName = this.getStoreName(),
        sql, success, error,
        i = 0;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function( database ) {

            error = function( transaction, error ) {
                reject( error );
            };

            success = function() {
                that.read()
                    .then( function( newData ) {
                        resolve( newData );
                    })
                    .catch( function( error ) {
                        reject( error );
                    });
            };

            sql = "DELETE FROM '" + storeName + "'";

            if( !toRemove ) {
                // remove all
                database.transaction( function( transaction ) {
                    transaction.executeSql( sql, [], success, error );
                });
            } else {
                toRemove = Array.isArray( toRemove ) ? toRemove: [ toRemove ];
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
        });
    });
};

/**
    Filter the current store's data
    @param {Object} [filterParameters] - An object containing key/value pairs on which to filter the store's data. To filter a single parameter on multiple values, the value can be an object containing a data key with an Array of values to filter on and its own matchAny key that will override the global matchAny for that specific filter parameter.
    @param {Boolean} [matchAny] - When true, an item is included in the output if any of the filter parameters is matched.
    @return {Object} A Promise
    @example
    // Create an empty DataManager
    var dm = AeroGear.DataManager();

    // Add an IndexedDB store
    dm.add({
        name: "newStore",
        type: "WebSQL"
    });

    dm.stores.newStore.open()
        .then( function() {

        dm.stores.test1.filter( { "name": "Lucas" }, true )
            .then( function( filteredData ) { ... } )
            .catch( function( error ) { ... } );
    });
 */
AeroGear.DataManager.adapters.WebSQL.prototype.filter = function( filterParameters, matchAny ) {

    var that = this;

    return new Promise( function( resolve, reject ) {
        that.run.call( that, function() {
            this.read()
                .then( function( data ) {
                    AeroGear.DataManager.adapters.Memory.prototype.save.call( that, data, true );
                    AeroGear.DataManager.adapters.Memory.prototype.filter.call( that, filterParameters, matchAny ).then( function( filteredData ) {
                        resolve( filteredData );
                    });
                })
                .catch( function( error ) {
                    reject( error );
                });
        });
    });
};

/**
    Validate this adapter and add it to AeroGear.DataManager.validAdapters if valid
*/
AeroGear.DataManager.validateAdapter( "WebSQL", AeroGear.DataManager.adapters.WebSQL );

/**
    The AeroGear.Notifier namespace provides a messaging API. Through the use of adapters, this library provides common methods like connect, disconnect, subscribe, unsubscribe and publish.
    @deprecated since 2.1.0 and will be removed in a future release.
    @status Deprecated
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
    The Base Notifier adapter that all other Notifier adapters( except SimplePush ) will extend from.
    Not to be Instantiated directly
*/

AeroGear.Notifier.adapters.base = function( clientName, settings ) {
    if ( this instanceof AeroGear.Notifier.adapters.base ) {
        throw "Invalid instantiation of base class AeroGear.Notifier.adapters.base";
    }

    settings = settings || {};

    var connectURL = settings.connectURL || "",
        channels = settings.channels || [],
        autoConnect = !!settings.autoConnect || channels.length,
        state = AeroGear.Notifier.CONNECTING,
        name = clientName,
        client = null;

    // Privileged methods
    /**
        Returns the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.getConnectURL = function() {
        return connectURL;
    };

    /**
        Set the value of the private connectURL var
        @private
        @augments AeroGear.Notifier.adapters.base
        @param {String} url - New connectURL for this client
     */
    this.setConnectURL = function( url ) {
        connectURL = url;
    };

    /**
        Returns the value of the private channels var
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.getChannels = function() {
        return channels;
    };

    /**
        Adds a channel to the set
        @param {Object} channel - The channel object to add to the set
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.addChannel = function( channel ) {
        channels.push( channel );
    };

    /**
        Check if subscribed to a channel
        @param {String} address - The address of the channel object to search for in the set
        @private
        @augments AeroGear.Notifier.adapters.base
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
        @augments AeroGear.Notifier.adapters.base
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
        @augments AeroGear.Notifier.adapters.base
     */
    this.getState = function() {
        return state;
    };

    /**
        Sets the value of the private state var
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.setState = function( newState ) {
        state = newState;
    };

    /**
        Returns the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.getClient = function() {
        return client;
    };

    /**
        Sets the value of the private client var
        @private
        @augments AeroGear.Notifier.adapters.base
     */
    this.setClient = function( newClient ) {
        client = newClient;
    };

    // Handle auto-connect.
    // for stompws ONLY - If Login or Password are needed, autoConnect won't happen
    if ( ( autoConnect || channels.length ) && ( !settings.login && !settings.password ) ) {
        this.connect({
            url: connectURL,
            onConnect: settings.onConnect,
            onDisconnect: settings.onDisconnect, // for Vertx
            onConnectError: settings.onConnectError,
            onMessage: settings.onMessage // for mqttws
        });
    }
};

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
        var channel, updates, storage;
        if ( message.messageType === "register" && message.status === 200 ) {
            channel = {
                channelID: message.channelID,
                version: message.version,
                state: "used",
                pushEndpoint: message.pushEndpoint
            };
            pushStore.channels = this.updateChannel( pushStore.channels, channel );
            this.setPushStore( pushStore );

            // Send the push endpoint to the client for app registration
            channel.pushEndpoint = message.pushEndpoint;

            // Trigger registration success callback
            jQuery( navigator.push ).trigger( jQuery.Event( message.channelID + "-success", {
                target: {
                    result: channel.pushEndpoint
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
            storage = JSON.parse( localStorage.getItem( "ag-push-store" ) );

            // Notifications could come in a batch so process all
            for ( var i = 0, updateLength = updates.length; i < updateLength; i++ ) {
                // Find the pushEndpoint for this updates channelID
                var chnl = storage.channels.filter( function( chanl ) {
                    return chanl.channelID === updates[ i ].channelID;
                });

                updates[ i ].pushEndpoint = chnl ? chnl[ 0 ].pushEndpoint : "";
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
                channels[ i ].pushEndpoint = channel.pushEndpoint;
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
    @param {Array} [options.protocols_whitelist] -  A list protocols that may be used by SockJS. By default all available protocols will be used, which is equivalent to supplying: "['websocket', 'xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling']"
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
        client = this.getUseNative() ? new WebSocket( options.url || this.getConnectURL() ) : new SockJS( options.url || this.getConnectURL(), undefined, options );

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
    @param {Object|Array} channels - a channel object or array of channel objects to which this client can subscribe. At a minimum, each channel should contain a requestObject which will eventually contain the subscription success callback. Reused channels may also contain channelID and other metadata.
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

    channels = Array.isArray( channels ) ? channels : [ channels ];
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
                channels[ i ].pushEndpoint = pushStore.channels[ index ].pushEndpoint;

                // Trigger the registration event since there will be no register message
                setTimeout((function(channel) {
                    return function() {
                        jQuery( navigator.push ).trigger( jQuery.Event( channel.channelID + "-success", {
                            target: {
                                result: channel.pushEndpoint
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
    var chan,
        client = this.getClient(),
        storage = JSON.parse( localStorage.getItem( "ag-push-store" ) );

    channels = Array.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        chan = storage.channels.filter( function( item ){ return item.pushEndpoint === channels[ i ]; });
        client.send( '{"messageType": "unregister", "channelID": "' + chan[ 0 ].channelID + '"}');
    }
};

/**
    The vertx adapter is the default type used when creating a new notifier client. It uses the vert.x bus and underlying SockJS implementation for messaging.
    @deprecated since 2.1.0 and will be removed in a future release.
    @status Deprecated
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
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
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

    AeroGear.Notifier.adapters.base.apply( this, arguments );

    // Private Instance vars
    var type = "vertx";
};

// Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options={}] - Options to pass to the connect method
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created.
    @param {Array} [options.protocols_whitelist] -  A list protocols that may be used by SockJS. By default all available protocols will be used, which is equivalent to supplying: "['websocket', 'xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling']"
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
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
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
        bus = new vertx.EventBus( options.url || this.getConnectURL(), options );

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

    this.setClient( bus );
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
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
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
    var bus = this.getClient();
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
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
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
    var bus = this.getClient();

    if ( reset ) {
        this.unsubscribe( this.getChannels() );
    }

    channels = Array.isArray( channels ) ? channels : [ channels ];
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
    var bus = this.getClient(),
        thisChannels = this.getChannels();

    channels = Array.isArray( channels ) ? channels : [ channels ];
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
    var bus = this.getClient();

    if ( typeof message === Boolean && !publish ) {
        publish = message;
        message = "";
    }
    message = message || "";

    bus[ publish ? "publish" : "send" ]( channel, message );
};

/**
    The stomp adapter uses an underlying stomp.js implementation for messaging.
    @deprecated since 2.1.0 and will be removed in a future release.
    @status Deprecated
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

    AeroGear.Notifier.adapters.base.apply( this, arguments );

    // Private Instance vars
    var type = "stompws";
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

    channels = Array.isArray( channels ) ? channels : [ channels ];
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

    channels = Array.isArray( channels ) ? channels : [ channels ];
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

/**
    The mqttws adapter uses MQTT over WebSockets for messaging.
    @deprecated since 2.1.0 and will be removed in a future release.
    @status Deprecated
    @constructs AeroGear.Notifier.adapters.mqttws
    @param {String} clientName - The name used to reference this particular notifier client
    @param {Object} [settings={}] - The settings to be passed to the adapter
    @param {Boolean} [settings.autoConnect=false] - Automatically connect the client to the connectURL on creation. This option is ignored and a connection is automatically established if channels are provided as the connection is necessary prior to channel subscription
    @param {String} [settings.connectURL=""] - Defines the URL for connecting to the messaging service
    @param {Function} [settings.onConnect] - Callback to be executed when a connection is established if autoConnect === true
    @param {Function} [settings.onConnectError] - Callback to be executed when connecting to a service is unsuccessful if autoConnect === true
    @param {Function} [settings.onMessage] - Callback to be executed when a message is received
    @param {Array} [settings.channels=[]] - A set of channel objects to which this client can subscribe. Each object should have a String address
    @returns {Object} The created notifier client
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global"
    };

    // Add an mqttws client with all the settings
    notifier.add({
        name: "client1",
        settings: {
            autoConnect: true,
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onMessage: function ( message ) {
                console.log( message.destinationName + " " + message.payloadString );
            },
            channels: [ channelObject ]
        }
    });
 */
AeroGear.Notifier.adapters.mqttws = function( clientName, settings ) {
    // Allow instantiation without using new
    if ( !( this instanceof AeroGear.Notifier.adapters.mqttws ) ) {
        return new AeroGear.Notifier.adapters.mqttws( clientName, settings );
    }

    settings = settings || {};

    AeroGear.Notifier.adapters.base.apply( this, arguments );

    // Private Instance vars
    var type = "mqttws",
        clientId = settings.clientId || "agClientId";

    // Privileged methods
    /**
        Returns the value of the private clientId var
        @private
        @augments mqttws
     */
    this.getClientId = function() {
        return clientId;
    };

    /**
        Set the value of the private clientId var
        @private
        @augments mqttws
        @param {String} id - New clientId for this client
     */
    this.setClientId = function( id ) {
        clientId = id;
    };

    /**
        Process the connect options
        @param {Object} connectOptions - The connect options to process
        @private
        @augments mqttws
     */
    this.processConnectOptions = function( connectOptions ) {
        if ( connectOptions.onConnect ) {
            connectOptions.onSuccess = connectOptions.onConnect;
            delete connectOptions.onConnect;
        }

        if ( connectOptions.onConnectError ) {
            connectOptions.onFailure = connectOptions.onConnectError;
            delete connectOptions.onConnectError;
        }

        if ( connectOptions.login ) {
            connectOptions.userName = connectOptions.login;
            delete connectOptions.login;
        }

        if ( connectOptions.url ) {
            delete connectOptions.url;
        }

        if ( connectOptions.clientId ) {
            delete connectOptions.clientId;
        }

        if ( connectOptions.onMessage ) {
            delete connectOptions.onMessage;
        }
        return connectOptions;
    };

    /**
        Process a URL
        @param {String} url - The url to process
        @private
        @augments mqttws
     */
    this.processURL = function ( url ) {
        var processedURL = {},
            urlParts =  url.split( '/' ),
            protocol = urlParts[ 0 ].split( ':' )[ 0 ],
            domainParts = urlParts[ 2 ].split( ':' ),
            // default path is /mqtt
            path = "/" + ( urlParts[ 3 ] || "mqtt" );

        processedURL.hostname = domainParts[ 0 ];
        processedURL.port = Number( domainParts[ 1 ] ) || ( protocol === 'wss' ? 443 : 80 );
        processedURL.path = path;

        return processedURL;
    };
};

//Public Methods
/**
    Connect the client to the messaging service
    @param {Object} [options={}] - Options to pass to the connect method
    @param {String} [options.url] - The URL for the messaging service. This url will override and reset any connectURL specified when the client was created
    @param {Number} [options.mqttVersion] - The MQTT protocol version. Should be 3 or 4.
    @param {Number} [options.timeout] - If the connect has not succeeded within this number of seconds, it is deemed to have failed
    @param {String} [options.login] - Authentication login name for this connection
    @param {String} [options.password] - Authentication password for this connection
    @param {Number} [options.keepAliveInterval] - The server disconnects this client if there is no activity for this number of seconds
    @param {Messaging.Message} [options.willMessage] - Sent by the server when the client disconnects abnormally
    @param {Boolean} [options.cleanSession] - If true(default) the client and server persistent state is deleted on successful connect
    @param {Boolean} [options.useSSL] - If present and true, use an SSL Websocket connection
    @param {Function} [options.onConnect] - Callback to be executed when a connection is established
    @param {Function} [options.onConnectError] - Callback to be executed when connecting to a service is unsuccessful
    @param {Function} [settings.onMessage] - Callback to be executed when a message is received
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Add an mqtt client
    notifier.add({
        name: "client1",
        settings: {
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onMessage: function ( message ) {
                console.log( message.destinationName + " " + message.payloadString );
            }
        }
    });

    // Connect to the vertx messaging service
    notifier.clients.client1.connect();

 */
AeroGear.Notifier.adapters.mqttws.prototype.connect = function( options ) {
    options = options || {};
    var that = this,
        onConnectCallback = options.onConnect,
        onConnectErrorCallback = options.onConnectError,
        client, onConnect, onConnectError, processedURL;

    processedURL = this.processURL( options.url || this.getConnectURL() );

    client = new Paho.MQTT.Client( processedURL.hostname, processedURL.port, processedURL.path, options.clientId || this.getClientId() );

    if ( options.onMessage ) {
        client.onMessageArrived = options.onMessage;
    }

    options.onConnect = function() {
        // Make a Copy of the channel array instead of a reference.
        var channels = that.getChannels().slice( 0 );

        that.setState( AeroGear.Notifier.CONNECTED );

        that.subscribe( channels, true );

        if ( onConnectCallback ) {
            onConnectCallback.apply( this, arguments );
        }
    };

    options.onConnectError = function() {
        that.setState( AeroGear.Notifier.DISCONNECTED );
        if ( onConnectErrorCallback ) {
            onConnectErrorCallback.apply( this, arguments );
        }
    };

    client.connect( this.processConnectOptions( options ) );
    this.setClient( client );
};

/**
    Disconnect the client from the messaging service
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Add an mqtt client
    notifier.add({
        name: "client1",
        settings: {
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onMessage: function( message ) {
                console.log( message.destinationName + " " + message.payloadString );
            }
        }
    });

    // Connect to the vertx messaging service
    notifier.clients.client1.connect();

    // Disconnect from the vertx messaging service
    notifier.clients.client1.disconnect();

 */
AeroGear.Notifier.adapters.mqttws.prototype.disconnect = function() {
    var client = this.getClient();
    if ( this.getState() === AeroGear.Notifier.CONNECTED ) {
        this.setState( AeroGear.Notifier.DISCONNECTING );
        client.disconnect();
    }
};

/**
    Subscribe this client to a new channel
    @param {Object|Array} channels - A channel object or array of channel objects to which this client can subscribe. Each object should have a String address as well as an optional subscribeOptions object which is used to control the subscription
    @param {Boolean} [reset] - If true, remove all channels from the set and replace with the supplied channel(s)
    @example
    // Create an empty Notifier
    var notifier = AeroGear.Notifier();

    // Create a channel object and the channel callback function
    var channelObject = {
        address: "org.aerogear.messaging.global",
        subscribeOptions: {
            qos: 2,
            onSuccess: function() {
                console.log( 'Subscription was successful' );
            },
            onFailure: function() {
                console.log( 'Subscription failed' );
            },
            timeout: 60
        }
    };

    // Add a mqtt client with autoConnect === true and no channels
    notifier.add({
        name: "client1",
        settings: {
            autoConnect: true,
            connectURL: window.location.protocol + '//' + window.location.host + "/eventbus",
            onConnect: function() {
                console.log( "connected" );
            },
            onConnectError: function() {
                console.log( "connection error" );
            },
            onMessage: function( message ) {
                console.log( message.destinationName + " " + message.payloadString );
            }
        }
    });

    // Subscribe to a channel
    notifier.clients.client1.subscribe( channelObject );

    // Subscribe to multiple channels at once
    notifier.clients.client1.subscribe([
        {
            address: "newChannel",
            subscribeOptions: {...}
        },
        {
            address: "anotherChannel",
            subscribeOptions: { ... }
        }
    ]);

    // Subscribe to a channel, but first unsubscribe from all currently subscribed channels by adding the reset parameter
    notifier.clients.client1.subscribe({
            address: "newChannel",
            subscribeOptions: { ... }
        }, true );
 */
AeroGear.Notifier.adapters.mqttws.prototype.subscribe = function( channels, reset ) {
    var client = this.getClient();

    if ( reset ) {
        this.unsubscribe( this.getChannels() );
    }

    channels = Array.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        this.addChannel( channels[ i ] );
        client.subscribe( channels[ i ].address, channels[ i ].subscribeOptions || {} );
    }
};

/**
    Unsubscribe this client from a channel
    @param {Object|Array} channels - A channel object or a set of channel objects to which this client nolonger wishes to subscribe. Each object should have a String address and an optional unsubscribeOptions object
    @example
    // Unsubscribe from a previously subscribed channel
    notifier.clients.client1.unsubscribe(
        {
            address: "org.aerogear.messaging.global",
            unsubscribeOptions: {
                onSuccess: function() {
                    console.log( 'Unusubscribe was successful' );
                },
                onFailure: function() {
                    console.log( 'Unsubscribe failed' );
                },
                timeout: 20
            }
        }
    );

    // Unsubscribe from multiple channels
    notifier.clients.client1.unsubscribe([
        {
            address: "newChannel",
            unsubscribeOptions: { ... }
        },
        {
            address: "anotherChannel"
        }
    ]);
 */
AeroGear.Notifier.adapters.mqttws.prototype.unsubscribe = function( channels ) {
    var client = this.getClient();

    channels = Array.isArray( channels ) ? channels : [ channels ];
    for ( var i = 0; i < channels.length; i++ ) {
        client.unsubscribe( channels[ i ].address, channels[ i ].unsubscribeOptions || {} );
        this.removeChannel( channels[ i ] );
    }
};

/**
    Send a message to a particular channel
    @param {String} channel - The channel to which to send the message
    @param {String|Object} [message=""] - The message object to send
    @param {Object} [sendOptions] - The send options to send
    @example
    // Send an empty message to a channel
    notifier.clients.client1.send( "test.address" );

    // Send a "Hello" message to a channel
    notifier.clients.client1.send( "test.address", "Hello" );
 */
AeroGear.Notifier.adapters.mqttws.prototype.send = function( channel, message, sendOptions ) {
    var client = this.getClient();
    message = new Paho.MQTT.Message( message || "" );
    message.destinationName = channel;

    if ( sendOptions ) {
        if ( sendOptions.qos ) {
            message.qos = sendOptions.qos;
        }
        if ( sendOptions.retained ) {
            message.retained = sendOptions.retained;
        }
        if ( sendOptions.duplicate ) {
            message.duplicate = sendOptions.duplicate;
        }
    }

    client.send( message );
};

(function( AeroGear, undefined ) {
    /**
        The UnifiedPushClient object is used to perfom register and unregister operations against the AeroGear UnifiedPush server.
        @status Experimental
        @constructs AeroGear.UnifiedPushClient
        @param {String} variantID - the id representing the mobile application variant
        @param {String} variantSecret - the secret for the mobile application variant
        @param {String} pushServerURL - the location of the UnifiedPush server e.g. http(s)//host:port/context
        @returns {Object} The created unified push server client
        @example
        // Create the UnifiedPush client object:
        var client = AeroGear.UnifiedPushClient(
            "myVariantID",
            "myVariantSecret",
            "http://SERVER:PORT/CONTEXT"
        );

        // assemble the metadata for the registration:
        var metadata = {
            deviceToken: "http://server.com/simplePushEndpoint",
            alias: "some_username",
            categories: [ "email" ]
        };

        var settings = {};

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

        pushServerURL = pushServerURL.substr(-1) === '/' ? pushServerURL : pushServerURL + '/';

        this._ajax = function( settings ) {
            return new Promise( function( resolve, reject ) {
                var header,
                    that = this,
                    request = new XMLHttpRequest();


                request.open( settings.type || "GET", settings.url, true, settings.username, settings.password );

                request.responseType = "json";
                request.setRequestHeader( "Content-Type", "application/json" );
                request.setRequestHeader( "Accept", "application/json" );

                if( settings.headers ) {
                    for ( header in settings.headers ) {
                        request.setRequestHeader( header, settings.headers[ header ] );
                    }
                }

                // Success and 400's
                request.onload = function() {
                    var status = ( request.status < 400 ) ? "success" : "error",
                        promiseValue = that._createPromiseValue( request, status );

                    if( status === "success" ) {
                        return resolve( promiseValue );
                    }

                    return reject( promiseValue );
                };

                // Network errors
                request.onerror = function() {
                    return reject( that._createPromiseValue( request, "error" ) );
                };

                // create promise arguments
                this._createPromiseValue = function( request, status ) {
                    return {
                        data: request.response,
                        statusText: request.statusText || status,
                        agXHR: request
                    };
                };

                request.send( settings.data );
            });
        };
        /**
            Performs a register request against the UnifiedPush Server using the given metadata which represents a client that wants to register with the server.
            @param {Object} settings The settings to pass in
            @param {Object} settings.metadata - the metadata for the client
            @param {String} settings.metadata.deviceToken - identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the URL of the given SimplePush server/network.
            @param {String} [settings.metadata.alias] - Application specific alias to identify users with the system. Common use case would be an email address or a username.
            @param {Array} [settings.metadata.categories] - In SimplePush this is the name of the registration endpoint. On Hybrid platforms like Apache Cordova this is used for tagging the registered client.
            @param {String} [settings.metadata.operatingSystem] - Useful on Hybrid platforms like Apache Cordova to specifiy the underlying operating system.
            @param {String} [settings.metadata.osVersion] - Useful on Hybrid platforms like Apache Cordova to specify the version of the underlying operating system.
            @param {String} [settings.metadata.deviceType] - Useful on Hybrid platforms like Apache Cordova to specify the type of the used device, like iPad or Android-Phone.
            @returns {Object} An ES6 Promise
         */
        this.registerWithPushServer = function( settings ) {
            settings = settings || {};
            var metadata = settings.metadata || {};

            // we need a deviceToken, registrationID or a channelID:
            if ( !metadata.deviceToken ) {
                throw "UnifiedPushRegistrationException";
            }

            // Make sure that settings.metadata.categories is an Array
            metadata.categories = Array.isArray( metadata.categories ) ? metadata.categories : ( metadata.categories ? [ metadata.categories ] : [] );

            return this._ajax({
                type: "POST",
                url: pushServerURL + "rest/registry/device",
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                },
                data: JSON.stringify( metadata )
            });
        };

        /**
            Performs an unregister request against the UnifiedPush Server for the given deviceToken. The deviceToken identifies the client within its PushNetwork. On Android this is the registrationID, on iOS this is the deviceToken and on SimplePush this is the URL of the given SimplePush server/network.
            @param {String} deviceToken - unique String which identifies the client that is being unregistered.
            @returns {Object} An ES6 Promise
         */
        this.unregisterWithPushServer = function( deviceToken ) {
            return this._ajax({
                type: "DELETE",
                url: pushServerURL + "rest/registry/device/" + deviceToken,
                headers: {
                    "Authorization": "Basic " + window.btoa(variantID + ":" + variantSecret)
                }
            });
        };
    };

})( AeroGear );

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
            if ( options.onConnect ) {
                options.onConnect();
            }
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
                                    requestObject: request
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
                        Add the setMessageHandler/mozSetMessageHandler function to the global navigator object
                        @status Experimental
                        @constructs navigator.setMessageHandler/navigator.mozSetMessageHandler
                        @param {String} messageType - a name or category to give the messages being received and in this implementation, likely 'push'
                        @param {Function} callback - the function to be called when a message of this type is received
                        @example
                        navigator.setMessageHandler( "push", function( message ) {
                            if ( message.channelID === mailEndpoint.channelID ) {
                                console.log("Mail Message Received");
                            }
                        });

                        or
                        // Mozilla's spec currently has the 'moz' prefix
                        navigator.mozSetMessageHandler( "push", function( message ) {
                            if ( message.channelID === mailEndpoint.channelID ) {
                                console.log("Mail Message Received");
                            }
                        });
                     */
                    navigator.setMessageHandler = navigator.mozSetMessageHandler = function( messageType, callback ) {
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

/**
    The AeroGear Differential Sync Engine.
    @status Experimental
    @constructs AeroGear.DiffSyncEngine
    @param {Object} config - A configuration
    @param {String} [config.type = "jsonPatch"] - the type of sync engine, defaults to jsonPatch
    @returns {Object} diffSyncEngine - The created DiffSyncEngine
 */
AeroGear.DiffSyncEngine = function( config ) {
    if ( !( this instanceof AeroGear.DiffSyncEngine ) ) {
        return new AeroGear.DiffSyncEngine( config );
    }

    this.lib = "DiffSyncEngine";
    this.type = config ? config.type || "jsonPatch" : "jsonPatch";

    return new AeroGear.DiffSyncEngine.adapters[ this.type ]();
};

/**
    The adapters object is provided so that adapters can be added to the AeroGear.DiffSyncEngine namespace dynamically and still be accessible to the add method
    @augments AeroGear.DiffSyncEngine
 */
AeroGear.DiffSyncEngine.adapters = {};

/**
    The diffMatchPatch adapter.
    @status Experimental
    @constructs AeroGear.DiffSyncEngine.adapters.diffMatchPatch
    @returns {Object} The created adapter
 */
AeroGear.DiffSyncEngine.adapters.diffMatchPatch = function() {
    if ( !( this instanceof AeroGear.DiffSyncEngine.adapters.diffMatchPatch ) ) {
        return new AeroGear.DiffSyncEngine.adapters.diffMatchPatch();
    }

    var stores = {
            docs: [],
            shadows: [],
            backups: [],
            edits: []
        },
        dmp = new diff_match_patch();


    /**
     * Adds a new document to this sync engine.
     *
     * @param doc the document to add.
     */
    this.addDocument = function( doc ) {
        this._saveDocument( JSON.parse( JSON.stringify( doc ) ) );
        this._saveShadow( JSON.parse( JSON.stringify( doc ) ) );
        this._saveShadowBackup( JSON.parse( JSON.stringify( doc ) ), 0 );
    };

    /**
     * Performs the client side of a differential sync.
     * When a client makes an update to it's document, it is first diffed against the shadow
     * document. The result of this is an {@link Edits} instance representing the changes.
     * There might be pending edits that represent edits that have not made it to the server
     * for some reason (for example packet drop). If a pending edit exits the contents (the diffs)
     * of the pending edit will be included in the returned Edits from this method.
     *
     * @param doc the updated document.
     * @returns {object} containing the diffs that between the clientDoc and it's shadow doc.
     */
    this.diff = function( doc ) {
        var diffDoc, patchMsg, docContent, shadowContent, pendingEdits,
            shadow = this._readData( doc.id, "shadows" )[ 0 ];

        if ( typeof doc.content === "string" ) {
            docContent = doc.content;
            shadowContent = shadow.content;
        } else {
            docContent = JSON.stringify( doc.content );
            shadowContent = JSON.stringify( shadow.content );
        }

        patchMsg = {
            msgType: "patch",
            id: doc.id,
            clientId: shadow.clientId,
            edits: [{
                clientVersion: shadow.clientVersion,
                serverVersion: shadow.serverVersion,
                // currently not implemented but we probably need this for checking the client and server shadow are identical be for patching.
                checksum: '',
                diffs: this._asAeroGearDiffs( dmp.diff_main( shadowContent, docContent ) )
            }]
        };

        shadow.clientVersion++;
        shadow.content = doc.content;
        this._saveShadow( JSON.parse( JSON.stringify( shadow ) ) );

        // add any pending edits from the store
        pendingEdits = this._getEdits( doc.id );
        if ( pendingEdits && pendingEdits.length > 0 ) {
            patchMsg.edits = pendingEdits.concat( patchMsg.edits );
        }

        return patchMsg;
    };

    /**
     * Performs the client side patch process.
     *
     * @param patchMsg the patch message that is sent from the server
     *
     * @example:
     * {
     *   "msgType":"patch",
     *   "id":"12345",
     *   "clientId":"3346dff7-aada-4d5f-a3da-c93ff0ffc472",
     *   "edits":[{
     *     "clientVersion":0,
     *     "serverVersion":0,
     *     "checksum":"5f9844b21c298ea1f3ed7bf37f96e42df03395b",
     *     "diffs":[
     *       {"operation":"UNCHANGED","text":"I'm a Je"},
     *       {"operation":"DELETE","text":"di"}]
     *   }]
     * }
    */
    this.patch = function( patchMsg ) {
        // Flow is based on the server side
        // patch the shadow
        var patchedShadow = this.patchShadow( patchMsg );
        // Then patch the document
        this.patchDocument( patchedShadow );
        // then save backup shadow
        this._saveShadowBackup( patchedShadow, patchedShadow.clientVersion );

    };

    this._asAeroGearDiffs = function( diffs ) {
        return diffs.map(function( value ) {
            return {
                operation: this._asAgOperation( value[ 0 ] ),
                text: value[ 1 ]
            };
        }.bind( this ) );
    };

    this._asDiffMatchPathDiffs = function( diffs ) {
        return diffs.map( function ( value ) {
            return [this._asDmpOperation ( value.operation ), value.text];
        }.bind( this ) );
    };

    this._asDmpOperation = function( op ) {
        if ( op === "DELETE" ) {
            return -1;
        } else if ( op === "ADD" ) {
            return 1;
        }
        return 0;
    };

    this._asAgOperation = function( op ) {
        if ( op === -1 ) {
            return "DELETE";
        } else if ( op === 1 ) {
            return "ADD";
        }
        return "UNCHANGED";
    };

    this.patchShadow = function( patchMsg ) {
        // First get the shadow document for this doc.id and clientId
        var i, patched, edit,
            shadow = this.getShadow( patchMsg.id ),
            edits = patchMsg.edits;
        //Iterate over the edits of the doc
        for ( i = 0; i < edits.length; i++ ) {
            edit = edits[i];

            //Check for dropped packets?
            // edit.clientVersion < shadow.ClientVersion
            if( edit.clientVersion < shadow.clientVersion && !this._isSeeded( edit ) ) {
                // Dropped packet?  // restore from back
                shadow = this._restoreBackup( shadow, edit );
                continue;
            }

            //check if we already have this one
            // IF SO discard the edit
            // edit.serverVersion < shadow.ServerVesion
            if( edit.serverVersion < shadow.serverVersion ) {
                // discard edit
                this._removeEdit( patchMsg.id, edit );
                continue;
            }

            //make sure the versions match
            if( (edit.serverVersion === shadow.serverVersion && edit.clientVersion === shadow.clientVersion) || this._isSeeded( edit )) {
                // Good ,  Patch the shadow
                this.applyEditsToShadow( edit, shadow );
                if ( this._isSeeded( edit ) ) {
                    shadow.clientVersion = 0;
                } else if ( edit.clientVersion >= 0 ) {
                    shadow.serverVersion++;
                }
                this._saveShadow( shadow );
                this._removeEdit( patchMsg.id, edit );
            }
        }

        //console.log('patched:', shadow);
        return shadow;
    };

    // A seeded patch is when all clients start with a base document. They all send this base version as
    // part of the addDocument call. The server will respond with a patchMsg enabling the client to
    // patch it's local version to get the latest updates. Such an edit is identified by a clientVersion
    // set to '-1'.
    this._isSeeded = function( edit ) {
        return edit.clientVersion === -1;
    };

    this.applyEditsToShadow = function ( edits, shadow ) {
        var doc, diffs, patches, patchResult;

        doc = typeof shadow.content === 'string' ? shadow.content : JSON.stringify( shadow.content );
        diffs = this._asDiffMatchPathDiffs( edits.diffs );
        patches = dmp.patch_make( doc, diffs );

        patchResult = dmp.patch_apply( patches, doc );
        try {
            shadow.content = JSON.parse( patchResult[ 0 ] );
        } catch( e ) {
            shadow.content = patchResult[ 0 ];
        }
        return shadow;
    };

    this.patchDocument = function( shadow ) {
        var doc, diffs, patches, patchApplied;

        // first get the document based on the shadowdocs ID
        doc = this.getDocument( shadow.id );

        // diff the doc and shadow and patch that shizzel
        diffs = dmp.diff_main( JSON.stringify( doc.content ), JSON.stringify( shadow.content ) );

        patches = dmp.patch_make( JSON.stringify( doc.content ), diffs );

        patchApplied = dmp.patch_apply( patches, JSON.stringify( doc.content ) );

        //save the newly patched document
        doc.content = JSON.parse( patchApplied[ 0 ] );

        this._saveDocument( doc );

        //return the applied patch?
        //console.log('patches: ', patchApplied);
        return patchApplied;
    };

    this._saveData = function( data, type ) {
        data = Array.isArray( data ) ? data : [ data ];

        stores[ type ] = data;
    };

    this._readData = function( id, type ) {
        return stores[ type ].filter( function( doc ) {
            return doc.id === id;
        });
    };

    this._saveDocument = function( doc ) {
        this._saveData( doc, "docs" );
        return doc;
    };

    this._saveShadow = function( doc ) {
        var shadow = {
            id: doc.id,
            serverVersion: doc.serverVersion || 0,
            clientId: doc.clientId,
            clientVersion: doc.clientVersion || 0,
            content: doc.content
        };

        this._saveData( shadow, "shadows" );
        return shadow;
    };

    this._saveShadowBackup = function( shadow, clientVersion ) {
        var backup = { id: shadow.id, clientVersion: clientVersion, content: shadow.content };
        this._saveData( backup, "backups" );
        return backup;
    };

    this.getDocument = function( id ) {
        return this._readData( id, "docs" )[ 0 ];
    };

    this.getShadow = function( id ) {
        return this._readData( id, "shadows" )[ 0 ];
    };

    this.getBackup = function( id ) {
        return this._readData( id, "backups" )[ 0 ];
    };

    this._saveEdits = function( patchMsg ) {
        var record = { id: patchMsg.id, clientId: patchMsg.clientId, edits: patchMsg.edits};
        this._saveData( record, "edits" );
        return record;
    };

    this._getEdits = function( id ) {
        var patchMessages = this._readData( id, "edits" );

        return patchMessages.length ? patchMessages.edits : [];
    };

    this._removeEdit = function( documentId,  edit ) {
        var pendingEdits = this._readData( documentId, "edits" ), i, j, pendingEdit;
        for ( i = 0; i < pendingEdits.length; i++ ) {
            pendingEdit = pendingEdits[i];
            for ( j = 0; j < pendingEdit.edits.length; j++) {
                if ( pendingEdit.edits[j].serverVersion === edit.serverVersion && pendingEdit.edits[j].clientVersion <= edit.clientVersion) {
                    pendingEdit.edits.splice(i, 1);
                    break;
                }
            }
        }
    };

    this._removeEdits = function( documentId ) {
        var edits = this._readData( documentId, "edits" ), i;
        edits.splice(0, edits.length);
    };

    this._restoreBackup = function( shadow, edit) {
        var patchedShadow, restoredBackup,
            backup = this.getBackup( shadow.id );

        if ( edit.clientVersion === backup.clientVersion ) {

            restoredBackup = {
                id: backup.id,
                clientVersion: backup.clientVersion,
                content: backup.content
            };

            patchedShadow = this.applyEditsToShadow( edit, restoredBackup );
            restoredBackup.serverVersion++;
            this._removeEdits( shadow.id );

            return this._saveShadow( patchedShadow );
        } else {
            throw "Edit's clientVersion '" + edit.clientVersion + "' does not match the backups clientVersion '" + backup.clientVersion + "'";
        }
    };
};

/**
    The jsonPath adapter.
    @status Experimental
    @constructs AeroGear.DiffSyncEngine.adapters.jsonPatch
    @returns {Object} The created adapter
 */
AeroGear.DiffSyncEngine.adapters.jsonPatch = function() {
    if ( !( this instanceof AeroGear.DiffSyncEngine.adapters.jsonPatch ) ) {
        return new AeroGear.DiffSyncEngine.adapters.jsonPatch();
    }

    var stores = {
        docs: [],
        shadows: [],
        backups: [],
        edits: []
    };

    /**
     * Adds a new document to this sync engine.
     *
     * @param doc the document to add.
     */
    this.addDocument = function( doc ) {
        this._saveDocument( JSON.parse( JSON.stringify( doc ) ) );
        this._saveShadow( JSON.parse( JSON.stringify( doc ) ) );
        this._saveShadowBackup( JSON.parse( JSON.stringify( doc ) ), 0 );
    };

    /**
     * Performs the client side of a differential sync.
     * When a client makes an update to it's document, it is first diffed against the shadow
     * document. The result of this is an {@link Edits} instance representing the changes.
     * There might be pending edits that represent edits that have not made it to the server
     * for some reason (for example packet drop). If a pending edit exits the contents (the diffs)
     * of the pending edit will be included in the returned Edits from this method.
     *
     * @param doc the updated document.
     * @returns {object} containing the diffs that between the clientDoc and it's shadow doc.
     */
    this.diff = function( doc ) {
        var patchMsg, pendingEdits,
            shadow = this._readData( doc.id, "shadows" )[ 0 ];

        patchMsg = {
            msgType: "patch",
            id: doc.id,
            clientId: shadow.clientId,
            edits: [{
                clientVersion: shadow.clientVersion,
                serverVersion: shadow.serverVersion,
                // currently not implemented but we probably need this for checking the client and server shadow are identical be for patching.
                checksum: '',
                diffs: jsonpatch.compare( shadow.content, doc.content )
            }]
        };

        shadow.clientVersion++;
        shadow.content = doc.content;
        this._saveShadow( JSON.parse( JSON.stringify( shadow ) ) );

        // add any pending edits from the store
        pendingEdits = this._getEdits( doc.id );
        if ( pendingEdits && pendingEdits.length > 0 ) {
            patchMsg.edits = pendingEdits.concat( patchMsg.edits );
        }

        return patchMsg;
    };

    /**
     * Performs the client side patch process.
     *
     * @param patchMsg the patch message that is sent from the server
     *
     * @example:
     * {
     *   "msgType":"patch",
     *   "id":"12345",
     *   "clientId":"3346dff7-aada-4d5f-a3da-c93ff0ffc472",
     *   "edits":[{
     *     "clientVersion":0,
     *     "serverVersion":0,
     *     "checksum":"5f9844b21c298ea1f3ed7bf37f96e42df03395b",
     *     "diffs":[
     *       {"operation":"UNCHANGED","text":"I'm a Je"},
     *       {"operation":"DELETE","text":"di"}]
     *   }]
     * }
    */
    this.patch = function( patchMsg ) {
        // Flow is based on the server side
        // patch the shadow
        var patchedShadow = this.patchShadow( patchMsg );
        // Then patch the document
        this.patchDocument( patchedShadow );
        // then save backup shadow
        this._saveShadowBackup( patchedShadow, patchedShadow.clientVersion );

    };

    this.patchShadow = function( patchMsg ) {
        // First get the shadow document for this doc.id and clientId
        var i, patched, edit,
            shadow = this.getShadow( patchMsg.id ),
            edits = patchMsg.edits;
        //Iterate over the edits of the doc
        for ( i = 0; i < edits.length; i++ ) {
            edit = edits[i];

            //Check for dropped packets?
            // edit.clientVersion < shadow.ClientVersion
            if( edit.clientVersion < shadow.clientVersion && !this._isSeeded( edit ) ) {
                // Dropped packet?  // restore from back
                shadow = this._restoreBackup( shadow, edit );
                continue;
            }

            //check if we already have this one
            // IF SO discard the edit
            // edit.serverVersion < shadow.ServerVesion
            if( edit.serverVersion < shadow.serverVersion ) {
                // discard edit
                this._removeEdit( patchMsg.id, edit );
                continue;
            }

            //make sure the versions match
            if( (edit.serverVersion === shadow.serverVersion && edit.clientVersion === shadow.clientVersion) || this._isSeeded( edit )) {
                // Good ,  Patch the shadow
                this.applyEditsToShadow( edit, shadow );
                if ( this._isSeeded( edit ) ) {
                    shadow.clientVersion = 0;
                } else if ( edit.clientVersion >= 0 ) {
                    shadow.serverVersion++;
                }
                this._saveShadow( shadow );
                this._removeEdit( patchMsg.id, edit );
            }
        }

        return shadow;
    };

    // A seeded patch is when all clients start with a base document. They all send this base version as
    // part of the addDocument call. The server will respond with a patchMsg enabling the client to
    // patch it's local version to get the latest updates. Such an edit is identified by a clientVersion
    // set to '-1'.
    this._isSeeded = function( edit ) {
        return edit.clientVersion === -1;
    };

    this.applyEditsToShadow = function ( edits, shadow ) {
        var patchResult;
        // returns true or false,  should probably do something with it?
        patchResult = jsonpatch.apply( shadow.content, edits.diffs );
        return shadow;
    };

    this.patchDocument = function( shadow ) {
        var doc, diffs, patch;

        // first get the document based on the shadowdocs ID
        doc = this.getDocument( shadow.id );

        diffs = jsonpatch.compare( doc.content, shadow.content );

        patch = jsonpatch.apply( doc.content, diffs );

        //save the newly patched document,  do we save if the apply failed?
        this._saveDocument( doc );

        return patch;
    };

    this._saveData = function( data, type ) {
        data = Array.isArray( data ) ? data : [ data ];

        stores[ type ] = data;
    };

    this._readData = function( id, type ) {
        return stores[ type ].filter( function( doc ) {
            return doc.id === id;
        });
    };

    this._saveDocument = function( doc ) {
        this._saveData( doc, "docs" );
        return doc;
    };

    this._saveShadow = function( doc ) {
        var shadow = {
            id: doc.id,
            serverVersion: doc.serverVersion || 0,
            clientId: doc.clientId,
            clientVersion: doc.clientVersion || 0,
            content: doc.content
        };

        this._saveData( shadow, "shadows" );
        return shadow;
    };

    this._saveShadowBackup = function( shadow, clientVersion ) {
        var backup = { id: shadow.id, clientVersion: clientVersion, content: shadow.content };
        this._saveData( backup, "backups" );
        return backup;
    };

    this.getDocument = function( id ) {
        return this._readData( id, "docs" )[ 0 ];
    };

    this.getShadow = function( id ) {
        return this._readData( id, "shadows" )[ 0 ];
    };

    this.getBackup = function( id ) {
        return this._readData( id, "backups" )[ 0 ];
    };

    this._saveEdits = function( patchMsg ) {
        var record = { id: patchMsg.id, clientId: patchMsg.clientId, edits: patchMsg.edits};
        this._saveData( record, "edits" );
        return record;
    };

    this._getEdits = function( id ) {
        var patchMessages = this._readData( id, "edits" );

        return patchMessages.length ? patchMessages.edits : [];
    };

    this._removeEdit = function( documentId,  edit ) {
        var pendingEdits = this._readData( documentId, "edits" ), i, j, pendingEdit;
        for ( i = 0; i < pendingEdits.length; i++ ) {
            pendingEdit = pendingEdits[i];
            for ( j = 0; j < pendingEdit.edits.length; j++) {
                if ( pendingEdit.edits[j].clientVersion <= edit.clientVersion) {
                    pendingEdit.edits.splice(i, 1);
                    break;
                }
            }
        }
    };

    this._removeEdits = function( documentId ) {
        var edits = this._readData( documentId, "edits" ), i;
        edits.splice(0, edits.length);
    };

    this._restoreBackup = function( shadow, edit) {
        var patchedShadow, restoredBackup,
            backup = this.getBackup( shadow.id );

        if ( edit.clientVersion === backup.clientVersion ) {

            restoredBackup = {
                id: backup.id,
                clientVersion: backup.clientVersion,
                content: backup.content
            };

            patchedShadow = this.applyEditsToShadow( edit, restoredBackup );
            restoredBackup.serverVersion++;
            this._removeEdits( shadow.id );

            return this._saveShadow( patchedShadow );
        } else {
            throw "Edit's clientVersion '" + edit.clientVersion + "' does not match the backups clientVersion '" + backup.clientVersion + "'";
        }
    };
};

/**
    The AeroGear Differential Sync Client.
    @status Experimental
    @constructs AeroGear.DiffSyncClient
    @param {Object} config - A configuration
    @param {String} config.serverUrl - the url of the Differential Sync Server
    @param {Object} [config.syncEngine="AeroGear.DiffSyncEngine"] -
    @param {function} [config.onopen] - will be called when a connection to the sync server has been opened
    @param {function} [config.onclose] - will be called when a connection to the sync server has been closed
    @param {function} [config.onsync] - listens for "sync" events from the sync server
    @param {function} [config.onerror] - will be called when there are errors from the sync server
    @returns {object} diffSyncClient - The created DiffSyncClient
 */
AeroGear.DiffSyncClient = function ( config ) {
    if ( ! ( this instanceof AeroGear.DiffSyncClient ) ) {
        return new AeroGear.DiffSyncClient( config );
    }

    config = config || {};

    var ws,
        sendQueue = [],
        that = this,
        syncEngine = config.syncEngine || new AeroGear.DiffSyncEngine();

    if ( config.serverUrl === undefined ) {
        throw new Error( "'config.serverUrl' must be specified" );
    }

    /**
        Connects to the Differential Sync Server using WebSockets
    */
    this.connect = function() {
        ws = new WebSocket( config.serverUrl );
        ws.onopen = function ( e ) {
            if ( config.onopen ) {
                config.onopen.apply( this, arguments );
            }

            while ( sendQueue.length ) {
                var task = sendQueue.pop();
                if ( task.type === "add" ) {
                    send ( task.type, task.msg );
                } else {
                    that.sendEdits( task.msg );
                }
            }
        };
        ws.onmessage = function( e ) {
            var data, doc;

            try {
                data = JSON.parse( e.data );
            } catch( err ) {
                data = {};
            }

            if ( data ) {
                that._patch( data );
            }

            doc = that.getDocument( data.id );

            if( config.onsync ) {
                config.onsync.call( this, doc, e );
            }
        };
        ws.onerror = function( e ) {
            if ( config.onerror ) {
                config.onerror.apply( this, arguments );
            }
        };
        ws.onclose = function( e ) {
            if ( config.onclose ) {
                 config.onclose.apply( this, arguments);
            }
        };
    };

    // connect needs to be callable for implementing reconnect.
    this.connect();

    /**
        Disconnects from the Differential Sync Server closing it's Websocket connection
    */
    this.disconnect = function() {
        ws.close();
    };

    /**
        patch - an internal method to sync the data with the Sync Engine
        @param {Object} data - The data to be patched
    */
    this._patch = function( data ) {
        syncEngine.patch( data );
    };

    /**
        getDocument - gets the document from the Sync Engine
        @param {String} id - the id of the document to get
        @returns {Object} - The document from the sync engine
    */
    this.getDocument = function( id ) {
        return syncEngine.getDocument( id );
    };

    /**
        diff - an internal method to perform a diff with the Sync Server
        @param {Object} data - the data to perform a diff on
        @returns {Object} - An Object containing the edits from the Sync Engine
    */
    this._diff = function( data ) {
        return syncEngine.diff( data );
    };

    /**
        addDocument - Adds a document to the Sync Engine
        @param {Object} doc - a document to add to the sync engine
    */
    this.addDocument = function( doc ) {
        syncEngine.addDocument( doc );

        if ( ws.readyState === 0 ) {
            sendQueue.push( { type: "add", msg: doc } );
        } else if ( ws.readyState === 1 ) {
            send( "add", doc );
        }
    };

    /**
        sendEdits - an internal method to send the edits from the Sync Engine to the Sync Server
        @param {Object} edit - the edits to be sent to the server
    */
    this._sendEdits = function( edit ) {
        if ( ws.readyState === WebSocket.OPEN ) {
            //console.log( 'sending edits:', edit );
            ws.send( JSON.stringify( edit ) );
        } else {
            //console.log("Client is not connected. Add edit to queue");
            if ( sendQueue.length === 0 ) {
                sendQueue.push( { type: "patch", msg: edit } );
            } else {
                var updated = false;
                for (var i = 0 ; i < sendQueue.length; i++ ) {
                    var task = sendQueue[i];
                    if (task.type === "patch" && task.msg.clientId === edit.clientId && task.msg.id === edit.id) {
                        for (var j = 0 ; j < edit.edits.length; j++) {
                            task.msg.edits.push( edit.edits[j] );
                        }
                        updated = true;
                    }
                }
                if ( !updated ) {
                    sendQueue.push( { type: "patch", msg: edit } );
                }
            }
        }
    };

    /**
        sync - performs the Sync process
        @param {Object} data - the Data to be sync'd with the server
    */
    this.sync = function( data ) {
        var edits = that._diff( data );
        that._sendEdits( edits );
    };

    /**
        removeDoc
        TODO
    */
    this.removeDoc = function( doc ) {
        throw new Error( "Method Not Yet Implemented" );
    };

    /**
        fetch - fetch a document from the Sync Server.  Will perform a sync on it
        @param {String} docId - the id of a document to fetch from the Server
    */
    this.fetch = function( docId ) {
        var doc, edits, task;

        if ( sendQueue.length === 0 ) {
            doc = syncEngine.getDocument( docId );
            that.sync( doc );
        } else {
            while ( sendQueue.length ) {
                task = sendQueue.shift();
                if ( task.type === "add" ) {
                    send ( task.type, task.msg );
                } else {
                    that._sendEdits( task.msg );
                }
            }
        }
    };

    /**
        send
        @param {String} msgType
        @param {Object} doc
    */
    var send = function ( msgType, doc ) {
        var json = { msgType: msgType, id: doc.id, clientId: doc.clientId, content: doc.content };
        //console.log ( 'sending ' + JSON.stringify ( json ) );
        ws.send( JSON.stringify ( json ) );
    };
};
})( this );
