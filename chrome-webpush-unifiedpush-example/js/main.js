/*
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

if ('serviceWorker' in navigator) { // checks if service worker is supported by your browser
    console.log('Service Worker is supported');

    // registers and installs the service worker you created in sw.js
    navigator.serviceWorker.register('sw.js').then(function() {
        return navigator.serviceWorker.ready;
    }).then(function(registration) {
        console.log('Service Worker is ready :^)', registration);

        if (localStorage.getItem('registered')) {
            return; // already registered, nothing to do
        }

        // uses the ServiceWorkerRegistration object’s pushManager
        // to subscribe to messages for the gcm_sender_id you added to the manifest
        registration.pushManager.subscribe({
            userVisibleOnly: true // notification will always be shown when a push message is received
        }).then(function(subscription) {
            console.log('endpoint:', subscription.endpoint); // use this value to tell FCM (GCM) where to send messages

            registerOnUPS(subscription.endpoint);
        });
    }).catch(function(error) {
        console.log('Service Worker error :^(', error);
    });
}

function registerOnUPS(endpoint) {
    var idx = endpoint.lastIndexOf('/');

    if (idx < 0) {
        console.log('Can not extract subscriptionId from endpoint');
        return;
    }

    var subscriptionId = endpoint.substring(idx + 1);
    console.log('subscriptionId: ' + subscriptionId);

    // config params for UnifiedPush server
    var variantId = '<Your-Variant-ID>';
    var variantSecret = '<Your-Variant-Secret>';
    var unifiedPushUrl = '<URL of the running UnifiedPush server>';

    // create the 'UnifiedPush' client object:
    var UPClient = AeroGear.UnifiedPushClient(variantId, variantSecret, unifiedPushUrl);

    var settings = {
        metadata: {
            deviceToken: subscriptionId,
            deviceType: 'chrome',   // not required
            alias: 'localhost'  // not required
        }
    };

    // register with the server
    UPClient.registerWithPushServer(settings)
        .then(function() {
            console.log('Registered endpoint with UnifiedPush server!');
            localStorage.setItem('registered', true);
        })
        .then(null, function() {
            console.log('Error when registering with UnifiedPush server!');
        });
}
