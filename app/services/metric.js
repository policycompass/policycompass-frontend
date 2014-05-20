
var service = angular.module('pcApp.services.metric', ['ngResource', 'pcApp.config']);

service.factory('Metric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.URL + "/metrics/:id";
	var Metric = $resource(url,
		{
			id: "@id"
		}
	);
	return Metric;
}]);


