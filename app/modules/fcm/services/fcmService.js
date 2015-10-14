/**
 * Services for the FCM Manager.
 * Those factories provide adapters for the RESTful API of the FCM Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.fcm.services.fcm',[
    'ngResource',
    'pcApp.config'
])

/**
 * Factory for the Resource for FCM
 */
.factory('Fcm',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.FCM_URL + "/models";
	
	return $resource(url, {},
        {
            // Add support for create
            'create': { method:'POST' }
        });
}])

.factory('FcmModel',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.FCM_URL + "/models/:id";

	return $resource(url, 
		{
			id: "@id"
		},
        {
            // Array is false due to additional pagination data
            'show': { method: 'GET' },
            // Add support for create
            'update': { method:'PUT', params: {id: '@id'} },
            'delete': { method:'DELETE', params: {id: '@id'} }
        });
}])

// **-*-****
.factory('FcmSimulation',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.FCM_URL + "/simulation";

	return $resource(url, {},
        {
            // Add support for create
            'create': { method:'POST' }
        });
}])

// **-*-****
.factory('FcmImpactAnalysis',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.FCM_URL + "/impactanalysis/:id";

	return $resource(url,
		{
			id: "@id"
		},
        {
            // Add support for create
            'create': { method:'POST', params: {id: '@id'} }
        });
}])


/**
 * Factory for the Resource for FCM Concept Activator
 */
.factory('FcmActivator',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.FCM_URL + "/activators";
	
	return $resource(url, {},
        {
            // Add support for create
            'create': { method:'POST' }
        });


}])

.factory('FcmSearchUpdate',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = "/api/v1/searchmanager/updateindexitem/fuzzymap/:id";

	return $resource(url, 
		{
			id: "@id"
		},
        {
            'create': { method: 'POST', params: {id: '@id'} },
            'update': { method:'POST', params: {id: '@id'} }
        });


}])

.factory('FcmSearchDelete',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = "/api/v1/searchmanager/deleteindexitem/fuzzymap/:id";

	return $resource(url, 
		{
			id: "@id"
		},
        {
            'delete': { method:'POST', params: {id: '@id'} }
        });


}])


.factory('Dataset',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	//var url = "/api/v1/datasetmanager/datasets/:id";
	var url = API_CONF.DATASETS_MANAGER_URL + "/datasets/:id";
	var Dataset = $resource(url,
		{
			id: "@id"
		},
        {
            // Add support for update
            'update': { method:'PUT' },
            // Array is false due to additional pagination data
            'query': { method: 'GET', isArray:false}

        }
	);

	return Dataset;
}])
	


/**
 * Factory for the Resource for metrics
 */
.factory('Metric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.METRICS_MANAGER_URL + "/metrics";
	var Metric = $resource(url, {},
        {
            // Array is false due to additional pagination data
            'query': { method: 'GET', isArray:false}
        }
	)
	return Metric;
}]);



