angular.module('pcApp.visualization.services.visualization',[
    'ngResource',
    'pcApp.config'
])

/*
.factory('SearchVisualisations',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = "/"+API_CONF.ELASTIC_INDEX_NAME+'/:type/_search';
	//console.log("url");
	//console.log(url);
	
	var SearchVisualisations = $resource(url,
		{		
			search: "@search",
			type: "@type"
		},
        {
            'update': { method:'PUT' },
            'post': { method:'POST', isArray:false },
            'query': { method: 'GET', isArray:false}
            //'query': { method: 'POST', isArray:false}
        }
	);
	return SearchVisualisations;
}])
*/

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
	
.factory('Visualization',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/visualizations/:id";
	var Visualization = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
	);
	return Visualization;
}])

/*
.factory('VisualizationByMetric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByMetric?metric_id=:id&page_size=100";
	//console.log(url);
	var VisualizationByMetric = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
	);
	return VisualizationByMetric;
}])
*/


.factory('VisualizationByDataset',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByDataset?dataset_id=:id&page_size=100";
	//console.log(url);
	var VisualizationByDataset = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
	);
	return VisualizationByDataset;
}])


.factory('VisualizationByEvent',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByEvent?historical_event_id=:id&page_size=100";
	//console.log(url);
	var VisualizationByEvent = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}
        }
	);
	return VisualizationByEvent;
}])


.factory('FCMByIndividualSelected',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.FCM_URL + "/individuals/:id";
	//var url = API_CONF.FCM_URL + "/models";
	//console.log(url);
	var FCMByIndividualSelected = $resource(url,
		{
			id: "@id"
		},
        {
            'query': { method: 'GET', isArray:true}
        }
	);
	return FCMByIndividualSelected;
}])

.factory('FCMByDatasetSelected',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.FCM_URL + "/datasets/:id";
	//var url = API_CONF.FCM_URL + "/models";
	//console.log(url);
	var FCMByDatasetSelected = $resource(url,
		{
			id: "@id"
		},
        {
            'query': { method: 'GET', isArray:true}
        }
	);
	return FCMByDatasetSelected;
}])
;