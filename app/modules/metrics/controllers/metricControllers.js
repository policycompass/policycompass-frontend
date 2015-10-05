/**
 * Module for all Metrics Controllers
 */

angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main'
])

.controller('CreateMetric1Controller', ['$scope', '$modal', 'API_CONF', '$http', 'MetricsControllerHelper', '$location', function($scope, $modal, API_CONF, $http, MetricsControllerHelper, $location) {

    $scope.metrics_controller_helper = MetricsControllerHelper;
    $scope.metrics_controller_helper.init();

    $scope.variableIndex = 1;
    $scope.showFunctions = false;

    $scope.toggleFunctions = function() {
        $scope.showFunctions = !$scope.showFunctions;
    }

    $scope.addIndicator = function(indicator) {

        var i = " __" + $scope.variableIndex + "__ ";
        if (angular.isUndefined($scope.cursorPosVal) || angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
            if(angular.isUndefined($scope.metrics_controller_helper.metricsdata.formula)){
                $scope.metrics_controller_helper.metricsdata.formula = "";
            }
            $scope.metrics_controller_helper.metricsdata.formula = $scope.metrics_controller_helper.metricsdata.formula + i;
            //$("#formula-div").append('<span contentEditable="false" class="indicator-formula indicator-formula-selected">' + indicator.name + '</span>');
            //$("#formula-div").css('height', ($("#formula-div")[0].scrollHeight + 19) +  'px');
        }
        else{
            $scope.metrics_controller_helper.metricsdata.formula = [$scope.metrics_controller_helper.metricsdata.formula.slice(0, $scope.cursorPosVal), i, $scope.metrics_controller_helper.metricsdata.formula.slice($scope.cursorPosVal)].join('');
            //$("#formula-div").append('<span contentEditable="false" class="indicator-formula indicator-formula-selected">'+ indicator.name +'</span>' );
            //$("#formula-div").css('height',($("#formula-div")[0].scrollHeight + 19) + 'px');
            $scope.cursorPosVal = undefined;
        }
        $scope.variableIndex += 1;
        $scope.metrics_controller_helper.metricsdata.variables[i] = {"type": "indicator", "id": indicator.id}
    };

    $scope.getCursorPosition = function(event) {
        var element = event.target;
        $scope.doGetCaretPosition(element);

        /*var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        $scope.cursorPosVal = caretOffset;
        console.log($scope.cursorPosVal);*/
    };

    $scope.clearErrors = function() {
        $scope.servererror = undefined;
    }


    $scope.doGetCaretPosition = function(oField) {

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

    $scope.submitFormula = function () {

        var url = API_CONF.FORMULA_VALIDATION_URL;

        if ($scope.formulaForm.$valid) {
            $http({
                url: url,
                method: 'get',
                params: {formula: $scope.metrics_controller_helper.metricsdata.formula}}).
            then(function(response) {
                $location.path("/metrics/create-2")
            }, function(response) {
                $scope.servererror = response.data;
            });
        }
    };

}])

.controller('CreateMetric2Controller', ['$scope', '$modal', '$http', 'API_CONF', 'MetricsControllerHelper', '$location', function($scope, $modal, $http, API_CONF, MetricsControllerHelper, $location) {

    $scope.metrics_controller_helper = MetricsControllerHelper;

    $scope.submitData = function (applyAfterwards) {
        var url = API_CONF.METRICS_MANAGER_URL + "/metrics";

        if ($scope.metadataForm.$valid) {
            $http.post(url, $scope.metrics_controller_helper.metricsdata).
            then(function(response) {
                if(applyAfterwards){
                    $location.path("/metrics/" + response.data.id + "/apply-1");
                }
                else {
                    $location.path("/metrics/" + response.data.id);
                }
            }, function(response) {
                $scope.servererror = response.data;
            });
        }
    };

    $scope.clearErrors = function() {
        $scope.servererror = undefined;
    }

}])

.controller('ApplyMetric1Controller', ['$scope', '$routeParams', 'ApplyMetricHelper', '$location', function($scope, $routeParams, ApplyMetricHelper, $location) {

    $scope.apply_metric_helper = ApplyMetricHelper;
    $scope.apply_metric_helper.init($routeParams.metricId);

    $scope.submit = function () {
        _.each($scope.apply_metric_helper.data.datasets, function(value, key){
            delete value['indicator'];
        });
        $location.path("/metrics/" + $routeParams.metricId + "/apply-2")
    };

    $scope.highlightIndicator = function(variable, event) {

        var target = angular.element('#variable' + variable);
        target.css('background', 'linear-gradient(to bottom, #9ac1e3, #72a9d8)');
        target.css('color', 'white');
        target.css('border-color', '#3177b3');

        var el = event.currentTarget;
        var span = angular.element(el.children[0].children[0]);
        span.css('background', 'linear-gradient(to bottom, #9ac1e3, #72a9d8)');
        span.css('color', 'white');
        span.css('border-color', '#3177b3');


    };

    $scope.unhighlightIndicator = function(variable, event) {

        var target = angular.element('#variable' + variable);
        target.css('background', 'transparent');
        target.css('border', '1px solid #ffd964');
        target.css('color', '#b75c6f');

        var el = event.currentTarget;
        var span = angular.element(el.children[0].children[0]);
        span.css('background', 'transparent');;
        span.css('border', '1px solid #ffd964');
        span.css('color', '#4d4d4d');
    };

}])

.controller('ApplyMetric2Controller', ['$scope', '$routeParams', 'API_CONF', '$http', 'ApplyMetricHelper', '$location', function($scope, $routeParams, API_CONF, $http, ApplyMetricHelper, $location) {

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

}]);


