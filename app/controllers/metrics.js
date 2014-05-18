
pcApp.controller('MetricsController', function($scope, SimpleFactory, Metric) {
	
	$scope.metrics = Metric.query(
			null,
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);
	
	$scope.deleteMetric = function(metric) {
		metric.$delete();
		$scope.metrics = Metric.query();
	};
	
});


pcApp.controller('MetricDetailController', function($scope, $routeParams, Metric) {
	
	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);
	 	
	
});

pcApp.controller('MetricCreateController', function($scope, Metric, $location) {
	$scope.createMetric = function() {
		Metric.save($scope.metric,function(){
			$location.path('/metrics');
		},
		function(err) {
			$scope.errors = err.data;
		}
		
		);
	};
});