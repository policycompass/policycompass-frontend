angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference'
])

.factory('helper', [function() {
    return {
        initCreateController: function($scope) {
            $scope.step = 'one';
            $scope.columnselection = ['A','B','C','D','E','F','G'];

            $scope.nextStep = function() {
                validation();
                $scope.step = 'second';
            };

            $scope.prevStep = function() {
                $scope.step = 'one';
            };

            var validation = function() {

            };
        }
    };
}])

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

.controller('MetricDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Metric',
        '$log',
        function($scope, $routeParams, $location, Metric, $log) {

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
        $scope.datagrid = metric.getDataAsGrid();
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

.controller('MetricCreateController', [
        '$scope',
        'Metric',
        '$location',
        '$log',
        'helper',
        function($scope, Metric, $location, $log, helper) {

    helper.initCreateController($scope);

    $scope.mode = "create";
    $scope.gridvisible = true;


    $scope.datagrid = [
        []
    ];

    $scope.metric = {};
    $scope.columns = {
        from: 0,
        to: 1,
        value: 2
    };

	$scope.createMetric = function() {
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
}])

.controller('MetricEditController', [
        '$scope',
        '$routeParams',
        'Metric',
        '$location',
        '$log',
        'helper',
    function($scope, $routeParams, Metric, $location, $log, helper) {

        helper.initCreateController($scope);
        $scope.mode = "edit";
        $scope.gridvisible = false;

        $scope.datagrid = [
            []
        ];

        $scope.metric = Metric.get({id: $routeParams.metricId},
            function(metric) {
            },
            function(error) {
                alert(error.data.message);
            }
        );

        $scope.metric.$promise.then(function(metric){
            $scope.metric.unit = $scope.metric.unit.id;
            $scope.metric.language = $scope.metric.language.id;
            $scope.datagrid = metric.getDataAsGrid();
            $scope.gridvisible = true;
            $scope.metric.policyDomain = ["1","2"];
            $scope.metric.external_resource = 1;
            $scope.columns.category =  $scope.metric.data.extra_columns[0];
        });


        $scope.columns = {
            from: 0,
            to: 1,
            value: 2,
            extra: 3
        };


        $scope.createMetric = function() {
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

            Metric.update($scope.metric,function(value, responseHeaders){
                    $location.path('/metrics/' + value.id);
                },
                function(err) {
                    throw { message: err.data};
                }

            );
        };
}]);
