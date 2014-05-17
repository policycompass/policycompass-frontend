
pcApp.controller('MetricsController', function($scope, SimpleFactory, Metric) {
	
	$scope.hallo = "Hallo Welt";
	Metric.query(
			null,
			function(metricList) {
				$scope.hallo = metricList;
			},
			function(error) {
				alert(error.data.message);
			}
	);
	
	
	
});