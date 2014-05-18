
var service = angular.module('pcApp.service', ['ngResource']);

service.factory('Metric', function($resource) {
	var url = "http://localhost:8000/api/v1/metrics/:id";
	var Metric = $resource(url,
		{
			id: "@id"
		}
	);
	return Metric;
});


