
angular.module('pcApp.datasets.services.dataset',[
    'ngResource',
    'pcApp.config'
])

.factory('creationService', ['$log', function ($log) {
        var data = {
            step: null
        };
        return data;
    }]);