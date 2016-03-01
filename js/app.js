'use strict';

(function () {
    var app = angular.module('app', ['ui.router', 'elasticsearch', 'app.index']);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise("/404");

        $httpProvider.interceptors.push('RequestInterceptor');

        $stateProvider
            .state('homepage', {
                url: "/",
                templateUrl: './html/homepage.html',
                controller: 'HomepageController'
            })
    }]);

    app.factory('RequestInterceptor', ['$q', '$rootScope', '$injector', function ($q, $rootScope, $injector) {
        $rootScope.pendingRequests = false;
        return {
            'request': function (config) {
                if (!$rootScope.lockRequestOverlay) {
                    $rootScope.pendingRequests = true;
                }
                return config || $q.when(config);
            },

            'requestError': function(rejection) {
                if ($injector.get('$http').pendingRequests.length < 1) {
                    $rootScope.pendingRequests = false;
                }
                return $q.reject(rejection);
            },

            'response': function(response) {
                if ($injector.get('$http').pendingRequests.length < 1) {
                    $rootScope.pendingRequests = false;
                }
                return response || $q.when(response);
            },

            'responseError': function(rejection) {
                if ($injector.get('$http').pendingRequests.length < 1) {
                    $rootScope.pendingRequests = false;
                }
                return $q.reject(rejection);
            }
        };
    }]);

    app.service('es', ['esFactory', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            log: 'trace'
        });
    }]);

    app.controller('HomepageController', ['$scope', 'es', function ($scope, es) {
        $scope.stats = [];

        $scope.getStats = function () {
            es.indices.stats({}, function (err, response) {
                $scope.stats = response;
            });
        };

        $scope.getStats();
    }]);
}());