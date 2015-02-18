angular.module('pcApp.visualization.services.visualization',[
    'ngResource',
    'pcApp.config'
])


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

;