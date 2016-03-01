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
        $scope.newIndexName = '';

        $scope.getStats = function () {
            es.indices.stats({}, function (err, response) {
                console.log(response);
                if (err) {
                    alert(err.message);
                }
                $scope.stats = response;
            });
        };

        $scope.createIndex = function (event, name) {
            event.preventDefault();
            es.indices.create({
                index: name
            }, function (err) {
                if (err) {
                    alert(err.message);
                }
                setTimeout(function () {
                    $scope.getStats();
                }, 500);
            });
        };

        $scope.deleteIndex = function (event, name) {
            event.preventDefault();
            es.indices.delete({
                index: name
            }, function (err) {
                if (err) {
                    alert(err.message);
                }
                $scope.newIndexName = '';
                setTimeout(function () {
                    $scope.getStats();
                }, 500);
            });
        };

        $scope.getStats();
    }]);
}());