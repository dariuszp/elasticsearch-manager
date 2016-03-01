'use strict';

(function () {
    var app = angular.module('app.service.es', ['elasticsearch']);

    app.service('es', ['esFactory', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            //log: 'trace'
        });
    }]);

}());