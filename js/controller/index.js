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

    app.controller('IndexController', ['$scope', 'es', '$state', '$stateParams', function ($scope, es, $state, $stateParams) {
        $scope.index = {};
        $scope.mapping = {};
        $scope.newAliasName = '';
        $scope.newTypeName = '';

        $scope.getIndex = function () {
            es.indices.get({
                index: $stateParams.index
            }, function (err, response) {
                if (err) {
                    return $state.go('homepage');
                }
                $scope.index = response[$stateParams.index];
                $scope.index.name = $stateParams.index;
            });
        };

        $scope.addAlias = function ($event, name) {
            event.preventDefault();
            es.indices.putAlias({
                index: $stateParams.index,
                name: name
            }, function (err, response) {
                if (err) {
                    return alert(err.message);
                }
                $scope.getIndex();
            })
        };

        $scope.addType = function ($event, name) {
            event.preventDefault();
            if (!$scope.index.mappings[name]) {
                $scope.index.mappings[name] = {};
            }
            $scope.newTypeName = '';
        };

        $scope.getIndex();
    }]);
}());