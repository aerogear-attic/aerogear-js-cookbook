import Ember from 'ember';
import uuid from '../utils/uuid';
import cp from '../utils/poor-mans-copy';

var seedData = {
    id: '12345',
    clientId: uuid(),
    content: {
        name: 'Luke Skywalker',
        profession: 'Jedi',
        hobbies: [
            {
                id: uuid(),
                description: 'Fighting the Dark Side'
            },
            {
                id: uuid(),
                description: 'going into Tosche Station to pick up some power converters'
            },
            {
                id: uuid(),
                description: 'Kissing his sister'
            },
            {
                id: uuid(),
                description: 'Bulls eyeing Womprats on his T-16'
            }
        ]
    }
};

export default Ember.Controller.extend({
    needs: ['application'],
    needsInit: true,
    syncClient: {},
    actions: {
        modelUpdate: function () {
            this.get('syncClient').sync(cp(this.get('model')));
        }
    },
    _onsync: function (doc) {
        this.set('model', cp(doc));
    },
    _onopen: function () {
        this.set('controllers.application.isConnected', true);

        if (this.get('needsInit')) {
            this.get('syncClient').addDocument(seedData);
            this.set('needsInit', false);
        } else {
            this.get('syncClient').fetch('12345');
        }
    }
});
