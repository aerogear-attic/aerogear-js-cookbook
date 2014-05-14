'use strict';
require.config({

    baseUrl: 'scripts',

    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        angular: '../bower_components/angular/angular',
        aerogear: '../bower_components/aerogear/aerogear',
        vertxbus: '../bower_components/vertx/src/dist/client/vertxbus',
        sockjs: '../bower_components/sockjs.js/index'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        angular: {
            deps: ['jquery'],
            init: function() {
                return this.angular;
            }
        },
        aerogear: {
            deps: ['jquery', 'vertxbus'],
            init: function() {
                return this.AeroGear;
            }
        },
        sockjs: {
            init: function() {
                return this.SockJS;
            }
        }
    }
});

require(['angular', 'app', 'bootstrap', 'fastclick.init'], function (angular) {

    angular.bootstrap(document, ['app']);
});
