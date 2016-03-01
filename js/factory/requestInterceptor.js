'use strict';

(function () {
    var app = angular.module('app.factory.request_interceptor', []);

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

}());