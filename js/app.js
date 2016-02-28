'use strict';

(function () {
    var app = angular.module('app', ['elasticsearch']);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise("/404");

        $httpProvider.interceptors.push('RequestInterceptor');

        $stateProvider
            .state('indice', {
                url: "/",
                templateUrl: './html/homepage.html',
                controller: 'ElasticController',
                params: {
                    page: '1'
                }
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

    app.controller('ElasticController', ['$scope', 'es', function ($scope, es) {
        $scope.indices = [];

        $scope.getIndices = function () {
            es.indices.get(function (err, response) {
                $scope.indices = response;
            })
        }

        $scope.getIndices();
    }]);
}());