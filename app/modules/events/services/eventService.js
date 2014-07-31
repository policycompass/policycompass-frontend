angular.module('pcApp.events.services.event',[
    'ngResource',
    'pcApp.config'
])

.factory('Event',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.EVENTS_MANAGER_URL + "/events/:id";
	var Event = $resource(url,
		{
			id: "@id"
		}
	);
	return Event;
}]);