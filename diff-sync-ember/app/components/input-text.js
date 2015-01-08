// An Ember component to encapsulate the 'editing' functionality of our input
// Allows for the Double Clicking/Tapping to edit the input
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
