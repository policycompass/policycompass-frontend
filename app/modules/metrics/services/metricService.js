angular.module('pcApp.metrics.services.metric',[
    'ngResource',
    'pcApp.config'
])

.factory('Metric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
	var Metric = $resource(url,
		{
			id: "@id"
		}
	);
	return Metric;
}]);


