import Ember from 'ember';

export default Ember.Controller.extend({
    isConnected: false,
    buttonDescription: function () {
        return this.get('isConnected') ? 'Disconnect' : 'Connect';
    }.property('isConnected'),
    actions: {
        toggleConnection: function () {
            if (this.get('isConnected')) {
                // Disconnect
                this.set('isConnected', false);
                this.get('syncClient').disconnect();
            } else {
                // Connect
                this.set('isConnected', true);
                this.get('syncClient').connect();
            }
        }
    }
});

