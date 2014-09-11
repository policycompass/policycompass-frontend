/**
 * Services for the Metrics Manager.
 * Those factories provide adapters for the RESTful API of the Metrics Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.metrics.services.metric',[
    'ngResource',
    'pcApp.config'
])

/**
 * Factory for the Resource for metrics
 */
.factory('Metric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
	var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
	var Metric = $resource(url,
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

    // Function to convert the metric data from the API to a suitable format for the Handsontable
    Metric.prototype.getDataAsGrid =  function(){
        var result = [];
        this.data.table.forEach(function (e) {
            var row_extras = [];
            this.data.extra_columns.forEach(function(extra){
                row_extras.push(e[extra]);
            });
            var row = [e.from, e.to, e.value];
            row = row.concat(row_extras);
            result.push(row);
        }, this);
        return result;
    };
	return Metric;
}]).

/**
 * Factory for the Resource for extra categories
 */
factory('ExtraCategory',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
    var url = API_CONF.METRICS_MANAGER_URL + "/extra_categories/:id";
    var ExtraCategory = $resource(url,
        {
            id: "@id"
        }
    );
    return ExtraCategory;
}]);


