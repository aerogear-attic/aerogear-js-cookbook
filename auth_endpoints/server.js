/* JBoss, Home of Professional Open Source
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

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function( username, password, done ) {
        if( username === "admin" && password === "admin" ) {
            return done( null, { username: username, password: password } );
        }

        return done( null, false, "arghh");
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(username, done) {
  done(null, username);
});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function isLoggedIn( request, response, next ) {
    if( request.isAuthenticated() ) {
        return next();
    }
    response.send( 401 );
}

var secretData = [
    {
        id: "1",
        name: "Brick Tamland",
        username: "btamland",
        password: "incorrect",
        bio: "Changes all passwords to 'incorrect', so when he types his password in wrong, it says: 'Your password is incorrect'"
    },
    {
        id: "2",
        name: "John Matrix",
        username: "jmatrix",
        password: "commando",
        bio: "Like's to eat green beret's for breakfast, and he is very hungry"
    }
];

app.post("/auth/login", passport.authenticate('local'), function( req, res ) {
    res.send( 200 );
});

app.post("/auth/logout", isLoggedIn, function( req, res ) {
    req.logout();

    res.send( 200 );
});

app.post("/auth/enroll", function( req, res ) {
    res.send( 200 );
});

app.get("/secured",  isLoggedIn, function( req, res ) {
    res.send(JSON.stringify( secretData ));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
