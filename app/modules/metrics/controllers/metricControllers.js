/**
 * Module for all Metrics Controllers
 */

angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main'
])


.controller('CreateMetric1Controller', [
    '$scope',
    '$modal',
    'API_CONF',
    '$http',
    'MetricsControllerHelper',
    '$location',
    'Auth',
    function($scope, $modal, API_CONF, $http, MetricsControllerHelper, $location, Auth) {

    $scope.variableIndex = 1;
    $scope.showFunctions = false;

    $scope.toggleFunctions = function() {
        $scope.showFunctions = !$scope.showFunctions;
    }

    $scope.addIndicator = function(indicator) {

        var i = "__" + $scope.variableIndex + "__";
        if (angular.isUndefined($scope.cursorPosVal) || angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
            if(angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
                $scope.metrics_controller_helper.metricsdata.formula = "";
            }
            $scope.metrics_controller_helper.metricsdata.formula = $scope.metrics_controller_helper.metricsdata.formula + i;
        }
        else{
            $scope.metrics_controller_helper.metricsdata.formula = [$scope.metrics_controller_helper.metricsdata.formula.slice(0, $scope.cursorPosVal), i, $scope.metrics_controller_helper.metricsdata.formula.slice($scope.cursorPosVal)].join('');
            $scope.cursorPosVal = undefined;
        }
        $scope.variableIndex += 1;
        $scope.metrics_controller_helper.metricsdata.variables[i] = {"type": "indicator", "id": indicator.id}
    };

            $scope.addIndicator = function(indicator) {
                var i = "__" + $scope.variableIndex + "__";
                if (angular.isUndefined($scope.cursorPosVal) || angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
                    if(angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
                        $scope.metrics_controller_helper.metricsdata.formula = "";
                    }
                    $scope.metrics_controller_helper.metricsdata.formula = $scope.metrics_controller_helper.metricsdata.formula + i;
                }
                else{
                    $scope.metrics_controller_helper.metricsdata.formula = [
                        $scope.metrics_controller_helper.metricsdata.formula.slice(
                            0,
                            $scope.cursorPosVal
                        ),
                        i,
                        $scope.metrics_controller_helper.metricsdata.formula.slice(
                            $scope.cursorPosVal
                        )
                        ].join('');
                    $scope.cursorPosVal = undefined;
                }
                $scope.variableIndex += 1;
                $scope.metrics_controller_helper.metricsdata.variables[i] = {"type": "indicator", "id": indicator.id}
            };

            $scope.getCursorPosition = function(event) {
                var oField = event.target;
                var iCaretPos = 0;

                // IE Support
                if (document.selection) {
                   oField.focus ();
                   var oSel = document.selection.createRange ();
                   oSel.moveStart ('character', -oField.value.length);
                   iCaretPos = oSel.text.length;
                }

                else if (oField.selectionStart || oField.selectionStart == '0') {
                    iCaretPos = oField.selectionStart;
                }
                $scope.cursorPosVal = iCaretPos;
            };

.controller('MetricsmanagerDetailController', ['$scope', '$routeParams', 'MetricService', 'IndicatorService', function($scope, $routeParams, MetricService, IndicatorService) {

    $scope.data = MetricService.get({id: $routeParams.metricId},
        function(metric) {
            var indicator_id = metric.indicator_id;
            $scope.indicator = IndicatorService.get({id: indicator_id},
                function(indicator){
                },
                function(err){
                    throw { message: JSON.stringify(err.data)};
                }
            );
        },
        function(err) {
            throw { message: JSON.stringify(err.data)};
        }
    );
.controller('ApplyMetric2Controller', [
    '$scope',
    '$routeParams',
    'API_CONF',
    '$http',
    'ApplyMetricHelper',
    '$location',
    function($scope, $routeParams, API_CONF, $http, ApplyMetricHelper, $location) {

        $scope.apply_metric_helper = ApplyMetricHelper;
        $scope.apply_metric_helper.init($routeParams.metricId);

        $scope.submit = function (applyAgain) {
            var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $routeParams.metricId + '/operationalize';
            $http.post(url, $scope.apply_metric_helper.data).
                then(function(response) {
                    if(applyAgain){
                        $location.path("/metrics/" + $routeParams.metricId + "/apply-1");
                    }
                    else{
                        $scope.apply_metric_helper.clear();
                        $scope.apply_metric_helper.getDatasets($routeParams.metricId);
                        $location.path("/datasets/" + response.data.dataset.id);
                    }
                }, function(response) {
                    $scope.servererror = response.data;
                });
        };

}])

.controller('MetricsmanagerDetailController', [
    '$scope',
    '$routeParams',
    'MetricService',
    'IndicatorService',
    function($scope, $routeParams, MetricService, IndicatorService) {

        $scope.data = MetricService.get({id: $routeParams.metricId},
            function(metric) {
                var indicator_id = metric.indicator_id;
                $scope.indicator = IndicatorService.get({id: indicator_id},
                    function(indicator){
                    },
                    function(err){
                        throw { message: JSON.stringify(err.data)};
                    }
                );
            },
            function(err) {
                throw { message: JSON.stringify(err.data)};
            }
        );
}])


/**
 * Controller for the list of metrics
 */
.controller('MetricsController', [
    '$scope',
    'Metric',
    '$log',
    '$routeParams',
    function($scope, Metric, $log, $routeParams) {

    // Retrieve the metrics from the Metrics Service
	$scope.metrics = Metric.query(
            {page: $routeParams.page},
			function(metricList) {
			},
			function(error) {
                throw { message: JSON.stringify(err.data)};
			}
	);

}]);
