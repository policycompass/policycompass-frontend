/**
 * Services for the FCM Manager.
 * Those factories provide adapters for the RESTful API of the FCM Manager.
 * They are built on top of AngularJS' Resource module.
 */


//	return $resource('http://localhost:8080/policycompass.fcmmanager/api/v1/fcmmanager/1', {}, {
//		query: {
//			method: 'GET',
//			params: {},
//			isArray: false
//		}
//	})



angular.module('pcApp.fcm.services.fcm',[
'pcApp.config'
])

/**
 * Factory for the Resource for metrics
 */
.factory('Fcm',  ['$resource', 'API_CONF', function($resource, API_CONF) {
    // Get the base URL from the configuration
//	var url = API_CONF.METRICS_MANAGER_URL + "/metrics/:id";
	var url = API_CONF.FCM_URL + "/1";
	
	return $resource(url, {},
        {
            // Add support for update
//            'update': { method:'PUT' },
            // Array is false due to additional pagination data
            query: { method: 'GET', params: {}, isArray: false}

        }
	)

//	alert(Metric);
    // Function to convert the metric data from the API to a suitable format for the Handsontable
//    Metric.prototype.getDataAsGrid =  function(){
//        var result = [];
//        this.data.table.forEach(function (e) {
//            var row_extras = [];
//            this.data.extra_columns.forEach(function(extra){
//                row_extras.push(e[extra]);
//            });
//            var row = [e.from, e.to, e.value];
//            row = row.concat(row_extras);
//            result.push(row);
//        }, this);
//        return result;
//    };
//	return Metric;





/**
 * Factory for the Resource for FCM
 */

/*
.factory('Fcm', ['$resource', 'API_CONF', function($resource, API_CONF) {
	var url = API_CONF.FCM_URL + "/:id";
    // Get the base URL from the configuration
	var FCMModel = $resource(url,
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
*/
    // Function to convert the FCM model data from the API to a suitable format for the Handsontable
//    FCMModel.prototype.getDataAsGrid =  function(){
//        var result = [];
//        this.data.table.forEach(function (e) {
//            var row_extras = [];
//            this.data.extra_columns.forEach(function(extra){
//                row_extras.push(e[extra]);
//            });
//            var row = [e.from, e.to, e.value];
//            row = row.concat(row_extras);
//            result.push(row);
//        }, this);
//        return result;
//    };
//	return FCMModel;

}]);

