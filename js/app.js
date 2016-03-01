'use strict';

(function () {
    var app = angular.module('app', [
        'app.factory.request_interceptor',
        'ui.router',
        'app.homepage',
        'app.index'
    ]);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.when('', '/');
        $urlRouterProvider.otherwise("/404");

        $httpProvider.interceptors.push('RequestInterceptor');
    }]);

}());