var controller = angular.module('pcApp.controllers.metric', ['ngResource', 'pcApp.services.metric', 'pcApp.directives.metric']);

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

}]);


controller.controller('MetricDetailController', ['$scope', '$routeParams', '$location', 'Metric', function($scope, $routeParams, $location, Metric) {
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
	 	
	
}]);

controller.controller('MetricCreateController', ['$scope', 'Metric', '$location', '$log', function($scope, Metric, $location, $log) {

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
