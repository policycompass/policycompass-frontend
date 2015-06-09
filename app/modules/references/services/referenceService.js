/**
 * Services for connecting to the Reference Pool.
 * Those factories provide adapters for the RESTful API of the Reference Pool.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.references.services.reference',[
    'ngResource',
    'pcApp.config'
])

/**
 * Factory for getting a Resource, which connects to the unit endpoint
 */
.factory('Unit',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.REFERENCE_POOL_URL + "/units/:id";
	var Unit = $resource(url,
		{
			id: "@id"
		}
	);
	return Unit;
}])

/**
 * Factory for getting a Resource, which connects to the unit endpoint
 */
.factory('UnitCategory',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/unitcategories/:id";
    var UnitCategory = $resource(url,
        {
            id: "@id"
        }
    );
    return UnitCategory;
}])

/**
 * Factory for getting a Resource, which connects to the policy domains endpoint
 */
.factory('PolicyDomain',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/policydomains/:id";
    var PolicyDomain = $resource(url,
        {
            id: "@id"
        }
    );
    return PolicyDomain;
}])

/**
 * Factory for getting a Resource, which connects to the language endpoint
 */
.factory('Language',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/languages/:id";
    var Language = $resource(url,
        {
            id: "@id"
        }
    );
    return Language;
}])

/**
 * Factory for getting a Resource, which connects to the external resource endpoint
 */
.factory('ExternalResource',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/externalresources/:id";
    var ExternalResource = $resource(url,
        {
            id: "@id"
        }
    );
    return ExternalResource;
}])


/**
 * Factory for getting a Resource, which connects to the date format endpoint
 */
.factory('DateFormat',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/dateformats/:id";
    var DateFormat = $resource(url,
        {
            id: "@id"
        }
    );
    return DateFormat;
}])


/**
 * Factory for getting a Class, which connects to the class endpoint
 */
.factory('Class',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.REFERENCE_POOL_URL + "/classes/:id";
    var Class = $resource(url,
        {
            id: "@id"
        }
    );
    return Class;
}]);




