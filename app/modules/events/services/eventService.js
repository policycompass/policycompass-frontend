angular.module('pcApp.events.services.event',[
    'ngResource',
    'pcApp.config'
])

.factory('Event',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.EVENTS_MANAGER_URL + "/events/:id";
	var Event = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
	);
	return Event;


}])

.factory('LinkedEventVisualization',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByEvent?historical_event_id=:id";
    var LinkedEventVisualization = $resource(url,
        {
            id: "@id"
        },
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
    );
    return LinkedEventVisualization;
}]);