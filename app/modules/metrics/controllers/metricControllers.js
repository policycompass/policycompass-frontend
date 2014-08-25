angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main'
])


.factory('MetricsControllerHelper', ['dialogs', '$log', function(dialogs, $log) {
    return {
        baseCreateEditController: function($scope) {
            $scope.step = 'one';
            $scope.columnselection = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            $scope.test = function () {
                dialogs.notify("Error", "hallo");
            };

            $scope.extresource = false;

            $scope.extracolumns = [];
            $scope.addExtraColumn = function () {

                var c = {
                    i: $scope.extracolumns.length + 1,
                    column: {},
                    value: {}
                };
                $scope.extracolumns.push(c);

            };
            $scope.removeExtraColumn = function (e) {
                var index = $scope.extracolumns.indexOf(e);
                $scope.extracolumns.splice(index, 1);

            };

            $scope.convertRawInput = function () {
                var data = [];
                var extra = [];

                $scope.extracolumns.forEach(function (extraColumn) {
                    extra.push(extraColumn.value);
                });

                $scope.grid.data.forEach(function(e){
                    if(e[0] != null && e[0] != ""){
                        var row = {
                            from: e[$scope.columns.from],
                            to: e[$scope.columns.to],
                            value: e[$scope.columns.value]
                        };

                        $scope.extracolumns.forEach(function (extraColumn) {
                            row[extraColumn.value] = e[extraColumn.column];
                        });

                        data.push(row);
                    }
                });
                return {
                    table: data,
                    extra_columns: extra
                };
            };

            $scope.tabsel = {
                grid: true,
                file: false
            };

            $scope.grid = {
                data: [[]],
                instance: {}
            };

            $scope.nextStep = function() {
                var val = validation();
                if (val == true) {
                    $scope.step = 'second';
                } else {
                    dialogs.notify("Error",  val);
                }
            };

            $scope.prevStep = function() {
                $scope.step = 'one';
            };

            var validation = function() {
                return true;
            };

            $scope.dropzone = {
                config: {
                    clickable: true,
                    url: '/api/v1/metricsmanager/converter',
                    acceptedFiles: '.csv,.xls,.xlsx'
                },
                dropzone: {},
                handlers: {
                    success: function(file, response) {
                        $scope.tabsel = {
                            grid: true,
                            file: false
                        };
                        this.removeAllFiles();
                        $scope.$apply();
                        $scope.grid.data = response['result'];
                        $scope.grid.instance.loadData($scope.grid.data);
                    }
                }
            };
        }
    };
}])

.controller('MetricsController', ['$scope', 'Metric', '$log', '$routeParams', function($scope, Metric, $log, $routeParams) {

	$scope.metrics = Metric.query(
            {page: $routeParams.page},
			function(metricList) {
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
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
    $scope.handson = {};
    $scope.gridvisible = false;

	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metric) {
			},
			function(err) {
                throw { message: JSON.stringify(err.data)};
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
        'MetricsControllerHelper',
        '$filter',
        'dialogs',
        function($scope, Metric, $location, $log, helper, $filter, dialogs) {

    helper.baseCreateEditController($scope);

    $scope.mode = "create";
    $scope.gridvisible = true;

    $scope.metric = {};
    $scope.columns = {
        from: 0,
        to: 1,
        value: 2
    };


	$scope.createMetric = function() {
        $scope.metric.resource_issued = $filter('date')($scope.metric.resource_issued, 'yyyy-MM-dd');
        $scope.metric.user_id = 1;
        $scope.metric.data = $scope.convertRawInput();

		Metric.save($scope.metric,function(value, responseHeaders){
			$location.path('/metrics/' + value.id);
		},
		function(err) {
            throw { message: JSON.stringify(err.data)};
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
        'MetricsControllerHelper',
        '$filter',
    function($scope, $routeParams, Metric, $location, $log, helper, $filter) {

        helper.baseCreateEditController($scope);
        $scope.mode = "edit";
        $scope.gridvisible = false;

        $scope.metric = Metric.get({id: $routeParams.metricId},
            function(metric) {
            },
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        );

        $scope.metric.$promise.then(function(metric){
            $scope.metric.unit = $scope.metric.unit.id;
            $scope.metric.language = $scope.metric.language.id;
            if($scope.metric.external_resource != null) {
                $scope.metric.external_resource = $scope.metric.external_resource.id;
            } else {
                $scope.metric.external_resource = 0;
            }

            $scope.grid.data = metric.getDataAsGrid();
            $scope.gridvisible = true;

            var domains = [];
            $scope.metric.policy_domains.forEach(function (e) {
                domains.push(String(e.id));
            });
            $scope.metric.policy_domains = domains;
            $log.info($scope.metric.policy_domains);

            for(var i=0; i < $scope.metric.data.extra_columns.length; i++) {
                $scope.extracolumns.push({
                    i: i + 1,
                    column: i + 3,
                    value: $scope.metric.data.extra_columns[i]
                });
            }

        });

        $scope.columns = {
            from: 0,
            to: 1,
            value: 2
        };

        $scope.createMetric = function() {
            $scope.metric.resource_issued = $filter('date')($scope.metric.resource_issued, 'yyyy-MM-dd');
            $scope.metric.user_id = 1;
            $scope.metric.data = $scope.convertRawInput();

            Metric.update($scope.metric,function(value, responseHeaders){
                    $location.path('/metrics/' + value.id);
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }

            );
        };
}]);
