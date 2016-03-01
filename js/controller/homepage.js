'use strict';

(function () {
    var app = angular.module('app.homepage', ['ui.router', 'app.service.es']);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider
            .state('homepage', {
                url: "/",
                templateUrl: './html/homepage.html',
                controller: 'HomepageController'
            })
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