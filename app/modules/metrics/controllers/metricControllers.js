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

.controller('MetricDetailController', ['$scope', '$routeParams', '$location', 'Metric', '$log', function($scope, $routeParams, $location, Metric, $log) {

    $scope.datagrid = [[]];
    $scope.gridvisible = false;

	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metric) {
			},
			function(error) {
				alert(error.data.message);
			}
	);

    $scope.metric.$promise.then(function(metric){
        var result = [];
        $scope.metric.data.table.forEach(function (e) {
            var row = [e.from, e.to, e.value];
            result.push(row);
        });
        $log.info(result);
        $scope.datagrid = result;
        $scope.gridvisible = true;
    });


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

    $scope.step = 'one';
    $scope.columnselection = ['A','B','C','D','E','F','G'];

    $scope.datagrid = [
        []
    ];

    $scope.metric = {};
    $scope.columns = {
        from: 0,
        to: 1,
        value: 2
    };

    $scope.nextStep = function() {
        validation();
        $scope.step = 'second';
    };

    $scope.prevStep = function() {
        $scope.step = 'one';
    };

    var validation = function() {

    };


	$scope.createMetric = function() {
        $log.info( $scope.datagrid[0]);
        $scope.metric.user_id = 1;

        var data = [];
        var extra = [];
        if($scope.columns.category) {
            extra.push($scope.columns.category);
        }

        $scope.datagrid.forEach(function(e){
            if(e[0] != null){
                var row = {
                    from: e[$scope.columns.from],
                    to: e[$scope.columns.to],
                    value: e[$scope.columns.value]
                };
                if($scope.columns.category) {
                    row[$scope.columns.category] = e[$scope.columns.extra];
                }
                data.push(row);
            }
        });

        $scope.metric.data = {
            table: data,
            extra_columns: extra
        };

		Metric.save($scope.metric,function(value, responseHeaders){
			$location.path('/metrics/' + value.id);
		},
		function(err) {
            throw { message: err.data};
		}

		);
	};
}]);
