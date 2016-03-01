'use strict';

(function () {
    var app = angular.module('app.index', ['ui.router', 'elasticsearch']);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider
            .state('homepage.index', {
                url: ":index",
                templateUrl: './html/index.html',
                controller: 'IndexController'
            })
    }]);

    app.controller('IndexController', ['$scope', 'es', '$stateParams', function ($scope, es, $stateParams) {
        $scope.index = [];

        $scope.getIndex = function (name) {
            es.indices.get({
                index: name
            }, function (err, response) {
                $scope.index = response;
            });
        };

        $scope.getIndex($stateParams.index);
    }]);
}());