
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var uuid = require('node-uuid');
var _ = require('lodash-node');

var app = express();

var dataz = [{
    id: uuid.v4(),
    name: "Luke",
    type: "JS Hipster"
}];

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// This will be our REST endpoints we are going to connect to

app.get( '/items', function( request, response ) {
    response.send( dataz );
});

app.get( '/items/:id', function( request, response ) {
    var item,
        id = request.params.id;

    item = dataz.filter( function( value, index, list ) {
        return value.id === id;
    });

    response.send( item );
});

app.post( '/items', function( request, response ) {
    var newData = request.body;
    newData.id = uuid.v4();
    dataz.push( newData );

    response.send( newData );
});

app.put( '/items/:id', function( request, response ) {
    var updatedData = request.body;

    dataz = dataz.map( function( value ) {
        if( updatedData.id === value.id ) {
            value = updatedData;
        }
        return value;
    });
    response.send( 204 );
});

app.delete( '/items/:id', function( request, response ) {

    var id = request.params.id;

    dataz = _.reject( dataz, function( value ) {
        return value.id === id;
    });

    response.send( 204 );
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
