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

// Some initial Data
var recipes = [
    {
        id: "1",
        title: "Crumble",
        ingredients: "300g plain flour \n\n" +
                    " 200g unsalted butter \n\n" +
                    " Knob of butter for greasing \n\n" +
                    " 450g apples, peeled, cored and cut into pieces \n\n",
        description: " 1. Preheat the oven to 180C \n\n" +
                    " 2. Place the flour and sugar in a large bowl and mix well. Taking a few cubes of butter at a time rub into the flour mixture. Keep rubbing until the mixture resembles breadcrumbs."
    },
    {
        id: "2",
        title: "Ratatouille",
        ingredients: "300g plain flour \n\n" +
                    " 2 large aubergines \n\n" +
                    " 4 small courgettes \n\n" +
                    " 2 red or yellow peppers \n\n" +
                    " 4 large ripe tomatoes \n\n" +
                    " 5 tbsp olive oil \n\n" +
                    " supermarket pack or small bunch basil \n\n" +
                    " 1 medium onion, peeled and thinly sliced \n\n" +
                    " 3 garlic cloves, peeled and crushed \n\n" +
                    " 1 tbsp red wine vinegar \n\n" +
                    " 1 tsp sugar (any kind) \n\n",
        description: " 1. Cut the aubergines in half lengthways. Place them on the board, cut side down, slice in half lengthways again and then across into 1.5cm chunks. Cut off the courgettes ends, then across into 1.5cm slices. Peel the peppers from stalk to bottom. Hold upright, cut around the stalk, then cut into 3 pieces. Cut away any membrane, then chop into bite-size chunks. \n\n" +
                    " 2. Score a small cross on the base of each tomato, then put them into a heatproof bowl. Pour boiling water over the tomatoes, leave for 20 secs, then remove. Pour the water away, replace the tomatoes and cover with cold water. Leave to cool, then peel the skin away. Quarter the tomatoes, scrape away the seeds with a spoon, then roughly chop the flesh. \n\n" +
                    " 3. Set a sauté pan over medium heat and when hot, pour in 2 tbsp olive oil. Brown the aubergines for 5 mins on each side until the pieces are soft. Set them aside and fry the courgettes in another tbsp oil for 5 mins, until golden on both sides. Repeat with the peppers. Don’t overcook the vegetables at this stage, as they have some more cooking left in the next step. \n\n" +
                    " 4. Tear up the basil leaves and set aside. Cook the onion in the pan for 5 mins. Add the garlic and fry for a further min. Stir in the vinegar and sugar, then tip in the tomatoes and half the basil. Return the vegetables to the pan with some salt and pepper and cook for 5 mins. Serve with basil."
    }
];

var app = {
    agStore: {},
    reset: function() {
        // Here we are calling the stores "remove" method.
        // Remove takes either the id of the object we want to remove or nothing
        // Passing no parameters will remove all
        // Since the call is asynchronous in nature, we are using promises here to deal with that
        app.agStore.remove().then( function() {
            app.initData();
        });
    },
    renderRecipeList: function( dataz ) {

        var i = 0,
            putItHere = $( "ul.topcoat-list__container" ),
            itemTemplate = $( "#item" ).html();

            putItHere.empty();

            // The dataz object is an array that contains all the items
            for( i; i < dataz.length; i++ ) {
                // Just adding the object's id and title
                putItHere.append( _.template( itemTemplate, dataz[ i ] ) );
            }
    },
    renderRecipeDetail: function( event ) {
        var target = event.target,
            li = $( target ).closest( "li" )[ 0 ],
            id = li.id,
            detailTemplate = $( "#itemDetail" ).html(),
            content = $( ".content" );

        content.empty();

        // Find the recipe based on the id
        // Here we are calling the stores "read" method.
        // Read takes either the id we are looking for or nothing
        // Since the call is asynchronous in nature, we are using promises here to deal with that
        // The returned value is either the JSON object with the id or all the data
        app.agStore.read( id ).then( function( data ) {
            $( ".content" ).append( _.template( detailTemplate, data[ 0 ] ) );
        })
        .then( null, function( error ) {
            console.log( error );
        });

        // transition
        $( "section[ id != details ]" ).addClass( "hidden" );
        $( "#details" ).removeClass( "hidden" );
    },
    home: function() {
        $( "section[ id != main ]" ).addClass( "hidden" );
        $( "#main" ).removeClass( "hidden" );
    },
    add: function() {
        $( "section[ id != add ]" ).addClass( "hidden" );
        $( "#add" ).removeClass( "hidden" );
    },
    formSubmit: function( event ) {
        event.preventDefault();

        var data = $( this ).serializeObject();

        // Add an id to the data
        data.id = uuid.v4();

        // Here we are calling the stores "save" method.
        // Save takes either a JSON Object or an Array of Objects.
        // Since the call is asynchronous in nature, we are using promises here to deal with that
        // The returned value is the updated data in the store
        app.agStore.save( data ).then( function( data ) {
            app.renderRecipeList( data );
            app.home();
        });
    },
    cancel: function() {
        $( "form" )[0].reset();
        app.home();
    },
    init: function() {
        // Here we create our DataManager and create an IndexedDB store name "recipes"
        // IndexedDB needs to be opened before we can write to it,  this "auto" setting will do that for us
        // If IndexedDB is not supported in your browser, DataManager will fall back to what is supported
        // There is also a setting to turn off fallbacks
        var dm = AeroGear.DataManager({
            name: 'recipes',
            type: 'IndexedDB',
            settings: {
                auto: true
            }
        });

        app.agStore = dm.stores.recipes;

        app.initData();

        //Event Listeners
        $( "ul.topcoat-list__container" ).on( "click", app.renderRecipeDetail );
        $( "span.back" ).on( "click", app.home );
        $( "button.reset" ).on( "click", app.reset );
        $( "span.plus" ).on( "click", app.add );
        $( "form" ).on( "submit", app.formSubmit );
        $( "input[name='cancel']" ).on( "click", app.cancel );
    },
    initData: function() {
        // Here we are calling the stores "save" method.
        // Save takes either a JSON Object or an Array of Objects.
        // Since the call is asynchronous in nature, we are using promises here to deal with that
        // The returned value is the updated data in the store
        app.agStore.save( recipes ).then( function( data ) {
            app.renderRecipeList( data );
        });
    }
};

//Initialize our Application
app.init();

// Serializes a form to a JavaScript Object
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each( a, function() {
        if ( o[ this.name ] ) {
            if ( !o[ this.name ].push ) {
                o[ this.name ] = [ o[ this.name ] ];
            }
            o[ this.name ].push( this.value || '' );
        } else {
            o[ this.name ] = this.value || '';
        }
    });
    return o;
};
