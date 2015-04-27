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

  angular.module('diff-sync-demo').controller('DemoController', DemoController);

  DemoController.$inject = ['$scope', '$ionicModal', 'ENVIRONMENT'];

  function DemoController($scope, $ionicModal, ENVIRONMENT) {
    var seedData = {
      id: '12345',
      clientId: uuid(),
      content: {
        name: 'Luke Skywalker',
        profession: 'Jedi',
        hobbies: [
          {
            description: 'Fighting the Dark Side'
          },
          {
            description: 'going into Tosche Station to pick up some power converters'
          },
          {
            description: 'Kissing his sister'
          },
          {
            description: 'Bulls eyeing Womprats on his T-16'
          }
        ]
      }
    };

    var syncClientNeedsInit = true;
    var syncClient = null;

    $scope.init = function () {
      $scope.doc = {};
      $scope.showReorder = false;
      $scope.showDelete = false;

      // following 2 would be in hobbyModal's scope only in a real world application
      $scope.editedHobby = null;
      $scope.hobbyAddMode = false;


      // initialize person modal
      $ionicModal.fromTemplateUrl('person-edit-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.personModal = modal;
      });

      // initialize hobby modal
      $ionicModal.fromTemplateUrl('hobby-add-edit-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.hobbyModal = modal;
      });

      syncClient = AeroGear.DiffSyncClient({
        serverUrl: ENVIRONMENT.SYNC_SERVER_URL,
        onopen: function () {
          if (syncClientNeedsInit) {
            syncClient.addDocument(seedData);
            syncClientNeedsInit = false;
          }
          else {
            syncClient.fetch('12345');
          }
        },
        onsync: function (doc) {
          // need $scope.$apply to reflect the changes in Angular
          $scope.$apply(function () {
            $scope.doc = doc;
          });
        }
      });
    };

    $scope.deleteHobby = function (index) {
      $scope.doc.content.hobbies.splice(index, 1);
      $scope._syncDoc();
    };

    $scope.moveHobby = function (item, fromIndex, toIndex) {
      $scope.doc.content.hobbies.splice(fromIndex, 1);
      $scope.doc.content.hobbies.splice(toIndex, 0, item);
      $scope._syncDoc();
    };

    $scope.editPerson = function () {
      $scope.personModal.show();
    };

    $scope.savePerson = function () {
      $scope._syncDoc();
      $scope.personModal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.personModal.remove();
      $scope.hobbyModal.remove();
    });

    $scope.addNewHobby = function () {
      $scope.showReorder = false;
      $scope.showDelete = false;
      $scope.editedHobby = {description: ""};
      $scope.hobbyAddMode = true;
      $scope.hobbyModal.show();
    };

    $scope.editHobby = function (index) {
      $scope.showReorder = false;
      $scope.showDelete = false;
      $scope.editedHobby = $scope.doc.content.hobbies[index];
      $scope.hobbyAddMode = false;
      $scope.hobbyModal.show();
    };

    $scope.saveHobby = function () {
      if ($scope.hobbyAddMode) {
        $scope.doc.content.hobbies.push($scope.editedHobby);
      }
      else{
        // no need to do anything as modal was using the hobby item already and changes are reflected to that
      }
      $scope._syncDoc();
      $scope.hobbyModal.hide();
    };

    $scope._syncDoc = function () {
      syncClient.sync(cp($scope.doc));
    }

  }

  ///////////////////////////////////////////////////////////

  // poor man's uuid
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // poor man's copy
  function cp(obj) {
    return JSON.parse(JSON.stringify(obj || {}));
  }
})();
