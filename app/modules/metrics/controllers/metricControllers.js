/**
 * Module for all Metrics Controllers
 */

angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main'
])

/**
 * Factory for common functions, may needed in multiple controllers
 */
.factory('helper', ['dialogs', '$log', function(dialogs, $log) {
    return {
        /**
         * Base Controller for creating and editing a metric.
         * Thos two operations share most of the functionality, because they are using the same view.
         * @param $scope
         */
        baseCreateEditController: function($scope) {

            // Preset the current steo
            $scope.step = 'one';
            // The content for the column selection box.
            $scope.columnselection = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

            // Variable for storing the extra columns selection
            $scope.extracolumns = [];

            // Add an extra column
            $scope.addExtraColumn = function () {

                var c = {
                    i: $scope.extracolumns.length + 1,
                    column: null,
                    value: null
                };
                $scope.extracolumns.push(c);

            };

            // Remove an extra column
            $scope.removeExtraColumn = function (e) {
                var index = $scope.extracolumns.indexOf(e);
                $scope.extracolumns.splice(index, 1);
            };

            /**
             * Converts the content of the Handsontable to the data structure
             * of the Metrics Manager API.
             *  @returns {{table: Array, extra_columns: Array}}
             */
            $scope.convertRawInput = function () {
                var data = [];
                var extra = [];

                // Set the extra columns
                $scope.extracolumns.forEach(function (extraColumn) {
                    extra.push(extraColumn.value);
                });

                // Build the table
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

            // Preselection of the tabview
            $scope.tabsel = {
                grid: true,
                file: false
            };

            // Initial value of the data grid (Handsontable)
            $scope.grid = {
                // The actual data
                data: [[]],
                // Reference to the object
                instance: {}
            };

            // Display the secon step
            $scope.nextStep = function() {
                try {
                    // Validate first
                    $scope.validation();
                    $scope.step = 'second';
                }
                catch(err) {
                    dialogs.notify("Error",  err);
                }
            };

            // Go back to the first step
            $scope.prevStep = function() {
                $scope.step = 'one';
            };

            // Validate the user input
            $scope.validation = function() {
                // Check if every column was selected only once
                var columns = [
                    $scope.columns.from,
                    $scope.columns.to,
                    $scope.columns.value
                ];
                $scope.extracolumns.forEach(function (extraColumn) {
                    columns.push(extraColumn.column);
                });
                columns = _.map(columns, Number);
                var unique_columns = _.unique(columns);

                if(columns.length != unique_columns.length){
                    throw "You cannot choose the same column more than once!";
                }
            };

            // Configure the Dropzone.js
            $scope.dropzone = {
                config: {
                    clickable: true,
                    url: '/api/v1/metricsmanager/converter',
                    acceptedFiles: '.csv,.xls,.xlsx'
                },
                dropzone: {},
                handlers: {
                    // Callback for successful upload
                    success: function(file, response) {
                        // Go back to the data grid tab
                        $scope.tabsel = {
                            grid: true,
                            file: false
                        };
                        this.removeAllFiles();
                        $scope.$apply();
                        // Load the data into the grid
                        $scope.grid.data = response['result'];
                        $scope.grid.instance.loadData($scope.grid.data);
                    }
                }
            };
        }
    };
}])

/**
 * Controller for the list of metrics
 */
.controller('MetricsController', ['$scope', 'Metric', '$log', '$routeParams', function($scope, Metric, $log, $routeParams) {

    // Retrieve the metrics from the Metrics Service
	$scope.metrics = Metric.query(
            {page: $routeParams.page},
			function(metricList) {
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
			}
	);

}])

/**
 * Controller for the detail view of a metric
 */
.controller('MetricDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Metric',
        'dialogs',
        '$log',
        function($scope, $routeParams, $location, Metric, dialogs, $log) {

    // The grid view is not visible at first
    $scope.gridvisible = false;
    // The grid is not yet loaded
    $scope.gridloaded = false;

    // Initial value of the data grid (Handsontable)
    $scope.grid = {
        data: [[]],
        instance: {}
    };

    // Get the data of the Metric from the API
	$scope.metric = Metric.get({id: $routeParams.metricId},
			function(metric) {
			},
			function(err) {
                throw { message: JSON.stringify(err.data)};
			}
	);

    // Callback, fired when the metric data was loaded
    $scope.metric.$promise.then(function(metric){
        // Get the metric data suitable for the data grid
        $scope.grid.data = metric.getDataAsGrid();
        // Legend for the extra columns is stored here
        $scope.extralegend = [];

        var i = 0;
        // Build the extra legend
        $scope.metric.data.extra_columns.forEach(function (extraColumn) {
           $scope.extralegend.push(
               {
                   column: String.fromCharCode(68 + i),
                   value: extraColumn
               }
           );
           i++;
        });

        // The grid can be displayed now
        $scope.gridloaded = true;
    });

    // Show the grid view
    $scope.showData = function () {
        $scope.gridvisible = !$scope.gridvisible;
    };

    // Function for deleting the metric
    $scope.deleteMetric = function(metric) {
        // Open a confirmation dialog
        var dlg = dialogs.confirm(
            "Are you sure?",
            "Do you want to delete the Metric " + metric.acronym + " permanently?");
        dlg.result.then(function () {
            // Delete the metric via the API
            metric.$delete(
                {},
                function(){
                    $location.path('/metrics');
                }
            );
        });
    };

}])

/**
 * Controller for creating a metric
 */
.controller('MetricCreateController', [
        '$scope',
        'Metric',
        '$location',
        '$log',
        'helper',
        '$filter',
        'dialogs',
        function($scope, Metric, $location, $log, helper, $filter, dialogs) {

    // Init the base functionalities
    helper.baseCreateEditController($scope);

    // Mode is creation
    $scope.mode = "create";
    // The grid is empty and visible
    $scope.gridvisible = true;

    // Empty metric object
    $scope.metric = {};
    // Pre-set column selection boxes for basic data
    $scope.columns = {
        from: 0,
        to: 1,
        value: 2
    };

    // Create the metric via the API
	$scope.createMetric = function() {
        // The date has to be converted to the API specifications
        $scope.metric.resource_issued = $filter('date')($scope.metric.resource_issued, 'yyyy-MM-dd');
        // Hardcoded user for the moment
        $scope.metric.user_id = 1;
        // Convert the grid data
        $scope.metric.data = $scope.convertRawInput();

        // Save the Metric and redirect to the detail view
		Metric.save($scope.metric,function(value, responseHeaders){
			$location.path('/metrics/' + value.id);
		},
		function(err) {
            throw { message: JSON.stringify(err.data)};
		}
		);
	};

}])

/**
 * Controller for editing a metric
 */
.controller('MetricEditController', [
        '$scope',
        '$routeParams',
        'Metric',
        '$location',
        '$log',
        'helper',
        '$filter',
    function($scope, $routeParams, Metric, $location, $log, helper, $filter) {

        // Init the base functionalities
        helper.baseCreateEditController($scope);
        // Mode is editing
        $scope.mode = "edit";
        // No metric data yet, so grid is not visible
        $scope.gridvisible = false;

        // Get the metric data via the API
        $scope.metric = Metric.get({id: $routeParams.metricId},
            function(metric) {
            },
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        );

        // Callback when metric data has arrived
        $scope.metric.$promise.then(function(metric){
            // Change the references to the id
            $scope.metric.unit = $scope.metric.unit.id;
            $scope.metric.language = $scope.metric.language.id;
            if($scope.metric.external_resource != null) {
                $scope.metric.external_resource = $scope.metric.external_resource.id;
            } else {
                $scope.metric.external_resource = 0;
            }

            // Get the metric data in a suitable format for the data grid
            $scope.grid.data = metric.getDataAsGrid();
            // Now the grid can be displayed
            $scope.gridvisible = true;

            // Get the policy domains as one string
            var domains = [];
            $scope.metric.policy_domains.forEach(function (e) {
                domains.push(String(e.id));
            });
            $scope.metric.policy_domains = domains;
            $log.info($scope.metric.policy_domains);

            // Set the selection boxes to the extra columns
            for(var i=0; i < $scope.metric.data.extra_columns.length; i++) {
                $scope.extracolumns.push({
                    i: i + 1,
                    column: i + 3,
                    value: $scope.metric.data.extra_columns[i]
                });
            }

        });

        // Set the selection for the basic data
        $scope.columns = {
            from: 0,
            to: 1,
            value: 2
        };

        // Update the metric and redirect to the detail view
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
