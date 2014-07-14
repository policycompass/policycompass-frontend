angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric'
])

.controller('MetricsController', ['$scope', 'Metric', '$log', function($scope, Metric, $log) {
	$log.info("hallo");
	$scope.metrics = Metric.query(
			null,
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);

}])

.controller('MetricDetailController', ['$scope', '$routeParams', '$location', 'Metric', function($scope, $routeParams, $location, Metric) {
	this.message = "Hello";

    $scope.test = "hallo";
	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);

    $scope.deleteMetric = function(metric) {
        metric.$delete(
            {},
            function(){
                $location.path('/metrics');
            }
        );
    };
	 	
	
}])

.controller('MetricCreateController', ['$scope', 'Metric', '$location', '$log', function($scope, Metric, $location, $log) {

    $scope.datagrid = [
        ["1","2","3"],
        ["A","B","C"]
    ];

    $scope.metric = {};

	$scope.createMetric = function() {
        $scope.stage = "second";
        $scope.metric.unit = 1;
		Metric.save($scope.metric,function(){
			$location.path('/metrics');
		},
		function(err) {
            throw { message: err.data};
		}

		);
	};
}]);
