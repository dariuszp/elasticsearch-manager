'use strict';

(function () {
    var app = angular.module('app.index', ['ui.router', 'app.service.es', 'app.homepage']);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider
            .state('homepage.index', {
                url: ":index",
                templateUrl: './html/index.html',
                controller: 'IndexController'
            });
    }]);

    app.controller('IndexController', ['$scope', 'es', '$stateParams', function ($scope, es, $stateParams) {
        $scope.index = {};

        $scope.getIndex = function (name) {
            es.indices.get({
                index: name
            }, function (err, response) {
                $scope.index = response[$stateParams.index];
                $scope.index.name = $stateParams.index;
            });
        };

        $scope.getIndex($stateParams.index);
    }]);
}());