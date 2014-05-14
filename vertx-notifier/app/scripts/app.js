/*global define */
define(['angular', 'aerogear'], function (angular, AeroGear) {
    'use strict';

    return angular.module('app', [])

        .controller('SendController', function($scope, chatBus) {
            $scope.name = localStorage.name;
            $scope.message = '';

            $scope.sendMessage = function() {
                var message = {
                    name: $scope.name,
                    text: $scope.message
                };
                // send message to all subscribers
                chatBus.send('chat.messages', message, true);
                $scope.message = '';
            };

            // watches changes of user name and saves it to localStorage
            $scope.$watch('name', function() {
                localStorage.name = $scope.name;
            });
        })

        // create a controller for displaying list of messages
        .controller('ListController', function($scope, messageList) {
            $scope.messages = messageList;
        })

        // initialize list of messages
        .factory('messageList', function() {
            return [];
        })

        // create a chat service (injects global list of messages)
        .factory('chatBus', function(messageList, $rootScope) {
            var chatBus = AeroGear.Notifier({
                name: 'chat',
                type: 'vertx',
                settings: {
                    // specify address of the vert.x sockjs bridge
                    connectURL: 'http://localhost:8080/eventbus',
                    autoConnect: true,
                    onConnect: function() {
                        // subscribe to the channel
                        chatBus.subscribe({
                            address: 'chat.messages',
                            callback: function(message) {
                                // update list of messages
                                messageList.push(message);
                                // we have to notify angular about change to the model (messageList update)
                                $rootScope.$apply();
                            }
                        });
                    }
                }
            }).clients.chat;
            return chatBus;
        })

        // used for reverting a message list when displayed (newest messages on the top)
        .filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        });
});
