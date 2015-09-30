/**
 * Module for all Metrics Controllers
 */

angular.module('pcApp.metrics.controllers.metric', [
    'pcApp.metrics.services.metric',
    'pcApp.references.services.reference',
    'dialogs.main'
])

.factory('Data', function (){
    return {
        creator: 1,
        title: "",
        formula: "",
        variables: {}
    };
})

.controller('CreateMetric1Controller', ['$scope', '$modal', 'API_CONF', '$http', 'Data', '$location', function($scope, $modal, API_CONF, $http, Data, $location) {

    $scope.data = Data;
    $scope.data = {
        creator: 1,
        title: "",
        formula: "",
        variables: {}
    };
    $scope.variableIndex = 1;

    var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators";

    $http.get(url).
        then(function(indicators) {
            $scope.indicators = _.map(indicators.data.results, function(indicator){
                return {
                    icon:"",
                    name: indicator.name,
                    acronym: indicator.acronym,
                    unit_category: indicator.unit_category,
                    id: indicator.id,
                    maker:"",
                    ticked: false}
            });
    }, function(response) {
            console.log(response);
    });

    $scope.addIndicator = function(indicator) {

        var i = " __" + $scope.variableIndex + "__ ";
        if (angular.isUndefined($scope.cursorPosVal)){
            $scope.data.formula = $scope.formula + i;
            //$("#formula-div").append('<span contentEditable="false" class="indicator-formula indicator-formula-selected">' + indicator.name + '</span>');
            //$("#formula-div").css('height', ($("#formula-div")[0].scrollHeight + 19) +  'px');
        }
        else{
            $scope.data.formula = [$scope.data.formula.slice(0, $scope.cursorPosVal), i, $scope.data.formula.slice($scope.cursorPosVal)].join('');
            //$("#formula-div").append('<span contentEditable="false" class="indicator-formula indicator-formula-selected">'+ indicator.name +'</span>' );
            //$("#formula-div").css('height',($("#formula-div")[0].scrollHeight + 19) + 'px');
            $scope.cursorPosVal = undefined;
        }
        $scope.variableIndex += 1;
        $scope.data.variables[i] = {"type": "indicator", "id": indicator.id}
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

    $scope.submit = function () {

        var url = API_CONF.FORMULA_VALIDATION_URL;

        if ($scope.formulaForm.$valid) {
            $http({
                url: url,
                method: 'get',
                params: {formula: $scope.data.formula}}).
            then(function(response) {
                $location.path("/metrics/create-2")
            }, function(response) {
                $scope.servererror = response.data;
            });
        }
    };

}])

.controller('CreateMetric2Controller', ['$scope', '$modal', '$http', 'API_CONF', 'Data', '$location', function($scope, $modal, $http, API_CONF, Data, $location) {
    $scope.data = Data;

    var url = API_CONF.INDICATOR_SERVICE_URL + "/indicators";

    $http.get(url).
        then(function(indicators) {
            $scope.indicators = _.map(indicators.data.results, function(indicator){
                return {
                    icon:"",
                    name: indicator.name,
                    acronym: indicator.acronym,
                    unit_category: indicator.unit_category,
                    id: indicator.id,
                    maker:"",
                    ticked: false}
            });
    }, function(response) {
            console.log(response);
    });

    $scope.submit = function () {
        var url = API_CONF.METRICS_MANAGER_URL + "/metrics";

        if ($scope.metadataForm.$valid) {
            $http.post(url, $scope.data).
            then(function(response) {
                $location.path("/metrics/" + response.data.id)
            }, function(response) {
                console.log(response);
                $scope.servererror = response.data;
            });
        }
    };

    $scope.clearErrors = function() {
        $scope.servererror = undefined;
    }

}])

.factory('DatasetService', function (){
    return {
        title: "",
        acronym: "",
        datasets: []
    };
})

.controller('ApplyMetric1Controller', ['$scope', '$routeParams', 'API_CONF', '$http', 'DatasetService', '$location', function($scope, $routeParams, API_CONF, $http, DatasetService, $location) {

    $scope.postdata = DatasetService;
    $scope.postdata = {
        title: "",
        acronym: "",
        datasets: []
    }

    $scope.metricId = $routeParams.metricId;

    var metric_url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $scope.metricId;

    $http.get(metric_url).
            then(function(response) {
                $scope.data = response.data;
                $scope.data.variablesJson = JSON.parse($scope.data.variables.replace(/'/g, '"'));
                _.each($scope.data.variablesJson, function(value, key){
                    $scope.postdata.datasets.push({variable : key.trim(), dataset: -1, indicator: value.id });
                });
            }, function(response) {
                console.log('error');
                console.log(response);
            });


    $scope.submit = function () {
        _.each($scope.postdata.datasets, function(value, key){
            delete value['indicator'];
        });
        $location.path("/metrics/" + $scope.metricId + "/apply-2")
    };

}])

.controller('ApplyMetric2Controller', ['$scope', '$routeParams', 'API_CONF', '$http', 'DatasetService', '$location', function($scope, $routeParams, API_CONF, $http, DatasetService, $location) {

    $scope.postdata = DatasetService;

    $scope.metricId = $routeParams.metricId;

    $scope.submit = function () {
        var url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $scope.metricId + '/operationalize';
        $http.post(url, $scope.postdata).
            then(function(response) {
                console.log(response);
                $location.path("/datasets/" + response.data.dataset.id)
            }, function(response) {
                console.log(response);
                $scope.servererror = response.data;
            });

    };

}])

.controller('MetricsmanagerDetailController', ['$scope', '$routeParams', 'API_CONF', '$http', function($scope, $routeParams, API_CONF, $http) {

    $scope.metricId = $routeParams.metricId;

    var metric_url = API_CONF.METRICS_MANAGER_URL + "/metrics/" + $scope.metricId;

    $http.get(metric_url).
            then(function(response) {
                $scope.data = response.data;
                var indicator_url = API_CONF.INDICATOR_SERVICE_URL + "/indicators/" + $scope.data.indicator;
                $http.get(indicator_url).
                    then(function(indicator) {
                        $scope.indicator = indicator.data;
                    }, function(response) {
                        console.log('error');
                        console.log(response);
                    });
            }, function(response) {
                console.log('error');
                console.log(response);
            });
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


