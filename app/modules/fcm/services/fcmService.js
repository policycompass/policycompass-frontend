angular.module('pcApp.fcm.services.fcm',[
    'pcApp.config'
])

.factory('Fcm',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.FCM_URL + "/metrics/:id";

}]);


