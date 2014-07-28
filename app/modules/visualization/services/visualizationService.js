angular.module('pcApp.visualization.services.visualization',[
    'ngResource',
    'pcApp.config'
])

.factory('Visualization',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.URL + "/visualizations/:id";
	var Visualization = $resource(url,
		{
			id: "@id"
		}
	);
	return Visualization;
}]);