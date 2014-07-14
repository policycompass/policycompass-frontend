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
        []
    ];

    $scope.metric = {};
    $scope.columns = {};


	$scope.createMetric = function() {
        $log.info( $scope.datagrid[0]);
        //$scope.stage = "second";

        $scope.metric.unit = 1;
        $scope.metric.language = 1;
        $scope.metric.user_id = 1;

        $scope.metric.description = "Description";

        var data = [];
        $scope.datagrid.forEach(function(e){
            if(e[0] != null){
                data.push({
                    from: e[$scope.columns.from],
                    to: e[$scope.columns.to],
                    value: e[$scope.columns.value]
                });
            }
        });

        $scope.metric.data = {
            table: data,
            extra_columns: [
            ]
        };

		Metric.save($scope.metric,function(){
			$location.path('/metrics');
		},
		function(err) {
            throw { message: err.data};
		}

		);
	};
}]);
