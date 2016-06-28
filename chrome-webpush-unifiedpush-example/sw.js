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

/*
 * Service workers are worker scripts that run in the background to intercept network requests,
 * handle push messages and perform other tasks.
 * If you want to find out more, take a look at Introduction to Service Worker on HTML5 Rocks:
 * http://www.html5rocks.com/en/tutorials/service-worker/introduction/

 * The diagnostic page chrome://serviceworker-internals is a good place to check that your service workers are working.
 */

console.log('Started', self); // self refers to the ServiceWorkerGlobalScope object: the service worker itself

self.addEventListener('install', function(event) {
    // By default an old service worker will stay running until all tabs that use it are closed or unloaded.
    // A new service worker will remain in the waiting state.

    // When skipWaiting() is called the service worker will skip the waiting state and immediately activate.
    self.skipWaiting();
    console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});

self.addEventListener('push', function(event) {
    console.log('Push message', event);

    // A downside to the current implementation of the Push API in Chrome
    // is that you can’t send any data with a push message.
    // Check in console log, that PushEvent.data is null.
    // Also see 'Browser Compatibility' section on MDN:
    // https://developer.mozilla.org/en-US/docs/Web/API/PushEvent/PushEvent
    // We will use some static content.
    // However you could grab some data from an API and use it to populate a notification.

    var title = 'AeroGear Unified Push Server';
    var body = 'AeroGear UPS works with Chrome!';
    var icon = 'images/icon.png';
    var tag = 'my-tag';

    event.waitUntil(    // takes a promise and extends the lifetime of the event handler until
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag   // One notification will be shown for each tag value:
            // if a new push message is received, the old notification will be replaced.
            // To show multiple notifications, use a different tag value for each
            // showNotification() call, or no tag at all.
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag', event.notification.tag);
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    // That’s why we need to close it manually:
    event.notification.close();

    var url = 'http://localhost:8000/';
    
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
        .then(function(windowClients) {
            console.log('WindowClients', windowClients);
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                console.log('WindowClient', client);
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
