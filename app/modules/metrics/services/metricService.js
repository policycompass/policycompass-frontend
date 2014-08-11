angular.module('pcApp.metrics.services.metric',[
    'ngResource',
    'pcApp.config'
])

.factory('Metric',  ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
	var Metric = $resource(url,
		{
			id: "@id"
		},
        {
            'update': { method:'PUT' },
            'query': { method: 'GET', isArray:false}

        }
	);

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

factory('ExtraCategory',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    var url = API_CONF.METRICS_MANAGER_URL + "/extra_categories/:id";
    var ExtraCategory = $resource(url,
        {
            id: "@id"
        }
    );
    return ExtraCategory;
}]);


