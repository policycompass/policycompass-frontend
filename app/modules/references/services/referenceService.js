angular.module('pcApp.references.services.reference',[
    'ngResource',
    'pcApp.config'
])

.factory('Unit',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.REFERENCE_POOL_URL + "/units/:id";
	var Unit = $resource(url,
		{
			id: "@id"
		}
	);
	return Unit;
}])

.factory('PolicyDomain',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/policydomains/:id";
    var PolicyDomain = $resource(url,
        {
            id: "@id"
        }
    );
    return PolicyDomain;
}])

.factory('Language',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/languages/:id";
    var Language = $resource(url,
        {
            id: "@id"
        }
    );
    return Language;
}]);



