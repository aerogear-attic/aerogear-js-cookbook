/*
 *    JBoss, Home of Professional Open Source
 *    Copyright 2015, Red Hat, Inc., and individual contributors
 *    by the @authors tag. See the copyright.txt in the distribution for a
 *    full listing of individual contributors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

(function () {
  'use strict';

  angular.module('diff-sync-demo').constant('ENVIRONMENT', {

    // CHANGE ME!
    // by default sync server is assumed to run on "ws://localhost:7777/sync". this is good for `ionic serve`.
    // however, you cannot run the application on emulators or real devices using localhost. it is because localhost means the device itself in that case.
    // so, if you're running the sync server locally, you have to update following constant with your IP for `ionic run` or `ionic emulate`.
    SYNC_SERVER_URL: 'ws://localhost:7777/sync'
    //SYNC_SERVER_URL : 'ws://xx.xx.xx.xx:7777/sync'
  });
})();
