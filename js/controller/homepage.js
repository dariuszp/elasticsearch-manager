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

    app.controller('HomepageController', ['$scope', 'es', '$state', '$stateParams', function ($scope, es, $state, $stateParams) {
        $scope.stats = [];
        $scope.index = {
            name: '',
            number_of_replicas: 0,
            number_of_shards: 1
        };

        $scope.getStats = function () {
            es.indices.stats({}, function (err, response) {
                if (err) {
                    alert(err.message);
                }
                $scope.stats = response;
            });
        };

        $scope.createIndex = function (event, name, number_of_shards, number_of_replicas) {
            event.preventDefault();
            es.indices.create({
                index: name,
                body: {
                    settings: {
                        index: {
                            number_of_replicas: parseInt(number_of_replicas, 10) || 0,
                            number_of_shards: parseInt(number_of_shards, 10) || 1
                        }
                    }
                }
            }, function (err) {
                if (err) {
                    alert(err.message);
                }
                $scope.index = {
                    name: '',
                    number_of_replicas: 0,
                    number_of_shards: 1
                };
                setTimeout(function () {
                    $scope.getStats();
                    return $state.go('homepage.index', {
                        index: name
                    });
                }, 500);
            })
        };

        $scope.deleteIndex = function (event, name) {
            event.preventDefault();
            if (!confirm('Are you sure? You will loose all data from index: ' + String(name))) {
                return false;
            }
            es.indices.delete({
                index: name
            }, function (err) {
                if (err) {
                    alert(err.message);
                }
                setTimeout(function () {
                    $scope.getStats();
                    if ($state.params.index === name) {
                        return $state.go('homepage');
                    }
                }, 500);
            });
        };

        $scope.getStats();
    }]);
}());