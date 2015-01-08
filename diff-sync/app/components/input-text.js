import Ember from 'ember';

export default Ember.Component.extend({
    isEditing: false,
    gestures: {
        doubleTap: function () {
            this.set('isEditing', true);
        },
    },
    doubleClick: function () {
        this.set('isEditing', true);
    },
    actions: {
        acceptChanges: function () {
            this.set('isEditing', false);
            this.sendAction();
        }
    }
});
