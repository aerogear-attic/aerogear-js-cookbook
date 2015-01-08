import Ember from 'ember';

export default Ember.Route.extend({
    setupController: function (controller, model) {
        controller.set('model', model);

        // To test on a real device,  be sure to change the serverURL to your IP
        var syncClient = AeroGear.DiffSyncClient({
                serverUrl: 'ws://192.168.1.7:7777/sync',
                onopen: controller.get('_onopen').bind(controller),
                onsync: controller.get('_onsync').bind(controller)
            });

        controller.set('syncClient', syncClient);
        this.controllerFor('application').set('syncClient', syncClient);
    }
});
