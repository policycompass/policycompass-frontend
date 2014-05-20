var controller = angular.module('pcApp.controllers.metric', ['ngResource', 'pcApp.services.metric']);

controller.controller('MetricsController', ['$scope', 'SimpleFactory', 'Metric', '$log', function($scope, SimpleFactory, Metric, $log) {
		
	$log.info("hallo");
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
	
}]);


controller.controller('MetricDetailController', ['$scope', '$routeParams', 'Metric', function($scope, $routeParams, Metric) {
	
	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metricList) {
			},
			function(error) {
				alert(error.data.message);
			}
	);
	 	
	
}]);

controller.controller('MetricCreateController', ['$scope', 'Metric', '$location', function($scope, Metric, $location) {
	$scope.createMetric = function() {
		Metric.save($scope.metric,function(){
			$location.path('/metrics');
		},
		function(err) {
			$scope.errors = err.data;
		}
		
		);
	};
}]);