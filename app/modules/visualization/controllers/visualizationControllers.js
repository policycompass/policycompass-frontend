angular.module('pcApp.visualization.controllers.visualization', [
    'pcApp.visualization.services.visualization', 'pcApp.references.services.reference', 'pcApp.config'
])

    .factory('GetRelatedData', [
        'dialogs', '$log', function (dialogs, $log) {
            return {

                baseGetRelatedDataController: function ($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, API_CONF) {

                    $scope.getMetricData = function (posI, metricId, column, value, group) {
                        $scope.metric = Dataset.get({id: metricId}, function (metric) {

                            var data = {
                                id: metricId,
                                title: metric.title,
                                acronym: metric.acronym,
                                issued: metric.issued,
                                indicator: metric.indicator_id,
                            };

                            $scope.meticsRelated.push(data);
                                                        
                            if (!$scope.arrayListIndicators) {
                            	$scope.arrayListIndicators= [];
                            	$scope.urlListIndicators = '';
                            }
                            if (!$scope.arrayListIndicators[metric.indicator_id]) {
                            	                                                        
                            	if ($scope.urlListIndicators) {
                            		$scope.urlListIndicators += '&';
                            	}
                            	$scope.urlListIndicators += 'indicator='+metric.indicator_id;
                            	$scope.arrayListIndicators[metric.indicator_id] = metric.indicator_id;
                           	}

                        }, function (err) {
                            throw {message: JSON.stringify(err.data)};
                        });
                    };


                    $scope.getHistoricalEventcData = function (eventId, colorevent) {

                        var coloreventFinal = [];
                        if (colorevent) {
                            coloreventFinal[eventId] = colorevent;
                        } else {
                            coloreventFinal[eventId] = '#ffffff';
                        }
                        $scope.her = Event.get({id: eventId}, function (her) {

                            var data = {
                                event_id: her.id,
                                title: her.title,
                                color: coloreventFinal[her.id],
                            };

                            $scope.historicalEventsRelated.push(data);


                        }, function (err) {
                            throw {message: JSON.stringify(err.data)};
                        });
                    };


                    $scope.meticsRelated = [];
                    $scope.historicalEventsRelated = [];


                }

            }
        }
    ])


    .controller('controllercorrectmetriclist', [
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        'dialogs',
        '$log',
        'API_CONF',
        function ($scope, $route, $routeParams, $location, dialogs, $log, API_CONF) {


            if ($scope.numberrows == 0) {
                $scope.correctmetrics = "";
            } else {
                $scope.correctmetrics = $scope.numberrows;
            }


        }
    ])

    .controller('LoadCombosMetricModal', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Metric',
        'Dataset',
        '$location',
        'GetRelatedData',
        'dialogs',
        '$log',
        'API_CONF',
        'Individual',
        'Unit',
        function ($scope, $route, $routeParams, $modal, Metric, Dataset, $location, helper, dialogs, $log, API_CONF, Individual, Unit) {


        }
    ])


    .controller('LoadCombosMetric', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Metric',
        'Dataset',
        '$location',
        'GetRelatedData',
        'dialogs',
        '$log',
        'API_CONF',
        'Individual',
        'Unit',
        function ($scope, $route, $routeParams, $modal, Metric, Dataset, $location, helper, dialogs, $log, API_CONF, Individual, Unit) {

            if ($scope.LoadCombosMetricExecuted != 1) {

                $scope.LoadCombosMetricExecuted = 0;
                $scope.loadDataCombos = function (idMetric, valueColumTemp, valueGroupTemp) {

					id = idMetric;
										
                	$scope.metricSelectedArray[idMetric] = Dataset.get({id: idMetric}, function (getMetric) {

						$scope.correctmetrics = "1";

                    	var containerIndex = idMetric;

                        myText = "grouping column";
                        $arrayComboValues_yaxe = [];
                        $arrayComboValues = [];

                        var posValue = -1;
                        var posGroup = -1;

                        if ($scope.metricSelectedArray[idMetric].data) {
                            arrayIndividualListDataset = $scope.metricSelectedArray[idMetric].data['table'];
                        } else {
                            arrayIndividualListDataset = [];
                        }

                        $arrayComboValues_Individuals = [];
                        $arrayComboValuesChecked = [];

                        $scope.individualCombo_value_[idMetric] = [];
                        for (x = 0; x < arrayIndividualListDataset.length; x++) {
                        	
                            if (arrayIndividualListDataset[x].individual) {
                                $dataIndividual = Individual.getById(arrayIndividualListDataset[x].individual);
					
                                $dataIndividual.$promise.then(function (indivudual) {
                                	var iscountry=false;
                                	if (indivudual.code) {
                                		iscountry=true;
                                	}
                                    $arrayValores = {
                                        "id": indivudual.id,
                                        "title": indivudual.title,
                                        "iscountry": iscountry
                                    };
                                    
                                    $arrayComboValues_Individuals.push($arrayValores);
                                    $arrayComboValuesChecked.push($arrayValores['id']);

                                    var TMP1 = [];
                                    if ($scope.individualCombo_value_[containerIndex]) {
                                        TMP1 = $scope.individualCombo_value_[containerIndex];
                                    }

                                    TMP1.push($arrayValores);
                                    $scope.individualCombo_value_[containerIndex] = TMP1;

                                    if ($scope.mode == 'create') {
                                        var TMP2 = [];
                                        
                                        if ($scope.IndividualDatasetCheckboxes_[containerIndex]) {
                                            TMP2 = $scope.IndividualDatasetCheckboxes_[containerIndex];
                                        }
										
										//console.log($scope.IndividualDatasetCheckboxes_[containerIndex].indexOf($arrayValores['id']));
										
										
										if ($scope.IndividualDatasetCheckboxes_.indexOf(containerIndex)<0) {											
											$scope.IndividualDatasetCheckboxes_[containerIndex] = [];
										}									
										
                                       	TMP2.push($arrayValores['id']);
                                       	$scope.IndividualDatasetCheckboxes_[containerIndex] = TMP2;
                                       	$scope.ModalIndividualDatasetCheckboxes_[containerIndex] = TMP2;
                                       	
                                       	//console.log(arrayIndividualListDataset.length);
                                       	//console.log($scope.ModalIndividualDatasetCheckboxes_[containerIndex].length);
                                       	if (arrayIndividualListDataset.length==$scope.ModalIndividualDatasetCheckboxes_[containerIndex].length) {
                                       		$scope.showListIndividuals[containerIndex] = true;
                                       	}
                                       	
                                       	//$scope.ModalIndividualDatasetCheckboxes_[containerIndex] = angular.copy(TMP2);
                                             

                                    }
                                    else {
                                    	$scope.showListIndividuals[containerIndex] = true;
                                       	//if (arrayIndividualListDataset.length==$scope.ModalIndividualDatasetCheckboxes_[containerIndex].length) {
                                       	//	$scope.showListIndividuals[containerIndex] = true;	
                                       	//}
                                    	
                                    	/*
                                        var a = $scope.DatasetsLoaded.indexOf(containerIndex);
                                        if (a >= 0) {
                                            var a = $scope.IndividualDatasetCheckboxes_[containerIndex].indexOf($arrayValores['id']);
                                            if (a < 0) {                                            	                                            
                                                $scope.IndividualDatasetCheckboxes_[containerIndex].push($arrayValores['id']);
                                                $scope.ModalIndividualDatasetCheckboxes_[containerIndex].push($arrayValores['id']);
                                            }
                                        }
                                        */
                                    }

                                });

                            }
                        }

                        $scope.optionsCombo_value_[containerIndex] = $arrayComboValues_yaxe;
                        $scope.optionsCombo_[containerIndex] = $arrayComboValues;

                        if (posValue >= 0) {
                            $scope.MetricSelectorDataColumn_[containerIndex] = $scope.optionsCombo_value_[containerIndex][posValue];
                        }

                        if (posGroup > 0) {
                            $scope.MetricSelectorGroupingData_[containerIndex] = $scope.optionsCombo_[containerIndex][posGroup];
                        }

                    }, function (error) {
                        throw {message: JSON.stringify(error.data.message)};
                    });
                };

                var myText = "from";
                if ($scope.MetricSelectorLabelColumn_[$scope.metric.id]) {
                    myText = $scope.MetricSelectorLabelColumn_[$scope.metric.id];
                }

                $scope.MetricSelectorLabelColumn_[$scope.metric.id] = myText;

                if ($scope.mode == 'edit') {
                    var id = $scope.metric.id;

                    var myindex = 0;
                    var maxsize = $scope.visualization.datasets_in_visualization.length;
                    var semaforo = false;
                    for (xi = 0; xi < maxsize; xi++) {
                        if ($scope.visualization.datasets_in_visualization[xi].dataset_id == $scope.metric.id) {
                            myindex = xi;
                            semaforo = true;
                        }
                    }

                    configurationMetricsFilters = $scope.visualization.datasets_in_visualization[myindex].visualization_query;

                    if (semaforo) {
                        var arrayConfigMetricsFilters = configurationMetricsFilters.split(",");
                    } else {
                        var arrayConfigMetricsFilters = "";

                        var a = $scope.DatasetsLoaded.indexOf(id);
                        if (a < 0) {
                            $scope.DatasetsLoaded.push(id);
                        }
                    }

                    var valueColumTemp = "";
                    var valueGroupTemp = "";
                    $scope.IndividualSelectorLabelColumn_[id] = [];
                    
                    var pushData = false;
                    if ($scope.IndividualDatasetCheckboxes_[id]) {
                    	
                    }
                    else {
                    	$scope.IndividualDatasetCheckboxes_[id] = [];
                    	$scope.ModalIndividualDatasetCheckboxes_[id] = [];
                    	pushData = true;
                    }
                    
                    for (x = 0; x < arrayConfigMetricsFilters.length; x++) {
                        var dataFilter = arrayConfigMetricsFilters[x].split(":");

                        if (dataFilter[0] == 'Label') {
                            $scope.MetricSelectorLabelColumn_[id] = dataFilter[1];
                        }
						else if (dataFilter[0] == 'Individual') {
                            var lisIndividuals = dataFilter[1].split(";");
                            if (lisIndividuals) {
                                for (xi = 0; xi < lisIndividuals.length; xi++) {
                                    varTmp = {
                                        'id': parseInt(lisIndividuals[xi]),
                                        'title': ''
                                    };
                                    $scope.IndividualSelectorLabelColumn_[id].push(varTmp);

                                    varTmp = parseInt(lisIndividuals[xi]);

                                    if (pushData) {
                                    	$scope.IndividualDatasetCheckboxes_[id].push(varTmp);
                                    	$scope.ModalIndividualDatasetCheckboxes_[id].push(varTmp);
                                    }
                                }
                            }
                        }
                    }
                    
                    $scope.loadDataCombos($scope.metric.id, valueColumTemp, valueGroupTemp);
                } else {              	
                    $scope.loadDataCombos($scope.metric.id, "", "");                    
                }
            }
        }
    ])


	.directive("formOnChange", function($parse, $interpolate){
	  return {
	    require: "form",
	    link: function(scope, element, attrs, form){
	      
	      element.on("change", function(){
	      	scope.disableRevert = false;
	        
	      });
	    }
	  };
	})

    .factory('VisualizationsControllerHelper', [
        '$filter', 'dialogs', '$log', '$interval', '$timeout', function ($filter, dialogs, $log, $interval, $timeout) {
            return {

                baseVisualizationsCreateController: function ($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, API_CONF, Individual, Unit) {

                    //$scope.colorScale = d3.scale.category20();				
					$scope.disableRevert = true;
					
					$scope.colorScale = function () {
						
						var randomColor = Math.floor(Math.random()*16777215).toString(16);	
						while (randomColor.length<6) {
							randomColor = '0'+randomColor;
						}	
						return '#'+randomColor;
					}
					
					$scope.curPageDataset = 1;
					//$scope.pageSizeDataset = 5;
					//$scope.pageSizeDataset = 6;
					$scope.pageSizeDataset = 6;
					$scope.pagePagesSizeDataset = 10;
					
					$scope.pageChangedDataset = function() {
							
					}
					
                    $scope.posSliderMap = 0;
                    $scope.rangeDatesSliderMin = 0;
                    $scope.rangeDatesSliderMax = 0;

                    $scope.showPlay = true;
                    $scope.showPause = false;
                    $scope.showStop = false;

                    var stop;

                    $scope.replayBar = function () {
                        $scope.showReplay = false;
                        stop = undefined;
                        $scope.rangeDatesSliderMin = 0;


                        $scope.playBar();
                    }
                    $scope.playBar = function () {

                        $timeout(function () {
                            $scope.$broadcast('rzSliderForceRender');
                        });

                        $scope.showPause = true;
                        $scope.showPlay = false;
                        $scope.showStop = true;
                        var i = 0;
                        var max = 0;
                        if ($scope.isSelectedParent(1)) {
                            i = $scope.rangeDatesSliderMin;
                            max = $scope.mapTimeSlider.length;
                        } else {
                            i = $scope.rangeDatesSliderMin;
                            max = $scope.numbers2.length;
                        }

						//console.log("i="+i);
                        if (angular.isDefined(stop)) return;

                        stop = $interval(function () {

                            if (i < (max - 1)) {                                
                                $scope.rangeDatesSliderMin = i + 1;                                
                            } else {
                                if (angular.isDefined(stop)) {
                                    $interval.cancel(stop);
                                    stop = undefined;
                                }
                                $scope.showPause = false;
                                $scope.showPlay = false;
                                $scope.showStop = false;
                                $scope.showReplay = true;
                            }
                            i = i + 1;
                        }, 2000);
                    };

                    $scope.pauseBar = function () {

                        $timeout(function () {
                            $scope.$broadcast('rzSliderForceRender');
                        });

                        $scope.showPlay = true;
                        $scope.showPause = false;

                        if (angular.isDefined(stop)) {
                            $interval.cancel(stop);
                            stop = undefined;
                        }
                    };

                    $scope.stopBar = function () {

                        $timeout(function () {
                            $scope.$broadcast('rzSliderForceRender');
                        });

                        $scope.showPause = false;
                        $scope.showPlay = true;
                        $scope.showStop = false;
                        $scope.rangeDatesSliderMin = 0;

                        if (angular.isDefined(stop)) {
                            $interval.cancel(stop);
                            stop = undefined;
                            $scope.rangeDatesSliderMin = 0;
                        }
                    };


                    $scope.translateCountryDataValue = function (value) {

                        var returnValue = 0;
                        var arrayLabelsDataPie = [];
                        var arrayValuesDataPie = [];
                        var arrayUnitsDataPie = [];

                        if (($scope.mapTimeSlider) && (parseInt(value) >= 0)) {
                            if ($scope.mapTimeSlider[value]) {
                                returnValue = $scope.mapTimeSlider[value];
                                var icnt = $scope.rangeDatesSliderMin;
                                var maxRange = $scope.rangeDatesSliderMax;
                                var Key = "";
                            }
                        } else {
                            returnValue = value;
                        }
                        return returnValue;
                    }

                    $scope.translateCountryValue = function (value) {
                        return $scope.translateCountryDataValue(value);
                    }
					
					
                    $scope.translateCountrySlider = function (value) {
                    	/*
                        if (value != 0) {
                            if (($scope.typeToPlot === 'map_1') || ($scope.typeToPlot === 'mercator') || ($scope.typeToPlot === 'conicConformal') || ($scope.typeToPlot === 'equirectangular') || ($scope.typeToPlot === 'orthographic') || ($scope.typeToPlot === 'azimuthalEqualArea')) {
                                if ($scope.rangeDatesSliderMin == value) {
                                    if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                        $scope.plotMapChart();
                                    }

                                }
                            }
                        }
						*/
                        return $scope.translateCountryDataValue(value);
                    }
					
					
                    $scope.translatePieValue = function (value) {
                        var returnValue = 0;
                        if (($scope.numbers2) && (parseInt(value) >= 0)) {
                            if ($scope.numbers2[value]) {
                                returnValue = $scope.numbers2[value]['Key'];
                            }
                        } else {
                            returnValue = value;
                        }
                        return returnValue;
                    }

					/*
					$scope.changeValueSliderPie  = function (value) {
						//console.log("changeValueSliderPie");
						console.log(value);
					}
					*/
					
					$scope.$watch('rangeDatesSliderMin', function (dataset) {
						
						var value = $scope.rangeDatesSliderMin;
                        
                        var arrayLabelsDataPie = [];
                        var arrayValuesDataPie = [];
                        var arrayUnitsDataPie = [];
                        var arrayColorsDataPie = [];

                        var plotChart = false;

                        if (($scope.numbers2) && (parseInt(value) >= 0)) {
                            plotChart = true;
                            if ($scope.numbers2[value]) {
                                returnValue = $scope.numbers2[value]['Key'];
                            }

                            var icnt = $scope.rangeDatesSliderMin;
                            var maxRange = $scope.rangeDatesSliderMax;
                            var Key = "";

                            icnt = value;
                            //USED FOR TESTING
                            if (1 == 1) {
                                if (Key) {
                                    Key = Key + " and ";
                                }

                                if (!icnt) {
                                    icnt = 0;
                                }

                                if ($scope.numbers2[icnt] === undefined) {
                                } else {
                                    Key = Key + $scope.numbers2[icnt]['Key'];

                                    l = icnt;
                                    for (var label in $scope.numbers2[l].Labels) {
                                        var labelName = $scope.numbers2[l].Labels[label];
                                        var valueName = $scope.numbers2[l].Values[label];
                                        var unitsName = $scope.numbers2[l].Units[label];
                                        var colorName = $scope.numbers2[l].Colors[label];

                                        var a = arrayLabelsDataPie.indexOf(labelName);

                                        if (a >= 0) {
                                            arrayValuesDataPie[a] = parseInt(arrayValuesDataPie[a]) + parseInt(valueName);
                                            var b = arrayUnitsDataPie.indexOf(unitsName);
                                            if (b >= 0) {

                                            } else {
                                                arrayUnitsDataPie.push(unitsName);
                                            }
                                        } else {
                                            arrayLabelsDataPie.push(labelName);
                                            arrayValuesDataPie.push(valueName);
                                            arrayUnitsDataPie.push(unitsName);
                                            arrayColorsDataPie.push(colorName);

                                        }
                                    }
                                }
                                icnt = icnt + 1;
                            }
                        } 

                        if (plotChart) {
                            $scope.change_slider_value = value;
                        }

                        if (plotChart) {
                            var ObjectData = {
                                'Key': Key,
                                'Labels': arrayLabelsDataPie,
                                'Values': arrayValuesDataPie,
                                'Units': arrayUnitsDataPie,
                                'Colors': arrayColorsDataPie
                            };
                            
                            
                            $scope.dataset = [];
                            $scope.dataset.push(ObjectData);
                            
                            if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                            	
                            	if ($scope.rangeDatesSliderMin == value) {
	                                $scope.plotPieChart();

                               	}
                            }
                            
                         }


						if (value != 0) {
                            if (($scope.typeToPlot === 'map_1') || ($scope.typeToPlot === 'mercator') || ($scope.typeToPlot === 'conicConformal') || ($scope.typeToPlot === 'equirectangular') || ($scope.typeToPlot === 'orthographic') || ($scope.typeToPlot === 'azimuthalEqualArea')) {
                                if ($scope.rangeDatesSliderMin == value) {
                                    if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                        $scope.plotMapChart();
                                    }

                                }
                            }
                        }
						
						//$scope.dataset = [];
						//$scope.dataset = angular.copy($scope.dataset_pie_chart);
					});
					
                    $scope.translateFunction = function (value) {
						
                        var returnValue = 0;
                        returnValue = $scope.translatePieValue(value);     
                        /*                   
                        var arrayLabelsDataPie = [];
                        var arrayValuesDataPie = [];
                        var arrayUnitsDataPie = [];
                        var arrayColorsDataPie = [];

                        var plotChart = false;

                        if (($scope.numbers2) && (parseInt(value) >= 0)) {
                            plotChart = true;
                            if ($scope.numbers2[value]) {
                                returnValue = $scope.numbers2[value]['Key'];
                            }

                            var icnt = $scope.rangeDatesSliderMin;
                            var maxRange = $scope.rangeDatesSliderMax;
                            var Key = "";

                            icnt = value;
                            //USED FOR TESTING
                            if (1 == 1) {
                                if (Key) {
                                    Key = Key + " and ";
                                }

                                if (!icnt) {
                                    icnt = 0;
                                }

                                if ($scope.numbers2[icnt] === undefined) {
                                } else {
                                    Key = Key + $scope.numbers2[icnt]['Key'];

                                    l = icnt;
                                    for (var label in $scope.numbers2[l].Labels) {
                                        var labelName = $scope.numbers2[l].Labels[label];
                                        var valueName = $scope.numbers2[l].Values[label];
                                        var unitsName = $scope.numbers2[l].Units[label];
                                        var colorName = $scope.numbers2[l].Colors[label];

                                        var a = arrayLabelsDataPie.indexOf(labelName);

                                        if (a >= 0) {
                                            arrayValuesDataPie[a] = parseInt(arrayValuesDataPie[a]) + parseInt(valueName);
                                            var b = arrayUnitsDataPie.indexOf(unitsName);
                                            if (b >= 0) {

                                            } else {
                                                arrayUnitsDataPie.push(unitsName);
                                            }
                                        } else {
                                            arrayLabelsDataPie.push(labelName);
                                            arrayValuesDataPie.push(valueName);
                                            arrayUnitsDataPie.push(unitsName);
                                            arrayColorsDataPie.push(colorName);

                                        }
                                    }
                                }
                                icnt = icnt + 1;
                            }
                        } else {
                            returnValue = value;
                        }

                        if (plotChart) {
                            $scope.change_slider_value = value;
                        }

                        if (plotChart) {
                            var ObjectData = {
                                'Key': Key,
                                'Labels': arrayLabelsDataPie,
                                'Values': arrayValuesDataPie,
                                'Units': arrayUnitsDataPie,
                                'Colors': arrayColorsDataPie
                            };
							
							
							
							
                            //$scope.dataset = [];
                            //$scope.dataset.push(ObjectData);

                            if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                            	
                            	if ($scope.rangeDatesSliderMin == value) {
	                                $scope.plotPieChart();

                               	}
                            }
                            
				
                            $scope.change_slider_value = value;
                        }
						*/
                        return returnValue;
                    }
					
					
                    //used while dataset not return resolutions
                    $scope.onlyTheirResolution = false;

                    $scope.resolutionoptions = [
                        {
                            label: 'Day',
                            value: 'day'
                        }, {
                            label: 'Month',
                            value: 'month'
                        }, {
                            label: 'Quarter',
                            value: 'quarter'
                        }, {
                            label: 'Year',
                            value: 'year'
                        }
                    ];

                    $scope.arrayResolutions = [];
                    $scope.arrayResolutionsFilter = [];

                    if ($scope.onlyTheirResolution) {
                        $scope.arrayResolutions['day'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }
                        ];

                        $scope.arrayResolutionsFilter['day'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }
                        ];

                        $scope.arrayResolutions['month'] = [
                            {
                                label: 'Month',
                                value: 'month'
                            }
                        ];

                        $scope.arrayResolutionsFilter['month'] = [
                            {
                                label: 'Month',
                                value: 'month'
                            }
                        ];

                        $scope.arrayResolutions['quarter'] = [
                            {
                                label: 'Quarter',
                                value: 'quarter'
                            }
                        ];

                        $scope.arrayResolutionsFilter['quarter'] = [
                            {
                                label: 'Quarter',
                                value: 'quarter'
                            }
                        ];

                        $scope.arrayResolutions['year'] = [
                            {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.arrayResolutionsFilter['year'] = [
                            {
                                label: 'Year',
                                value: 'year'
                            }
                        ];


                    } else {

                        $scope.arrayResolutions['day'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }, {
                                label: 'Month',
                                value: 'month'
                            }, {
                                label: 'Quarter',
                                value: 'quarter'
                            }, {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.arrayResolutionsFilter['day'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }
                        ];

                        $scope.arrayResolutions['month'] = [
                            {
                                label: 'Month',
                                value: 'month'
                            }, {
                                label: 'Quarter',
                                value: 'quarter'
                            }, {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.arrayResolutionsFilter['month'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }, {
                                label: 'Month',
                                value: 'month'
                            }
                        ];

                        $scope.arrayResolutions['quarter'] = [
                            {
                                label: 'Quarter',
                                value: 'quarter'
                            }, {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.arrayResolutionsFilter['quarter'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }, {
                                label: 'Month',
                                value: 'month'
                            }, {
                                label: 'Quarter',
                                value: 'quarter'
                            }
                        ];

                        $scope.arrayResolutions['year'] = [
                            {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.arrayResolutionsFilter['year'] = [
                            {
                                label: 'Day',
                                value: 'day'
                            }, {
                                label: 'Month',
                                value: 'month'
                            }, {
                                label: 'Quarter',
                                value: 'quarter'
                            }, {
                                label: 'Year',
                                value: 'year'
                            }
                        ];

                        $scope.FilterResolution = $scope.arrayResolutions['year'];

                    }

                    $scope.checkAll = function () {

                        if ($scope.mode == 'view') {
                            if ($scope.selectedAll) {
                                selectionChecked = false;
                            } else {
                                selectionChecked = true;
                            }
                        } else {
                            if ($scope.selectedAll) {
                                selectionChecked = true;
                            } else {
                                selectionChecked = false;
                            }
                        }
                        $scope.selectedAll = selectionChecked;

                        angular.forEach($scope.numbers2, function (item) {
                            $scope.selection.Keys[item.Key] = selectionChecked;
                        });
                    };


                    $scope.plotMapChart = function () {
                    	
                        if (document.getElementById("container_graph_" + $scope.visualization.id) != null) {
                            document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = "";
                        } else {
                            document.getElementById("container_graph_").innerHTML = "";
                        }

                        var margin = {
                            top: 20,
                            right: 20,
                            bottom: 55,
                            left: 44
                        }, width = 980, height = 426, font_size = 11;

                        var from_country = '';
                        var to_country = '';

                        var initialZoomMap = 2;
                        if (document.getElementById('initialZoom').value > 0) {
                            initialZoomMap = document.getElementById('initialZoom').value;
                        }

                        if (document.getElementById('initialLat').value) {
                            var initialLat = document.getElementById('initialLat').value;
                        }

                        if (document.getElementById('initialLng').value) {
                            var initialLng = document.getElementById('initialLng').value;
                        }

                        if ($scope.list) {
                            margin.top = margin.top / 5;
                            margin.right = margin.right / 5;
                            margin.bottom = margin.bottom / 5;
                            margin.left = margin.left / 5;
                            width = width / 5;
                            height = height / 5;
                            font_size = font_size / 5;
                            $scope.showLegend = false;
                            $scope.showZoom = false;
                            $scope.showBubbles = false;
                            $scope.showMovement = false;
                            $scope.showBubbles = false;
                        } else {
                            from_country = $scope.translateCountryValue($scope.rangeDatesSliderMin);
                            to_country = $scope.translateCountryValue($scope.rangeDatesSliderMin);
                        }

                        var mapObj = policycompass.viz.mapLeaflet({
                            'idName': "container_graph_" + $scope.visualization.id,
                            'width': width,
                            'height': height,
                            'margin': margin,
                            'font_size': font_size,
                            'mode': $scope.mode,
                            'scaleColor': $scope.scaleColor,
                            'legend': $scope.showLegend,
                            'projection': $scope.typeToPlot,
                            'showZoom': $scope.showZoom,
                            'initialLat': initialLat,
                            'initialLng': initialLng,
                            'initialZoom': initialZoomMap,
                            'showBubbles': $scope.showBubbles,
                            'showMovement': $scope.showMovement,
                            'data': $scope.datasetToSendMap,
                            'from_country': from_country,
                            'to_country': to_country
                        });

                    }


                    $scope.plotPieChart = function () {                    	
                        if ($scope.typeToPlot === 'graph_pie') {

                            var margin = {
                                top: 20,
                                right: 20,
                                bottom: 40,
                                left: 20
                            };

                            var width = 980, height = 326, //radius = Math.min(width, height) / 2;
                                radius = 180,

                                innerRadious = 50, font_size = 11;

                            var cntPies = 0;

                            if ($scope.list) {
                                radius = radius / 5;
                                width = width / 5;
                                height = height / 5;
                                margin.top = margin.top / 5;
                                margin.right = margin.right / 5;
                                margin.bottom = margin.bottom / 5 + 3;
                                margin.left = margin.left / 5;
                                innerRadious = innerRadious / 5;
                                font_size = font_size / 5;
                                $scope.showLegend = false;
                            }


                            if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                if ($scope.visualization.id) {
                                    document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = "";
                                } else {
                                    document.getElementById("container_graph_").innerHTML = "";
                                }
                            }


                            $scope.dataset.forEach(function (d, i) {
                                if (i == 0) {
                                    $style = '';
                                } else {
                                    $style = 'style="display: none;"';
                                }


                                if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                    if (document.getElementById("container_graph_" + $scope.visualization.id) != null) {
                                        document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = document.getElementById("container_graph_" + $scope.visualization.id).innerHTML + "<div class='pie_" + $scope.visualization.id + "' id='pie_" + $scope.visualization.id + "_" + i + "' " + $style + "></div>"
                                    } else {
                                        document.getElementById("container_graph_").innerHTML = document.getElementById("container_graph_").innerHTML + "<div class='pie_' id='pie__" + i + "' " + $style + "></div>"
                                    }
                                }

                            });


                            $scope.dataset.forEach(function (d, i) {

                                if (1 == 1) {
                                    var datasetToSend = d;

                                    if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                        var pieObj = policycompass.viz.pie({
                                            'idName': "pie_" + $scope.visualization.id + "_" + i,
                                            'visualizationid': $scope.visualization,
                                            'idPie': cntPies,
                                            'width': width,
                                            'height': height,
                                            'margin': margin,
                                            'radius': radius,
                                            'innerRadious': innerRadious,
                                            'font_size': font_size,
                                            'showLegend': $scope.showLegend, //'showLines': $scope.showLines,
                                            'showLabels': $scope.showLabels, //'showGrid': $scope.showGrid
                                        });

                                        pieObj.render(datasetToSend);
                                    }


                                }

                                cntPies = cntPies + 1;

                            });

                        }
                    }

                    $scope.angularpiechartdisplaybycheckbox = function () {

                        var arrayTemp = [];
                        var arrayLabelsDataPie = [];
                        var arrayValuesDataPie = [];
                        var arrayUnitsDataPie = [];
                        var position = ""
                        for (var k in $scope.selection.Keys) {
                            if ($scope.selection.Keys[k]) {
                                for (var l in $scope.numbers2) {
                                    if (k == $scope.numbers2[l].Key) {
                                        if (position == "") {
                                            position = k;
                                        } else {
                                            position = position + " and " + k;
                                        }


                                        for (var label in $scope.numbers2[l].Labels) {
                                            var labelName = $scope.numbers2[l].Labels[label];
                                            var valueName = $scope.numbers2[l].Values[label];
                                            var unitsName = $scope.numbers2[l].Units[label];
                                            var a = arrayLabelsDataPie.indexOf(labelName);

                                            if (a >= 0) {
                                                arrayValuesDataPie[a] = parseInt(arrayValuesDataPie[a]) + parseInt(valueName);

                                                var b = arrayUnitsDataPie.indexOf(unitsName);
                                                if (b >= 0) {

                                                } else {
                                                    arrayUnitsDataPie.push(unitsName);
                                                }
                                            } else {
                                                arrayLabelsDataPie.push(labelName);
                                                arrayValuesDataPie.push(valueName);
                                                arrayUnitsDataPie.push(unitsName);
                                            }
                                        }

                                    }
                                }
                            }
                        };
                        
                        var ObjectData = {
                            'Key': position,
                            'Labels': arrayLabelsDataPie,
                            'Values': arrayValuesDataPie,
                            'Units': arrayUnitsDataPie
                        };

                        $scope.dataset = [];

                        $scope.dataset.push(ObjectData);

                        if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                            $scope.plotPieChart();
                        }
                    };

                    $scope.angularpiechartdisplay = function () {
                        var selectedValue = "";

                        selectedValue = $('#dateselector option:selected').val();

                        if (isNaN(selectedValue)) {
                            $('.pie').show();
                        } else {
                            $('.pie').hide();
                            $('#pie_' + selectedValue).show();
                        }

                    };


                    $scope.meticsRelated = [];


                    $scope.getMetricData = function (posI, metricId, column, value, group) {

                        $scope.metric = Dataset.get({id: metricId}, function (metric) {

                            var data = {
                                id: metric.id,
                                title: metric.title,
                                acronym: metric.acronym,
                                issued: metric.issued,
                            };

                            $scope.meticsRelated.push(data);

                        }, function (err) {
                            throw {message: JSON.stringify(err.data)};
                        });
                    };

                    // Variable for storing the metrics filtered list

                    if (!document.getElementById("tooltip")) {
                        tooltip = d3.select("body").append("div").attr("id", "tooltip").html("").attr("class", "tooltip right in fade").style("opacity", 0);
                    }

                    var openedLabels = 0;

                    mousemove = function () {
                        tooltip.style("left", (d3.event.pageX + 20) + "px").style("top", (d3.event.pageY - 12) + "px");
                    };

                    $scope.metricSelectedArray = [];

                    $scope.loadDataCombos = function (idMetric, valueColumTemp, valueGroupTemp) {
                        id = idMetric;
                        
                        
                        var tmp = Dataset.get({id: idMetric}, function (getMetric) {
                            var containerIndex = idMetric;

                            $scope.metricSelectedArray[idMetric] = tmp;

                            arrayExtraColumnsMetric = $scope.metricSelectedArray[idMetric].data['extra_columns'];

                            myText = "grouping column";
                            $arrayComboValues_yaxe = [];
                            $arrayComboValues = [];

                            var posValue = -1;
                            var posGroup = -1;

                            $scope.unitsCombo_value_[containerIndex] = $arrayComboValues_yaxe;
                            $scope.individualCombo_value_[containerIndex] = $arrayComboValues_yaxe;

                            $scope.optionsCombo_value_[containerIndex] = $arrayComboValues_yaxe;
                            $scope.optionsCombo_[containerIndex] = $arrayComboValues;


                            if (posValue >= 0) {
                                $scope.MetricSelectorDataColumn_[containerIndex] = $scope.optionsCombo_value_[containerIndex][posValue];
                            }

                            if (posGroup > 0) {
                                $scope.MetricSelectorGroupingData_[containerIndex] = $scope.optionsCombo_[containerIndex][posGroup];
                            }

                        }, function (error) {
                            throw {message: JSON.stringify(error.data.message)};
                        });
                    };


                    $scope.cancelVisualization = function () {
                        // Open a confirmation dialog
                        var dlg = dialogs.confirm("Are you sure?", "Do you want to exit without saving this visualization?");
                        dlg.result.then(function () {
                            if ($scope.mode == 'create') {
                                window.history.back();
                            } else {
                                //window.history.back();
                                $location.path('/visualizations/'+$scope.visualization.id);
                            }
                        });
                    }

                    //funtion to reset the form, used into the Revert button
                    $scope.revertVisualization = function (idMetric, metrictitle) {
                        // Open a confirmation dialog
                        var dlg = dialogs.confirm("Are you sure?", "Do you want to revert this visualization?");
                        dlg.result.then(function () {

                            if ($scope.mode == 'create') {
                                $route.reload();
                            } else {
                                $location.path($scope.resetlocation);
                            }

                        });
                    };


                    //function to select the Map or graph button
                    $scope.selectTabParent = function (setTab) {
                        $scope.tabParent = setTab;
                        $scope.tabSon = 0;
                        $scope.disableRevert=false;
                    };

                    //funtion used to check if a button is checked (butotns Map or graph)
                    $scope.isSelectedParent = function (checkTab) {
                        return $scope.tabParent === checkTab;
                    };

                    //function to select the type of graph (line, pie, chart) button
                    $scope.selectTabSon = function (setTab) {
                        $scope.typeToPlot = setTab;
                        $scope.tabSon = setTab;
                    };

                    //funtion to check if a type of graph is selected (line, pie, chart buttons)
                    $scope.isSelectedSon = function (checkTab) {
                        return $scope.tabSon === checkTab;
                    };

                    //funtion used into the button "Add metric" (diply list of metrics availables
                    $scope.addMetrictoList = function () {
                        $('#addmetricsbutton').toggleClass('active');
                        $('#filterDatasets').toggle('slow');
                        $('#metrics-list').toggle('slow');
                        $('#filterMetricsPaginationHeader').toggle('slow');
                        $('#filterMetricsPagination').toggle('slow');
                    };

                    //funtion used when a metic is selected. Add a metric into the list
                    $scope.addFilterMetric = function (idMetric, title, issued) {

                        var containerLink = document.getElementById("metric-list-item-item-" + idMetric);
                        $(containerLink).addClass('active');
                        var str = $(containerLink).attr("name");
                        $('#' + str + '').addClass('active');
                        var containerId = idMetric;
                        var containerIndex = idMetric;

                        $scope.MetricSelectediId_[idMetric] = idMetric;
                        $scope.MetricSelectediIndex_[idMetric] = idMetric;

                        var myText = "from";
                        $scope.MetricSelectorLabelColumn_[containerIndex] = myText;

                        $scope.loadDataCombos(idMetric, "", "");

                        selectedText = "---";
                        var myObject = {
                            'id': idMetric,
                            'name': selectedText,
                            'title': title,
                            'issued': issued,
                            'column': 'from',
                            'value': 'value',
                            'group': 'grouping column'
                        };

                        $scope.ListMetricsFilter.push(myObject);
						$scope.ListMetricsFilterModal.push(myObject);
						
                        $scope.correctmetrics = 1;

                        $scope.rePlotGraph();
                    };

                    //function used to display contetn of a metric
                    $scope.displaycontentMetric = function (idMetric) {
                        var containerLink = document.getElementById("edit-metric-button-" + idMetric);
                        $(containerLink).parent().next().toggle(200);
                    };


                    // Function for delete a metric from the list od metrics to plot
                    $scope.deleteMetricFromList = function (idMetric, metrictitle, metriclistIn, indexIn, source) {
                        // Open a confirmation dialog
                        var dlg = dialogs.confirm("Are you sure?", "Do you want to unlink '" + metrictitle + "' from the list of datasets?");
                        dlg.result.then(function () {

                            $scope.timeStart = '';
                            $scope.timeEnd = '';
							$scope.hideAdvice = false;
							
                            metriclistIn.splice(indexIn, 1);

                            $scope.individualCombo_value_[idMetric] = '';

                            if (metriclistIn.length == 0) {
                                $scope.correctmetrics = "";
                            }
							
							if (source=='modal')
							{
								
							}
							else
							{
								$scope.rePlotGraph();	
							}
                            

                        });
                    };
					
					$scope.pagePagesSizeHE = 10;
                    //funtion to delete an historical event of the array
                    $scope.deleteContainerHistoricalEvent = function (divNameIn, index, historicaleventtitle, eventId) {
                        // Open a confirmation dialog
                        //console.log(index);
                        
                        if (index<0) {


                        	for (var i in $scope.idHE) {
                        		
                        		if ($scope.idHE[i]==eventId) {
                        			index = i;
                        		}
                        		
                        	}
                        	
                        }
                        //console.log(index);
                        
                        var dlg = dialogs.confirm("Are you sure?", "Do you want to unlink the event '" + historicaleventtitle + "' from the list of events to plot in this visualization?");
                        dlg.result.then(function () {
							
							
							$scope.enableRevertButton();
						
						
                            $scope.idHE.splice((index), 1);
                            $scope.eventsToPlot.splice((index - 1), 1);
                            $scope.rePlotGraph();

                        });
                    };

                    $scope.emptyFilterDates = function () {
                        document.getElementById("startDatePosX").value = '';
                        document.getElementById("endDatePosX").value = '';
                    };

                    $scope.name = 'Link an event';


                    $scope.showModal = function (action) {
						
						$scope.hideTabs = false;
						$scope.hideAdvice = true;
						$scope.ModalIndividualDatasetCheckboxes_ = angular.copy($scope.IndividualDatasetCheckboxes_);
						$scope.ModalListMetricsFilter = angular.copy($scope.ListMetricsFilter);
						$scope.ListMetricsFilterModal  = angular.copy($scope.ListMetricsFilter);
						
						
                        if (action == 'datasets') {
                            if ($scope.ListMetricsFilter.length > 0) {
                                $scope.tab1 = false;
                                $scope.tab2 = true;
                            } else {
                                $scope.tab1 = true;
                                $scope.tab2 = false;
                            }
                            $scope.name = 'Link datasets';

                            //to avoid modal in cache we add a random in to the url
                            $scope.opts = {
                                backdrop: true,
                                backdropClick: false,
                                dialogFade: true,
                                keyboard: true,
                                templateUrl: 'modules/visualization/partials/addDataset.html?bust=' + Math.random().toString(36).slice(2),
                                controller: 'ModalWindowInstanceCtrlDataset',
                                resolve: {}, // empty storage
                                scope: $scope
                            };

                            $scope.opts.resolve.item = function () {
                                return angular.copy({name: $scope.name}); // pass name to Dialog
                            }

                            var modalInstance = $modal.open($scope.opts);

                            modalInstance.result.then(function () {
                            }, function () {
                            });

                        } else {

 							$scope.tabConfiguration = false;
                            $scope.tabSearch = false;
                            $scope.tabRecommended = false;
                            //console.log($scope.eventsToPlot.length);
							if ($scope.eventsToPlot.length>0) {
								$scope.tabConfiguration = true;	
							}
							else {
								$scope.tabSearch = true;
                            }
                                                 	
                            $scope.name = 'Link an event';
                            $scope.historicalevent_id = '';
                            var s = document.getElementById("startDatePosX");
                            var e = document.getElementById("endDatePosX");

                            dateRec = s.value;
                            dateRecEnd = e.value;
                            if (dateRec) {
                                dateRec = dateRec.replace(/-/g, "/");
                                var res = dateRec.split("/");
                                var newDate = res[2] + "-" + res[0] + "-" + res[1];
                                $scope.startDate = (newDate);
                            } else {
                                $scope.startDate = "";
                            }

                            if (dateRecEnd) {
                                dateRecEnd = dateRecEnd.replace(/-/g, "/");
                                var res = dateRecEnd.split("/");
                                var newDate = res[2] + "-" + res[0] + "-" + res[1];
                                $scope.endDate = (newDate);
                            } else {
                                $scope.endDate = "";
                            }

                            $scope.minDateToSearch = '';
                            $scope.maxDateToSearch = '';

                            if ($scope.timeStart === '----') {
                                if ($scope.TimeSelector.length > 0) {
                                    $scope.minDateToSearch = $scope.TimeSelector[1];
                                }
                            } else {
                                $scope.minDateToSearch = $scope.timeStart;
                            }

                            if ($scope.timeEnd === '----') {
                                if ($scope.TimeSelector.length > 0) {
                                    $scope.maxDateToSearch = $scope.TimeSelector[($scope.TimeSelector.length - 1)];
                                }
                            } else {
                                $scope.maxDateToSearch = $scope.timeEnd;
                            }

                            if ($scope.resolution) {
                                if ($scope.resolution.value == 'year') {
                                    $scope.minDateToSearch = $scope.minDateToSearch + "-01-01";
                                    $scope.maxDateToSearch = $scope.maxDateToSearch + "-12-31";
                                } else if ($scope.resolution.value == 'quarter') {
                                    var arrayDateQuarterA = $scope.minDateToSearch.split("-");
                                    var arrayDateQuarterB = $scope.maxDateToSearch.split("-");

                                    var qmonthA = '01'
                                    if (arrayDateQuarterA[1] == 'Q1') {
                                        qmonthA = '01';
                                    } else if (arrayDateQuarterA[1] == 'Q2') {
                                        qmonthA = '04';
                                    } else if (arrayDateQuarterA[1] == 'Q3') {
                                        qmonthA = '07';
                                    } else if (arrayDateQuarterA[1] == 'Q4') {
                                        qmonthA = '10';
                                    }

                                    var qmonthB = '01'
                                    if (arrayDateQuarterB[1] == 'Q1') {
                                        qmonthB = '01';
                                    } else if (arrayDateQuarterB[1] == 'Q2') {
                                        qmonthB = '04';
                                    } else if (arrayDateQuarterB[1] == 'Q3') {
                                        qmonthB = '07';
                                    } else if (arrayDateQuarterB[1] == 'Q4') {
                                        qmonthB = '10';
                                    }

                                    $scope.minDateToSearch = arrayDateQuarterA[0] + "-" + qmonthA + "-01";
                                    $scope.maxDateToSearch = arrayDateQuarterB[0] + "-" + (qmonthB + 1) + "-01";
                                } else if ($scope.resolution.value == 'month') {
                                    $scope.minDateToSearch = $scope.minDateToSearch + "-01";
                                    $scope.maxDateToSearch = $scope.maxDateToSearch + "-01";
                                } else if ($scope.resolution.value == 'day') {
                                    $scope.minDateToSearch = $scope.minDateToSearch;
                                    $scope.maxDateToSearch = $scope.maxDateToSearch;
                                }
                            }


                            var arrayIdsMetricsSelected = [];
                            $scope.individualsSelected = [];
                            for (var i = 0; i < $scope.ListMetricsFilter.length; i++) {
                                arrayIdsMetricsSelected[i] = $scope.ListMetricsFilter[i].id;

                                for (var i_identity = 0; i_identity < $scope.IndividualDatasetCheckboxes_[$scope.ListMetricsFilter[i].id].length; i_identity++) {
                                    var idindividual = $scope.IndividualDatasetCheckboxes_[$scope.ListMetricsFilter[i].id][i_identity];

                                    var a = $scope.individualsSelected.indexOf(idindividual);
                                    if (a < 0) {
                                        $scope.individualsSelected.push(idindividual);
                                    }
                                }
                            };

                            //to avoid modal in cache we add a random in the path
                            $scope.opts = {
                                backdrop: true,
                                backdropClick: false,
                                dialogFade: true,
                                keyboard: true,
                                templateUrl: 'modules/visualization/partials/addEvent.html?bust=' + Math.random().toString(36).slice(2),
                                controller: 'ModalInstanceCtrl',
                                resolve: {}, // empty storage
                                scope: $scope
                            };

                            $scope.opts.resolve.item = function () {
                                return angular.copy({
                                    name: $scope.name,
                                    startDate: $scope.startDate,
                                    endDate: $scope.endDate,
                                    minDateToSearch: $scope.minDateToSearch,
                                    maxDateToSearch: $scope.maxDateToSearch,
                                    metricsArray: arrayIdsMetricsSelected,
                                    arrayIndividuals: $scope.individualsSelected
                                }); // pass name to Dialog
                            }

                            var modalInstance = $modal.open($scope.opts);

                            modalInstance.result.then(function () {

                            }, function () {

                            });
                        }
                    };


                    //funtion used in the select field. Onchenge value
                    $scope.changeselectHE = function (idselected) {
                        $scope.historicalevent_id = idselected['id'];
                        $scope.historicalevent_title = idselected['title'];
                        $scope.historicalevent_startDate = idselected['startEventDate'];
                        $scope.historicalevent_endDate = idselected['endEventDate'];
                        $scope.historicalevent_description = idselected['description'];
                    };

                    $scope.collapseFilter = function () {
                        $scope.isOpened = !$scope.isOpened;
                    }

					
                    $scope.hideTabsModal = function () {
                    	$scope.hideTabs = false;
                    }
                    
                    $scope.selectHE = function (idselected, source) {
                    	//console.log("idselected="+idselected);
                    	$scope.hideTabs = true;
                    	
                        $scope.isOpened = false;
                        if (source == 'search') {
                            $scope.historicalevent_id = idselected['_source']['id'];
                            $scope.historicalevent_title = idselected['_source']['title'];
                            $scope.historicalevent_startDate = idselected['_source']['startEventDate'];
                            $scope.historicalevent_endDate = idselected['_source']['endEventDate'];
                            var string = idselected['_source']['description'];
                        } else {
                            $scope.historicalevent_id = idselected['id'];
                            $scope.historicalevent_title = idselected['title'];
                            $scope.historicalevent_startDate = idselected['startEventDate'];
                            $scope.historicalevent_endDate = idselected['endEventDate'];
                            var string = idselected['description'];

                        }
                        if (string.length > 150) {
                            string = string.substring(0, 150);
                        }

                        $scope.historicalevent_description = string;

                    };

                    //funtion to add historical event to the array - uses in the modal window
                    $scope.addAnotherHistoricalEvent = function (divName) {
                        var idRec = $scope.historicalevent_id;
                        //console.log("idRec=>"+idRec);
                        var titleRec = $scope.historicalevent_title;
                        //console.log("titleRec=>"+titleRec);
                        var dateStartRec = $scope.historicalevent_startDate;
                        //console.log("dateStartRec=>"+dateStartRec);
                        var dateEndRec = $scope.historicalevent_endDate;
                        //console.log("dateEndRec=>"+dateEndRec);

                        var colorRec = "grey";
                        var element = document.getElementById('historicalevent_color');

                        if (element != null) {
                            colorRec = document.getElementById("historicalevent_color").value;
                        }
                        if (!colorRec) {
                            colorRec = "#000000";
                        }

                        var posI = 0;
                        if ($scope.idHE.length == 0) {
                            posI = 1;
                        } else {
                            posI = $scope.idHE.length;
                        }

                        dateStartRec = $filter('date')(dateStartRec, "yyyy-MM-dd");
                        dateEndRec = $filter('date')(dateEndRec, "yyyy-MM-dd");

                        $scope.idHE[posI] = idRec;
                        $scope.titleHE[posI] = titleRec;
                        $scope.startDateHE[posI] = dateStartRec;
                        $scope.endDateHE[posI] = dateEndRec;
                        $scope.colorHE[posI] = colorRec;
                        //$scope.descHE[posI] = $scope.historicalevent_description;
						$scope.descHE[posI] = $('#descriptionHEToAdd').val();
						
                        var datosInT = {
                            id: idRec,
                            title: titleRec,
                            startDate: dateStartRec,
                            endDate: dateEndRec,
                            color: colorRec,
                            desc: $('#descriptionHEToAdd').val()
                        }

                        $scope.eventsToPlot.push(datosInT);

                        $scope.historicalevent_id = '';
                        $scope.historicalevent_title = '';
                        $scope.historicalevent_startDate = '';
                        $scope.historicalevent_endDate = '';
                        $scope.historicalevent_description = '';
                        $scope.historicalevent_color = '';


                    };

                    $scope.optionToPlot = [];

					$scope.clickIndividual= function (datasetId, individualId) {
						
						$scope.hideAdvice = false;
						
						var indexData = $scope.ModalIndividualDatasetCheckboxes_[datasetId].indexOf(individualId);
						
						
						if (indexData<0) {
							$scope.ModalIndividualDatasetCheckboxes_[datasetId].push(individualId);
						}
						else {
							$scope.ModalIndividualDatasetCheckboxes_[datasetId].splice(indexData, 1);
							
							if ($scope.ModalIndividualDatasetCheckboxes_[datasetId].length == 0) {
                            	$scope.ModalIndividualDatasetCheckboxes_[datasetId] = [];
                                for (j in $scope.individualCombo_value_[datasetId]) {
                                    $scope.ModalIndividualDatasetCheckboxes_[datasetId].push($scope.individualCombo_value_[datasetId][j].id);
                                }
                            }
						}
						
						$scope.disabledApplyButton = false;
						
					}
					
                    $scope.validateCheckboxes = function (idIn, source) {

                        if (source == 'modal') {
                        	$scope.hideAdvice = false;
                        	
                            if ($scope.ModalIndividualDatasetCheckboxes_[idIn].length == 0) {
                            	$scope.ModalIndividualDatasetCheckboxes_[idIn] = [];
                                for (j in $scope.individualCombo_value_[idIn]) {
                                    $scope.ModalIndividualDatasetCheckboxes_[idIn].push($scope.individualCombo_value_[idIn][j].id);
                                }
                            }
                        } 
                        else {                        	
                        	if ($scope.IndividualDatasetCheckboxes_[idIn].length == 0) {
                            	for (j in $scope.individualCombo_value_[idIn]) {
                            	    $scope.IndividualDatasetCheckboxes_[idIn].push($scope.individualCombo_value_[idIn][j].id);
                            	    
                            	    $scope.ModalIndividualDatasetCheckboxes_[idIn].push($scope.individualCombo_value_[idIn][j].id);
                            	    
                            	}
                        	}
                        
                            $scope.rePlotGraph();
                        }

                    }

                    $scope.updateDescriptionEvent = function (index) {
                        $scope.eventsToPlot[index].desc = $scope.descHE[index + 1];
                    }

                    $scope.updatecolorEvent = function (index) {
                        $scope.eventsToPlot[index].color = $scope.colorHE[index + 1];
                    }

                    $scope.indexdataset = -1;
                    
                    $scope.changeColourIndividual = function () {
                    	
                    	$scope.hideAdvice = false;
                    }
                    
                    $scope.showListIndividuals = [];
                    $scope.disabledApplyButton = false;
                    $scope.rePlotGraphFromSearch = function () {
                    	
                    	$scope.hideAdvice = false;
                    	
                        if ($scope.indexdataset >= 0) {
                            //$scope.IndividualDatasetCheckboxes_.splice($scope.indexdataset, 1);
                            $scope.ModalIndividualDatasetCheckboxes_.splice($scope.indexdataset, 1);
                        }
                        
                        if ($scope.ListMetricsFilterModal.length==0) {                        	
                        	$scope.resolution = {};
                        }
                        			
                        $scope.indexdataset = -1;

                        //$scope.curPageDataset = 0;
                        //$scope.curPageDataset = 1;
                        //$scope.pageSizeDataset = 5;
                        //$scope.pageSizeDataset = 6;
                        //$scope.pageSizeDataset = 2;
                        //$scope.pagePagesSizeDataset = 10;
						
						//$scope.pageChangedDataset = function() {
						//	console.log("1 $scope.pageChangedDataset");
						//}
						
						String.prototype.ucfirst = function()
						{
    						return this.charAt(0).toUpperCase() + this.substr(1);
						}

						//$scope.rePlotGraph();
						//load individuilas dataset selected
						$scope.sizeIndividualsArray = [];
						for (var i = 0; i < $scope.ListMetricsFilterModal.length; i++) {
							
							if (i==0) {
								$scope.disabledApplyButton = true;
							}
							
							var containerIndex = $scope.ListMetricsFilterModal[i].id; 
							
							$scope.showListIndividuals[containerIndex]=false;
							
							//we need to recover data to get the resolution
							//if ($scope.individualCombo_value_.hasOwnProperty(containerIndex)) {
							if (1==2) {
								
							}
							else {
								
 								$scope.datasetSelectedData = Dataset.get({id: containerIndex}, function (arrayDatasetRec) {

                					if ($scope.ListMetricsFilterModal.length==1)
                					{
	                					$scope.resolution = {
    	                        			label: arrayDatasetRec.time.resolution.ucfirst(),
        	                    			value: arrayDatasetRec.time.resolution
            	            			};            	            			
                					}              					
									
									//we only need to recover data if we didn't do it before
									if (!$scope.individualCombo_value_.hasOwnProperty(arrayDatasetRec.id)) {
										
                						arrayIndividualListDataset = arrayDatasetRec.data['table'];
                					
                						$arrayComboValues_Individuals = [];
			                        	$arrayComboValuesChecked = [];
                        				//console.log(arrayIndividualListDataset.length);
                        				$scope.sizeIndividualsArray[containerIndex] = arrayIndividualListDataset.length;
										for (x = 0; x < arrayIndividualListDataset.length; x++) {
	                            			if (arrayIndividualListDataset[x].individual) {
												
												
												$dataIndividual = Individual.get({id: arrayIndividualListDataset[x].individual}, function (indivudual) {
												 													
													var iscountry=false;
	                                				if (indivudual.code) {
	                                					iscountry=true;
	                                				}
	                                				
	                                    			$arrayValores = {
	                                        			"id": indivudual.id,
	                                        			"title": indivudual.title,
	                                        			"iscountry": iscountry
	                                    			};
	                                    			
	                                    			$arrayComboValues_Individuals.push($arrayValores);
	                                    			$arrayComboValuesChecked.push($arrayValores['id']);
	
	                                    			var TMP1 = [];
	                                    			if ($scope.individualCombo_value_[containerIndex]) {
	                                        			TMP1 = $scope.individualCombo_value_[containerIndex];
	                                    			}
	
	                                    			TMP1.push($arrayValores);                                    			
	                                    			
	                                    			$scope.individualCombo_value_[containerIndex] = TMP1;
	
	                                    			
	                                        		var TMP2 = [];
	                                        		/*
	                                        		if ($scope.IndividualDatasetCheckboxes_[containerIndex]) {
	                                            		TMP2 = $scope.IndividualDatasetCheckboxes_[containerIndex];
	                                        		}
													*/
													
	                                        		if ($scope.ModalIndividualDatasetCheckboxes_[containerIndex]) {
	                                            		TMP2 = $scope.ModalIndividualDatasetCheckboxes_[containerIndex];
	                                        		}							
	                                        							
	                                        		TMP2.push($arrayValores['id']);
	                                        		//$scope.IndividualDatasetCheckboxes_[containerIndex] = TMP2;
	                                        		//$scope.ModalIndividualDatasetCheckboxes_[containerIndex] = TMP2;
	                                        		$scope.ModalIndividualDatasetCheckboxes_[containerIndex] = TMP2;
													
													//console.log(arrayIndividualListDataset.length);
													//console.log($scope.ModalIndividualDatasetCheckboxes_[containerIndex].length);
													if (arrayIndividualListDataset.length==$scope.ModalIndividualDatasetCheckboxes_[containerIndex].length)
													{
														$scope.showListIndividuals[containerIndex]=true;
														$scope.disabledApplyButton = false;
													}
													
												});
												
	                            			}
                        				}                					
                					}
                					else {
                						//console.log("FIND!!!");
                						$scope.showListIndividuals[arrayDatasetRec.id]=true;
                						$scope.disabledApplyButton = false;
                					}

									
            					}, function (error) {
                					throw {message: JSON.stringify(error.data.message)};
            					});

								
							}
						}
                        
                    }

                    $scope.manualCheckoxesSelected = [];
                    $scope.manualCheckoxesSelected['showYAxes'] = false;

                    $scope.manualClick = function (checkboxId) {
                        $scope.manualCheckoxesSelected[checkboxId] = true;
                    }

                    $scope.validateStartEndDate = function () {

                        var indexStartDate = $scope.TimeSelector.indexOf($scope.timeStart);
                        var indexEndtDate = $scope.TimeSelector.indexOf($scope.timeEnd);

                        if (indexStartDate > indexEndtDate) {
                            if ($scope.timeEnd != '----') {
                                var inter = $scope.timeEnd;
                                $scope.timeEnd = $scope.timeStart;
                                $scope.timeStart = inter;
                            }
                        }

                    }
										
					$scope.copyDatasets = function (dataIn) {
						$scope.ListMetricsFilter = angular.copy(dataIn);
					}
					
					$scope.copyIndividuals = function (dataIn) {
						$scope.IndividualDatasetCheckboxes_ = angular.copy(dataIn);
					}

					$scope.enableRevertButton = function() {						
						$scope.disableRevert = false;						
					}
					
					
                    $scope.rePlotGraph = function () {

                        $scope.validateStartEndDate();
                        //clear container chart div
                        var divContent = '';
                        divContent = '<div class="loading-container"><div class="loading" ></div><div id="loading-text">loading</div></div>';
                        if ($scope.mode != 'view') {
                            if (document.getElementById("container_graph_" + $scope.visualization.id) != null) {
                                document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = divContent;
                            } else {
                                document.getElementById("container_graph_").innerHTML = divContent;
                            }
                        }

                        if ($scope.ListMetricsFilter.length == 0) {
                            $scope.resolution = "";
                        }

                        var arrayJsonFiles = [];
                        var datosTemporales = new Object();
                                                
                        var elems = $scope.ListMetricsFilter;
                        
                        var elemsIndex = $scope.MetricSelectediIndex_;

                        if ($scope.resolution) {
                            $scope.FilterResolution = $scope.arrayResolutions[$scope.resolution.value];
                        }
                        var cntMetrics = 0;
                        var arrayJsonFiles = [];
                        var arrayKeys = [];
                        var arrayXAxis = [];
                        var arrayYAxis = [];
                        var arrayGrouping = [];
                        var arrayIdsIdentities = [];
                        var arrayColorIdsIdentities = [];

                        var arrayColorsDatasets = [];

                        $scope.canPlotGarph = true;
						
                        for (j in elems) {
                            i = elems[j]['id'];
                            if (!isNaN(i)) {
                                if (i > 0) {
                                    var jsonFile = i;
                                    var jsonFileName = jsonFile;
                                    jsonFile = "json/" + jsonFile;
                                    var resIdMetric = i;

                                    var timeresolution = '';
                                    if ($scope.resolution) {
                                        timeresolution = $scope.resolution.value;
                                    }                                    

                                    var identities = "";
                                    var identityColors = [];

                                    if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                    	
                                        if ($scope.IndividualDatasetCheckboxes_[i]) {
                                            identities = $scope.IndividualDatasetCheckboxes_[i];
                                            identityColors = $scope.dataset_color_palete_[i];
                                        } else {
                                            identities = elems[j]['identities'];
                                            identityColors = elems[j]['identitiescolors'];
                                        }

                                    } else {
                                        identities = elems[j]['identities'];
                                        identityColors = elems[j]['identitiescolors'];
                                    }

                                    var strIdentities = "";
                                    if (identities) {
                                        for (jIdentities in identities) {
                                            if (strIdentities) {
                                                strIdentities = strIdentities + ",";
                                            }
                                            if (!isNaN(identities[jIdentities])) {
                                                strIdentities = strIdentities + identities[jIdentities];
                                            }
                                        }

                                    }

                                    if (strIdentities) {
                                        strIdentities = "&individuals=" + strIdentities;
                                    }
                                    
                                    if (timeresolution) {
                                        jsonFile = API_CONF.DATASETS_MANAGER_URL + "/datasets/" + resIdMetric + '?time_resolution=' + timeresolution;
                                    } else {
                                        jsonFile = API_CONF.DATASETS_MANAGER_URL + "/datasets/" + resIdMetric + '?';
                                    }

                                    if ($scope.timeStart) {
                                        if ($scope.timeStart != '----') {
                                            jsonFile = jsonFile + "&time_start=" + $scope.timeStart;
                                        }
                                    }
                                    if ($scope.timeEnd) {
                                        if ($scope.timeEnd != '----') {
                                            jsonFile = jsonFile + "&time_end=" + $scope.timeEnd;
                                        }
                                    }
                                    
                                    if (jsonFile) {
                                        var str = i;
                                        var puntero = i;

                                        var res = $scope.MetricSelectorLabelColumn_[puntero];
                                        var valueXAxis = res;

                                        res = $scope.MetricSelectorDataColumn_[puntero];
                                        var valueYAxis = res;

                                        if (!valueYAxis) {
                                            valueYAxis = 'by row';
                                        } else {
                                            valueYAxis = $scope.MetricSelectorDataColumn_[puntero].id;
                                        }

                                        var identitiesvalues = "";
                                        
                                        
                                        identitiesvalues = $scope.IndividualDatasetCheckboxes_[puntero];
										
                                        res = $scope.MetricSelectorGroupingData_[puntero];
                                        var valueGroup = res;

                                        if (!valueGroup) {
                                            valueGroup = 'grouping column';
                                        }


                                        if (valueGroup) {
                                            arrayKeys.push(jsonFileName);
                                            arrayXAxis.push(valueXAxis);
                                            arrayYAxis.push(valueYAxis);
                                            arrayGrouping.push(valueGroup);
                                            arrayIdsIdentities.push(identitiesvalues)


                                            var valueIdentityColor = $scope.dataset_color_palete_[puntero];

                                            arrayColorsDatasets.push(valueIdentityColor);


                                            arrayJsonFiles.push(jsonFile);
                                            cntMetrics = cntMetrics + 1;

                                            $scope.optionToPlot[resIdMetric] = {
                                                'datasetid': resIdMetric,
                                                'metricid': resIdMetric,
                                                'Label': valueXAxis,
                                                'Column': valueYAxis,
                                                'Grouping': valueGroup,
                                                'identities': identitiesvalues,
                                                'identitiescolors': valueIdentityColor,
                                                'json': jsonFile
                                            };

                                        } else {
                                            $scope.canPlotGarph = false;
                                        }

                                    } else {
                                    	//jsonFile KO

                                    }
                                }
                            }
                        }

                        var elemsHE_startDate = "";
                        var elemsHE_endDate = "";
                        var elemsHE_desc = "";
                        var elemsHE_title = "";
                        var elemsHE_color = "";

                        var element = document.getElementsByName('startDateHE[]');
                        if (element != null) {
                            elemsHE_startDate = document.getElementsByName("startDateHE[]");
                        }

                        var element = document.getElementsByName('endDateHE[]');
                        if (element != null) {
                            elemsHE_endDate = document.getElementsByName("endDateHE[]");
                        }

                        var element = document.getElementsByName('descHE[]');
                        if (element != null) {
                            elemsHE_desc = document.getElementsByName("descHE[]");
                        }

                        var element = document.getElementsByName('titleHE[]');
                        if (element != null) {
                            elemsHE_title = document.getElementsByName("titleHE[]");
                        }

                        var element = document.getElementsByName('colorHE[]');
                        if (element != null) {
                            elemsHE_color = document.getElementsByName("colorHE[]");
                        }

                        var q = queue();
                        var q2 = queue();
                        arrayJsonFiles.forEach(function (d, i) {
                            var pathToJson = d;

                            q = q.defer(d3.json, pathToJson);
                            q2 = q2.defer(d3.json, pathToJson);

                        });

                        $scope.recoverDataEnds = false;

                        q.await($scope.recoverRelatedData);


                        $scope.$watch('recoverDataEnds', function (recoverDataEnds) {
                            if ($scope.recoverDataEnds) {
                                q2.await($scope.plotGraphDatasets);
                            }
                        });

                    };


                    $scope.TitleUnits = [];
                    $scope.TitleIndividuals = [];


                    $scope.recoverRelatedData = function () {
                        $scope.recoverDataEnds = false;

                        $dataIndividualPromises = [];

                        $dataUnit = [];
                        $scope.TimeSelector = [];
                        $scope.cntIndividuals = 0;
                        $scope.TitleIndividuals = [];
                        $scope.cntTitleIndividual = 0;
                        $scope.cntYLabels = 0;

                        var cntIndividualsVisualisation = 0;
                        $scope.numberOfArguments = 0;
                        for (var i = 1; i < arguments.length; i++) {
                            cntIndividualsVisualisation = cntIndividualsVisualisation + arguments[i]['data']['table'].length;
                            $scope.numberOfArguments = $scope.numberOfArguments + 1;
                        }

                        for (var i = 1; i < arguments.length; i++) {
                            if ($scope.TitleUnits[arguments[i]['unit_id']]) {
                                $scope.cntYLabels = $scope.cntYLabels + 1;

                                if (($scope.cntYLabels >= (arguments.length - 1)) && ($scope.cntTitleIndividual >= cntIndividualsVisualisation)) {
                                    $scope.recoverDataEnds = true;

                                }
                            } else {
                                if (arguments[i]['unit_id'] == 0) {
                                    $scope.TitleUnits[arguments[i]['unit_id']] = 'No unit';
                                    $scope.cntYLabels = $scope.cntYLabels + 1;

                                } else {
                                    $dataUnit[i] = Unit.getById(arguments[i]['unit_id']);
                                    $dataUnit[i].$promise.then(function (unit) {
                                        //console.log(unit.title);
                                        if (unit.title == 'Unitless') {
                                            $scope.TitleUnits[unit.id] = " ";
                                        } else {
                                            $scope.TitleUnits[unit.id] = unit.title;
                                        }

                                        $scope.cntYLabels = $scope.cntYLabels + 1;

                                        if (($scope.cntYLabels >= (arguments.length - 1)) && ($scope.cntTitleIndividual >= $scope.cntIndividuals)) {
                                            $scope.recoverDataEnds = true;
                                        }

                                    });
                                }

                            }

                            $scope.ResolutionToSend = '';

                            if (!$scope.resolution) {
                                $scope.ResolutionToSend = $scope.arrayResolutions[arguments[i].time.resolution][0].value;
                            } else {
                                $scope.ResolutionToSend = $scope.resolution.value;
                            }

                            $scope.datasetRec = Dataset.get({
                                id: arguments[i].id,
                                time_resolution: $scope.ResolutionToSend
                            }, function (datasetRec) {
                                for (var j = 0; j < datasetRec.data.table.length; j++) {
                                    for (var keyTimeData in datasetRec.data.table[j].values) {
                                        if (keyTimeData) {
                                            var a = $scope.TimeSelector.indexOf(keyTimeData);
                                            if (a < 0) {
                                                $scope.TimeSelector.push(keyTimeData);
                                            }

                                        }
                                    }
                                }


                                if (!$scope.timeStart) {

                                } else {
                                    var cntD = 0;
                                    $scope.TimeSelector.forEach(function (entry) {
                                        if (entry == $scope.timeStart) {
                                            $scope.timeStart = $scope.TimeSelector[cntD];
                                        }
                                        cntD = cntD + 1;
                                    });
                                }

                                if (!$scope.timeEnd) {

                                } else {
                                    var cntD = 0;
                                    $scope.TimeSelector.forEach(function (entry) {
                                        if (entry == $scope.timeEnd) {
                                            $scope.timeEnd = $scope.TimeSelector[cntD];
                                        }
                                        cntD = cntD + 1;
                                    });
                                }

                            }, function (err) {
                                throw {message: JSON.stringify(err.data)};
                            });

                            for (var j = 0; j < arguments[i]['data']['table'].length; j++) {

                                if (!$scope.resolution) {
                                    $scope.resolution = $scope.arrayResolutions[arguments[i].time.resolution][0];
                                }

                                if ($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]) {
                                    $scope.cntIndividuals = $scope.cntIndividuals + 1;
                                } else {
                                    $scope.cntIndividuals = $scope.cntIndividuals + 1;
                                    $dataIndividualPromises[j] = Individual.getById(arguments[i]['data']['table'][j].individual);
                                    $dataIndividualPromises[j].$promise.then(function (indivudual) {
                                        $scope.TitleIndividuals[indivudual.id] = indivudual.title;
                                        $scope.cntTitleIndividual = $scope.cntTitleIndividual + 1;

                                        if (($scope.cntYLabels >= ($scope.numberOfArguments)) && ($scope.cntTitleIndividual >= cntIndividualsVisualisation)) {
                                            $scope.recoverDataEnds = true;
                                        }
                                    });
                                }
                            }
                        }


                        $scope.TimeSelector.sort(function (a, b) {
                            var amod = a;
                            var bmod = b;
                            if ($scope.resolution.value == 'day') {
                                var amod = a;
                                var bmod = b;
                            } else if ($scope.resolution.value == 'month') {
                                var arrayDateMonthA = a.split("-");
                                var arrayDateMonthB = b.split("-");
                                var mEndDateA = '01/' + arrayDateMonthA[1] + '/' + arrayDateMonthA[0];
                                var mEndDateB = '01/' + arrayDateMonthB[1] + '/' + arrayDateMonthB[0];
                                var amod = mEndDateA;
                                var bmod = mEndDateB;

                            } else if ($scope.resolution.value == 'year') {
                                var amod = '01/01/' + a;
                                var bmod = '01/01/' + b;
                            } else if ($scope.resolution.value == 'quarter') {
                                //console.log(a);

                                var arrayDateQuarterA = a.split("-");
                                var arrayDateQuarterB = b.split("-");


                                if (arrayDateQuarterA[1] == 'Q1') {
                                    qmonthA = '01';
                                } else if (arrayDateQuarterA[1] == 'Q2') {
                                    qmonthA = '04';
                                } else if (arrayDateQuarterA[1] == 'Q3') {
                                    qmonthA = '07';
                                } else if (arrayDateQuarterA[1] == 'Q4') {
                                    qmonthA = '10';
                                }

                                if (arrayDateQuarterB[1] == 'Q1') {
                                    qmonthB = '01';
                                } else if (arrayDateQuarterB[1] == 'Q2') {
                                    qmonthB = '04';
                                } else if (arrayDateQuarterB[1] == 'Q3') {
                                    qmonthB = '07';
                                } else if (arrayDateQuarterB[1] == 'Q4') {
                                    qmonthB = '10';
                                }
                                var mEndDateA = '01/' + qmonthA + '/' + arrayDateQuarterA[0];
                                var amod = mEndDateA;

                                var mEndDateB = '01/' + qmonthB + '/' + arrayDateQuarterB[0];
                                var bmod = mEndDateB;

                            }
                            var dateA = new Date(amod), dateB = new Date(bmod);

                            return dateA - dateB //sort by date ascending
                        });

                        $scope.TimeSelector.unshift('----');

                        if (!$scope.timeStart) {
                            $scope.timeStart = $scope.TimeSelector[0];
                        } else {
                            var cntD = 0;
                            $scope.TimeSelector.forEach(function (entry) {
                                if (entry == $scope.timeStart) {
                                    $scope.timeStart = $scope.TimeSelector[cntD];
                                }
                                cntD = cntD + 1;
                            });
                        }

                        if (!$scope.timeEnd) {
                            $scope.timeEnd = $scope.TimeSelector[0];
                        } else {
                            var cntD = 0;
                            $scope.TimeSelector.forEach(function (entry) {
                                if (entry == $scope.timeEnd) {
                                    $scope.timeEnd = $scope.TimeSelector[cntD];
                                }
                                cntD = cntD + 1;
                            });
                        }
                    }

                    $scope.plotGraphDatasets = function () {

						$scope.metricsFilter = $scope.ListMetricsFilter;

                        var control = 0;
                        if ($scope.metricsFilter.length == 0) {
                            control = 0;
                        } else {
                            control = 1;
                        }

                        if (control == 1) {
                            var arrayDataset = [];
                            $scope.arrayDataset = [];
                            var labelYAxe = [];
                            $scope.labelYAxe = [];

                            var arrayDataByCounty = [];
                            $scope.arrayDataByCounty = [];

                            var arrayDatesInDataCountry = [];

                            $scope.arrayDatesInDataCountry = [];

                            var arrayDatesInDataCountryEval = [];
                            $scope.arrayDatesInDataCountryEval = [];

                            $scope.arrayLabels = [];
                            $scope.arrayUnits = [];
                            $scope.InitialArguments = [];
                            $scope.cntCountriesToPlot = 0;

                            var resultionToUse = '';
                            var unitsId = [];
                            for (var i = 1; i < arguments.length; i++) {

                                if (!isNaN(i)) {

                                    if ($scope.mode == 'create') {
                                        if ($scope.ListMetricsFilter.length <= 1) {

                                            if ($scope.manualCheckoxesSelected['showYAxes'] == false) {
                                                $scope.showYAxes = true;
                                            }
                                        } else {
                                            var indexUnit = unitsId.indexOf(arguments[i].unit_id);
                                            if (indexUnit < 0) {
                                                unitsId.push(arguments[i].unit_id)
                                                if ($scope.manualCheckoxesSelected['showYAxes'] == false) {
                                                    $scope.showYAxes = false;
                                                }

                                            }
                                        }
                                    }

                                    if (!$scope.resolution) {
                                        $scope.resolution = $scope.arrayResolutions[arguments[i].time.resolution][0];
                                    }

                                    if (resultionToUse == '') {
                                        resultionToUse = arguments[i].time.resolution;
                                    } else {
                                        if (resultionToUse == 'year') {

                                        } else if (resultionToUse == 'quarter') {
                                            if (($scope.resolution.value == 'year')) {
                                                resultionToUse = arguments[i].time.resolution;
                                            }
                                        }

                                        else if (resultionToUse == 'month') {
                                            if (($scope.resolution.value == 'quarter') || ($scope.resolution.value == 'year')) {
                                                resultionToUse = $scope.resolution.value;
                                            }
                                        } else if (resultionToUse == 'day') {
                                            if (($scope.resolution.value == 'month') || ($scope.resolution.value == 'quarter') || ($scope.resolution.value == 'year')) {
                                                resultionToUse = $scope.resolution.value;
                                            }
                                        }
                                    }

                                    $scope.resolutionoptions = $scope.arrayResolutions[resultionToUse];


                                    for (var jj = 0; jj < $scope.arrayResolutions[resultionToUse].length; jj++) {
                                        if ($scope.resolution.value == $scope.arrayResolutions[resultionToUse][jj].value) {
                                            $scope.resolution = $scope.arrayResolutions[resultionToUse][jj];
                                        }
                                    }


                                    var ejeX = "";
                                    var ejeY = "";
                                    ejeX = 'time';
                                    ejeY = $scope.optionToPlot[arguments[i].id].Column;


                                    var colorsIdentities = $scope.optionToPlot[arguments[i].id].identitiescolors;

                                    if (($scope.typeToPlot === 'map_1') || ($scope.typeToPlot === 'mercator') || ($scope.typeToPlot === 'conicConformal') || ($scope.typeToPlot === 'equirectangular') || ($scope.typeToPlot === 'orthographic') || ($scope.typeToPlot === 'azimuthalEqualArea')) {


                                        $scope.semCountries = 0;

                                        $scope.mapTimeSlider = [];

										//used for testing
                                        if (1 == 1) {

                                            for (var j = 0; j < arguments[i]['data']['table'].length; j++) {

                                                $idIndiv = arguments[i]['data']['table'][j]['individual'];
                                                $scope.InitialArguments[$idIndiv] = arguments[i];

                                                var plotindividual = true;

                                                if ($scope.mode == 'view') {

                                                    if ($scope.ListIndividualDatasetCheckboxes_[arguments[i]['id']]) {
                                                        var indexIndividual = $scope.ListIndividualDatasetCheckboxes_[arguments[i]['id']].indexOf(String($idIndiv));

                                                        if (indexIndividual < 0) {
                                                            plotindividual = false;
                                                        }
                                                    }
                                                } else {
                                                    plotindividual = false;

                                                    for (var individual_checked_position in $scope.IndividualDatasetCheckboxes_[arguments[i].id]) {
                                                        if (arguments[i]['data']['table'][j].individual == $scope.IndividualDatasetCheckboxes_[arguments[i].id][individual_checked_position]) {
                                                            plotindividual = true;
                                                        }
                                                    }
                                                }

                                                if (plotindividual) {

                                                    $dataCountry = Individual.getById($idIndiv);

                                                    $dataCountry.$promise.then(function (countryData) {


                                                        if (countryData['data_class'] == 'Country') {

                                                            var countryDatasetTitle = countryData.title;
                                                            var countryDatasetId = countryData.code;

                                                            var arrayDataPerDate = [];
                                                            $scope.arrayDataPerDate = [];

                                                            arguments2 = $scope.InitialArguments[countryData.id];

                                                            if (arguments2) {
                                                                for (var jj = 0; jj < arguments2['data']['table'].length; jj++) {

                                                                    if (arguments2['data']['table'][jj].individual == countryData.id) {
                                                                        var obj = arguments2['data']['table'][jj].values;

                                                                        for (ii in obj) {

                                                                            if (isNaN($scope.arrayDataPerDate[ii])) {
                                                                                arrayDataPerDate[ii] = 0;
                                                                                $scope.arrayDataPerDate[ii] = 0;
                                                                                arrayDatesInDataCountryEval[ii] = ii;
                                                                                $scope.arrayDatesInDataCountryEval[ii] = ii;
                                                                            }

                                                                            arrayDataPerDate[ii] = arrayDataPerDate[ii] + obj[ii];
                                                                            $scope.arrayDataPerDate[ii] = $scope.arrayDataPerDate[ii] + obj[ii];

                                                                            var a = $scope.mapTimeSlider.indexOf(ii);
                                                                            if (a < 0) {
                                                                                $scope.mapTimeSlider.push(ii);
																				
																																		
																				$scope.slider_translate_map = {
									    											options: {
									    												ceil: $scope.mapTimeSlider.length-1,
									    												floor: 0,
									    												showTicksValues: true,									    												
									    												//ticksValuesTooltip: function(v) {
									        											//	return 'Tooltip for ' + v;
									      												//},									      												
									      												translate: $scope.translateCountrySlider									      												
									    											}
																				};

                                                                                $scope.mapTimeSlider.sort(function (a, b) {
                                                                                    var amod = a;
                                                                                    var bmod = b;

                                                                                    if ($scope.resolution == 'Day') {
                                                                                        var amod = a;
                                                                                        var bmod = b;
                                                                                    } else if ($scope.resolution == 'Month') {
                                                                                        var amod = '01/' + a;
                                                                                        var bmod = '01/' + b;
                                                                                    } else if ($scope.resolution == 'Year') {
                                                                                        var amod = '01/01/' + a;
                                                                                        var bmod = '01/01/' + b;
                                                                                    }

                                                                                    var dateA = new Date(amod), dateB = new Date(bmod);

                                                                                    return dateA - dateB //sort by date ascending
                                                                                });

                                                                            }

                                                                        }
                                                                    }
                                                                }
                                                            }


                                                            arrayDataByCounty.push({
                                                                'Id': countryDatasetId,
                                                                'Title': countryDatasetTitle,
                                                                'Data': $scope.arrayDataPerDate
                                                            });
                                                            $scope.arrayDataByCounty.push({
                                                                'Id': countryDatasetId,
                                                                'Title': countryDatasetTitle,
                                                                'Data': $scope.arrayDataPerDate
                                                            });

                                                            $scope.semCountries = $scope.semCountries + 1;
                                                            $scope.cntCountriesToPlot = $scope.cntCountriesToPlot + 1;
                                                        }
                                                    });

                                                }
                                            }
                                        }


                                    } else if (($scope.typeToPlot === 'graph_line') || ($scope.typeToPlot === 'graph_pie') || ($scope.typeToPlot === 'graph_bars')) {

                                        var arrayValues = [];
                                        var arrayLabels = [];
                                        var arrayValuesXY = [];
                                        var arrayProcessedDates = [];
                                        var arrayColors = [];
                                        var numbers1T = {"Key": arguments[i].title};
                                        var cntPosArray = 0;

                                        var labelTemporalYAxes = "";

                                        $sem = 0;
                                        while (labelTemporalYAxes == "") {
                                            if (arguments[i]['unit_id'] == 0) {
                                                var labelTemporalYAxes = "No unit";
                                            } else if ($scope.TitleUnits[arguments[i]['unit_id']]) {
                                                var labelTemporalYAxes = $scope.TitleUnits[arguments[i]['unit_id']];
                                            }
                                            $sem = $sem + 1;

                                            if ($sem > 5000) {
                                                var labelTemporalYAxes = arguments[i]['unit_id'];
                                            }


                                        }

                                        var arrayLabels = [];
                                        var arrayValues = [];
                                        var arrayUnits = [];
                                        var arrayColors = [];
                                        var obj_ = [];
                                        for (var j = 0; j < arguments[i]['data']['table'].length; j++) {

                                            $idIndiv = arguments[i]['data']['table'][j]['individual'];
                                            var plotindividual = true;

                                            if ($scope.mode == 'view') {

                                                if ($scope.ListIndividualDatasetCheckboxes_[arguments[i]['id']]) {
                                                    var indexIndividual = $scope.ListIndividualDatasetCheckboxes_[arguments[i]['id']].indexOf(String($idIndiv));

                                                    if (indexIndividual < 0) {
                                                        plotindividual = false;
                                                    }
                                                }
                                            } else {

                                                plotindividual = false;

                                                var checkit = false;
                                                if ($scope.IndividualDatasetCheckboxes_[arguments[i].id]) {
                                                    if ($scope.IndividualDatasetCheckboxes_[arguments[i].id].length > 0) {
                                                        checkit = true;
                                                    }
                                                }

                                                if (checkit) {
                                                    for (var individual_checked_position in $scope.IndividualDatasetCheckboxes_[arguments[i].id]) {

                                                        if (arguments[i]['data']['table'][j].individual == $scope.IndividualDatasetCheckboxes_[arguments[i].id][individual_checked_position]) {
                                                            plotindividual = true;
                                                        }

                                                    }

                                                } else {
                                                    plotindividual = true;
                                                }
                                            }

                                            if (plotindividual) {

                                                var obj = arguments[i]['data']['table'][j].values;
                                                obj_[j] = arguments[i]['data']['table'][j].values;

                                                var ordered = {};

                                                Object.keys(obj_[j]).sort().forEach(function (key) {

                                                    ordered[key] = obj_[j][key];
                                                });
                                                obj_[j] = ordered;

                                                labelYAxe.push(labelTemporalYAxes);
                                                $scope.labelYAxe.push(labelTemporalYAxes);

                                                if ($scope.typeToPlot === 'graph_line') {

                                                    var key = "";

                                                    $sem = 0;

                                                    while (key == "") {
                                                        if ($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]) {
                                                            if ($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] != arguments[i]['data']['table'][j].individual) {
																/*
																if (arguments.length>2) {
                                                                	//var str = arguments[i].acronym;
                                                                	var str = arguments[i].title;
                                                                	var key = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " [" + str + "] _" + j;
																}
																else {
																	var key = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " _" + j;
																}
																*/
																var str = arguments[i].title;
																var key = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " [" + str + "] _" + j;
                                                            }
                                                        }
                                                        $sem = $sem + 1;

                                                        if ($sem > 100000) {
                                                            //var str = arguments[i].acronym;
                                                            var str = arguments[i].title;
                                                            var key = arguments[i]['data']['table'][j].individual + " [" + str + "] _" + j;
                                                        }


                                                    }

                                                    var type = "metric";
                                                    var arrayLabels = [];
                                                    var arrayColors = [];
                                                    var arrayValuesX = [];
                                                    var arrayValuesY = [];

                                                    for (value in obj_[j]) {
                                                        arrayLabels.push(value);
                                                        arrayValuesX.push(value);
                                                        arrayValuesY.push(obj_[j][value]);

                                                    }

                                                    var lineColor = '#000000';


                                                    if (colorsIdentities) {
                                                        lineColor = $scope.optionToPlot[arguments[i].id].identitiescolors[arguments[i]['data']['table'][j].individual];
                                                    } else {
                                                        lineColor = $scope.colorScale($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]);
                                                    }

                                                    var arrayDatasetTmp = {
                                                        'Key': key,
                                                        'Labels': arrayLabels,
                                                        'ValueX': arrayValuesX,
                                                        'ValueY': arrayValuesY,
                                                        'Color': lineColor,
                                                        'Type': type
                                                    }
                                                    arrayDataset.push(arrayDatasetTmp);
                                                    $scope.arrayDataset.push(arrayDatasetTmp);

                                                }

                                                else if ($scope.typeToPlot === 'graph_pie') {

                                                    var label = '';

                                                    $sem = 0;
                                                    while (label == "") {
                                                        if ($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]) {
                                                            //var str = arguments[i].acronym;
                                                            
                                                            if (arguments.length>2) {
																var str = arguments[i].title;
                                                            	var label = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " [" + str + "]";
															}
															else {
																var label = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual];
															}
                                                        }
                                                        $sem = $sem + 1;

                                                        if ($sem > 100000) {
                                                            var str = arguments[i].acronym;
                                                            var str = arguments[i].title;
                                                            var label = arguments[i]['data']['table'][j].individual + " [" + str + "]";
                                                        }

                                                    }


                                                    for (value in obj_[j]) {
                                                        var pieColor = '#000000';
														
														/*
                                                        if (colorsIdentities) {

                                                            var cntObject = 0;

                                                            for (var index in colorsIdentities) {

                                                                if (j == cntObject) {


                                                                    if (colorsIdentities[index]) {
                                                                        pieColor = colorsIdentities[index];
                                                                    }
                                                                }

                                                                cntObject = cntObject + 1;
                                                            }

                                                        } else {
                                                            pieColor = $scope.colorScale(arguments[i]['data']['table'][j].individual.title)
                                                        }
                                                        */
                                                        if (colorsIdentities) {
                                                        	pieColor = $scope.optionToPlot[arguments[i].id].identitiescolors[arguments[i]['data']['table'][j].individual];
                                                    	} else {
	                                                        pieColor = $scope.colorScale($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]);
    	                                                }

                                                        var arrayPieTmp = {
                                                            'Key': value,
                                                            'Label': label,
                                                            'Value': obj_[j][value],
                                                            'Unit': labelTemporalYAxes,
                                                            'Color': pieColor,
                                                        };

                                                        arrayDataset.push(arrayPieTmp);
                                                        $scope.arrayDataset.push(arrayPieTmp);

                                                        arrayLabels[value] = [];
                                                        arrayValues[value] = [];
                                                        arrayUnits[value] = [];
                                                        arrayColors[value] = [];
                                                    }

                                                } else if ($scope.typeToPlot === 'graph_bars') {

                                                    var label = "";

                                                    var key = "";

                                                    $sem = 0;
                                                    while (key == "") {
                                                        if ($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]) {
                                                        	if (arguments.length>2) {
                                                            	//var str = arguments[i].acronym;
																var str = arguments[i].title;
                                                            	var key = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " [" + str + "]_" + j;
                                                           	}
                                                           	else {
                                                           		var key = $scope.TitleIndividuals[arguments[i]['data']['table'][j].individual] + " _" + j;
                                                           	}
                                                        }
                                                        $sem = $sem + 1;

                                                        if ($sem > 100000) {
                                                            //var str = arguments[i].acronym;
															var str = arguments[i].title;
                                                            var key = arguments[i]['data']['table'][j].individual + " [" + str + "]_" + j;

                                                        }


                                                    }

													
													var lineColor = '#000000';


                                                    if (colorsIdentities) {
                                                        lineColor = $scope.optionToPlot[arguments[i].id].identitiescolors[arguments[i]['data']['table'][j].individual];
                                                    } else {
                                                        lineColor = $scope.colorScale($scope.TitleIndividuals[arguments[i]['data']['table'][j].individual]);
                                                    }
                                                    
                                                    
                                                    
                                                    for (value in obj_[j]) {


                                                        arrayDatasetTmp = {
                                                            'Category': 1,
                                                            'From': obj_[j][value],
                                                            'Key': key,
                                                            'To': value,
                                                            'Value': obj_[j][value],
                                                            'ValueX': value,
                                                            'ValueY': obj_[j][value],
                                                            'XY': value + "|" + obj_[j][value],
                                                            'labelY': labelTemporalYAxes,
                                                            'Color': lineColor
                                                        };

                                                        arrayDataset.push(arrayDatasetTmp);
                                                        $scope.arrayDataset.push(arrayDatasetTmp);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }


                            if (($scope.typeToPlot === 'map_1') || ($scope.typeToPlot === 'mercator') || ($scope.typeToPlot === 'conicConformal') || ($scope.typeToPlot === 'equirectangular') || ($scope.typeToPlot === 'orthographic') || ($scope.typeToPlot === 'azimuthalEqualArea')) {

                                for (i in $scope.arrayDatesInDataCountryEval) {
                                    arrayDatesInDataCountry.push({'Key': arrayDatesInDataCountryEval[i]});
                                    $scope.arrayDatesInDataCountry.push({'Key': $scope.arrayDatesInDataCountryEval[i]});
                                }

                                if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                    $scope.$watch('semCountries', function (semCountries) {

                                        if ($scope.semCountries == $scope.cntCountriesToPlot) {
                                            if (arrayDataByCounty.length > 0) {
                                                $scope.datasetToSendMap = arrayDataByCounty;
                                            } else {
                                                $scope.datasetToSendMap = [
                                                    {
                                                        id: "",
                                                        data: ""
                                                    }
                                                ];
                                            }                                            
                                            $scope.plotMapChart();
                                        }


                                    });
                                } 
                                else {

                                    $scope.$watch('semCountries', function (semCountries) {

                                        if ($scope.semCountries == $scope.cntCountriesToPlot) {
                                            if (arrayDataByCounty.length > 0) {
                                                $scope.datasetToSendMap = arrayDataByCounty;
                                            } else {
                                                $scope.datasetToSendMap = [
                                                    {
                                                        id: "",
                                                        data: ""
                                                    }
                                                ];
                                            }
                                        }
                                    });
                                }

                            } else if ($scope.typeToPlot === 'graph_line') {
                                var numbers1 = arrayDataset;
                                $scope.numbers1 = $scope.arrayDataset;

                                if ($scope.arrayDataset.length == 0) {
                                    
                                    $scope.numbers1 = [];
                                    if ($scope.mode == "create") {
                                        if ($scope.autoreplot != 1) {
                                            $scope.rePlotGraph();
                                        }
                                        $scope.autoreplot = 1;
                                    }
                                } else {
                                    var legendsColumn = 0;
                                    if ($scope.showLegend) {
                                        legendsColumn = Math.ceil($scope.numbers1.length / 9);
                                    } else {
                                        legendsColumn = 0;
                                    }

                                    if ($scope.numbers1) {
                                        if ($scope.list) {
                                            legendsColumn = 0;
                                        }
										
										var maxLength = 0;
										if (numbers1.length>maxLength) {
											maxLength = numbers1.length;
										}
										if ($scope.eventsToPlot.length>maxLength) {
											maxLength = $scope.eventsToPlot.length;
										}
										
										maxLength = maxLength +1;
										
                                        var margin = {
                                                top: 20,
                                                right: 20,
                                                //bottom: 55 + (legendsColumn) * 20,
                                                //bottom: ( 55 + (numbers1.length*20) + ($scope.eventsToPlot.length*20)),
                                                bottom: 55 + (maxLength) * 20,
                                                left: 44
                                            }, //width = 700,
                                            width = 980, //width = 1050,
                                            height = 326, font_size = 11, radiouspoint = 4, dymarging = 15, offsetYaxesR = 10, offsetYaxesL = -20, distanceXaxes = 45;

                                        if ($scope.list) {
                                            margin.top = margin.top / 5;
                                            margin.right = margin.right / 5;
                                            margin.bottom = margin.bottom / 5;
                                            margin.left = margin.left / 5;
                                            width = width / 5;
                                            height = height / 5;
                                            font_size = font_size / 5;
                                            radiouspoint = radiouspoint / 5;
                                            dymarging = dymarging / 5;
                                            offsetYaxesR = offsetYaxesR / 5;
                                            offsetYaxesL = offsetYaxesL / 5;
                                            distanceXaxes = distanceXaxes / 5;
                                            $scope.showLegend = false;

                                        }


                                        if (numbers1.length > 0) {
                                            $scope.numbers1 = numbers1;
                                            $scope.labelYAxe = labelYAxe;
                                        }

                                        if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                            if (document.getElementById("container_graph_" + $scope.visualization.id) != null) {
                                                document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = "";
                                            } else {
                                                document.getElementById("container_graph_").innerHTML = "";
                                            }

                                            var barLine = policycompass.viz.line({
                                                'idName': "container_graph_" + $scope.visualization.id,
                                                'width': width,
                                                'height': height,
                                                'margin': margin,
                                                'labelX': "label X",
                                                'labelY': labelYAxe,
                                                'radius': radiouspoint,
                                                'dymarging': dymarging,
                                                'offsetYaxesR': offsetYaxesR,
                                                'offsetYaxesL': offsetYaxesL,
                                                'distanceXaxes': distanceXaxes,
                                                'font_size': font_size,
                                                'showYAxesTogether': $scope.showYAxes,
                                                'showLegend': $scope.showLegend,
                                                'showLines': $scope.showLines,
                                                'showAreas': $scope.showAreas,
                                                'showPoints': $scope.showPoints,
                                                'showLabels': $scope.showLabels,
                                                'showGrid': $scope.showGrid,
                                                'showAsPercentatge': $scope.showAsPercentatge,
                                                'legendsColumn': legendsColumn,
                                                'resolution': $scope.resolution.value
                                            });

                                            if (numbers1.length > 0) {

                                                if ($scope.firstLoad == true) {
                                                    $scope.firstLoad = false;

                                                    $scope.$watch('sem', function (sem) {

                                                        if ($scope.sem == $scope.visualization.historical_events_in_visualization.length) {
                                                            barLine.render($scope.numbers1, $scope.eventsToPlot, $scope.mode);
                                                        }

                                                    });
                                                } else {

                                                    barLine.render($scope.numbers1, $scope.eventsToPlot, $scope.mode);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if ($scope.typeToPlot === 'graph_pie') {

                                if (arrayDataset.length > 0) {

                                    for (value in arrayDataset) {

                                        if (!arrayLabels[arrayDataset[value].Key]) {
                                            arrayLabels[arrayDataset[value].Key] = [];
                                            arrayValues[arrayDataset[value].Key] = [];
                                            arrayUnits[arrayDataset[value].Key] = [];
                                            arrayColors[arrayDataset[value].Key] = [];
                                        }

                                        arrayLabels[arrayDataset[value].Key].push(arrayDataset[value].Label);
                                        arrayValues[arrayDataset[value].Key].push(arrayDataset[value].Value);
                                        arrayUnits[arrayDataset[value].Key].push(arrayDataset[value].Unit);
                                        arrayColors[arrayDataset[value].Key].push(arrayDataset[value].Color);
                                   }

                                    var numbers2 = [];

                                    for (value in arrayLabels) {


                                        var dataRowTmpPie = {
                                            'Key': value,
                                            'Labels': arrayLabels[value],
                                            'Values': arrayValues[value],
                                            'Units': arrayUnits[value],
                                            'Colors': arrayColors[value]
                                        };

                                        numbers2.push(dataRowTmpPie);
                                    }

                                    numbers2.sort(function (a, b) {
                                        var amod = a.Key;
                                        var bmod = b.Key;
                                        //$scope.resolution='Month';

                                        if ($scope.resolution == 'Day') {
                                            var amod = a.Key;
                                            var bmod = b.Key;
                                        } else if ($scope.resolution == 'Month') {
                                            var amod = '01/' + a.Key;
                                            var bmod = '01/' + b.Key;
                                        } else if ($scope.resolution == 'Year') {
                                            var amod = '01/01/' + a.Key;
                                            var bmod = '01/01/' + b.Key;
                                        }
                                        var dateA = new Date(amod), dateB = new Date(bmod);
                                        return dateA - dateB //sort by date ascending
                                    });

                                    $scope.dataset = numbers2;
                                    $scope.numbers2 = numbers2;
									
									
									
									$scope.slider_translate_pie = {
									    options: {
									    	ceil: $scope.numbers2.length-1,
									    	floor: 0,
									    	showTicksValues: true,
									    	//ticksValuesTooltip: function(v) {
									        //	return 'Tooltip for ' + v;
									      	//},      
									      	translate: $scope.translateFunction,								      	
									    }
									};
									
                                    $scope.rangeDatesSliderMax = $scope.numbers2.length - 1;

                                    $scope.selectedAll = false;

                                    if ($scope.numbers2.length > 0) {

                                        var $arrayTmp = {};

                                        for (var l in $scope.numbers2) {
                                            if (l == 0) {
                                                $arrayTmp[$scope.numbers2[l].Key] = true;
                                            } else {
                                                $arrayTmp[$scope.numbers2[l].Key] = false;
                                            }
                                        }

                                        $scope.selection = {Keys: $arrayTmp};
                                    }

                                    $scope.plotPieChart();
                                    

                                }
                            } else if ($scope.typeToPlot === 'graph_bars') {

                                numbers1 = arrayDataset;
                                var datasetToSend = numbers1;
                                var legendsColumn = 0;
                                if ($scope.showLegend) {
                                    legendsColumn = Math.ceil(numbers1.length / 9);
                                } else {
                                    legendsColumn = 0;
                                }

                                if ($scope.list) {
                                    legendsColumn = 0;
                                }
								
								
                                var margin = {
                                    top: 20,
                                    right: 20,
                                    bottom: 55 + (legendsColumn) * 20,
                                    left: 44
                                };
                                var width = 980;// - margin.left - margin.right;
                                var height = 326;

                                var font_size = 11;

                                if ($scope.list) {
                                    width = width / 5;
                                    height = height / 5;
                                    margin.top = margin.top / 5;
                                    margin.right = margin.right / 5;
                                    margin.bottom = margin.bottom / 5;
                                    margin.left = margin.left / 5;
                                    font_size = font_size / 5;
                                    $scope.showLegend = false;
                                }

                                if (datasetToSend.length > 0) {
                                    var eventsArray = [];
                                    $scope.datasetToSend = datasetToSend;
                                }

                                if (($scope.mode == 'create') || ($scope.mode == 'edit')) {
                                    if (document.getElementById("container_graph_" + $scope.visualization.id) != null) {
                                        document.getElementById("container_graph_" + $scope.visualization.id).innerHTML = "";
                                    } else {
                                        document.getElementById("container_graph_").innerHTML = "";
                                    }

                                    var barObj = policycompass.viz.barsMultiple({
                                        'idName': "container_graph_" + $scope.visualization.id,
                                        'width': width,
                                        'height': height,
                                        'margin': margin,
                                        'labelX': "",
                                        'labelY': labelYAxe,
                                        'radius': 4,
                                        'font_size': font_size,
                                        'showLegend': $scope.showLegend,
                                        'showLines': $scope.showLines,
                                        'showAreas': $scope.showAreas,
                                        'showPoints': $scope.showPoints,
                                        'showLabels': $scope.showLabels,
                                        'showGrid': $scope.showGrid,
                                        'legendsColumn': legendsColumn,
                                        'resolution': $scope.resolution.value,
                                        'showAsPercentatge': $scope.showAsPercentatge,
                                    });
                                    barObj.render(datasetToSend, eventsArray);
                                }
                            }
                        }
                    }
                }
            }
        }
    ])


    .controller('VisualizationsDetailController', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Event',
        'Metric',
        'Dataset',
        'Visualization',
        'VisualizationByDataset',
        'VisualizationByEvent',
        'FCMByIndividualSelected',
        'FCMByDatasetSelected',
        '$location',
        'GetRelatedData',
        'dialogs',
        '$log',
        'API_CONF',
        'Auth',
        function ($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, VisualizationByDataset, VisualizationByEvent, FCMByIndividualSelected, FCMByDatasetSelected, $location, helper, dialogs, $log, API_CONF, Auth) {

            $scope.user = Auth;
    
            helper.baseGetRelatedDataController($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, API_CONF);

            $scope.imageVisu = '/media/visualization_' + $routeParams.visualizationId + '.png';
            $scope.arrayIndividualsUsed = [];

			
            $scope.visualization = Visualization.get({id: $routeParams.visualizationId}, function (visualizationList) {
                var id_visu = $routeParams.visualizationId;
                $scope.relatedVisualizations = [];

                for (i in $scope.visualization.datasets_in_visualization) {
                    id = $scope.visualization.datasets_in_visualization[i].dataset_id;
                    $scope.getMetricData(i, id, "", "", "");

                    var arrayConfigMetricsFiltersToGetData = $scope.visualization.datasets_in_visualization[i]['visualization_query'].split(",");

                    for (x = 0; x < arrayConfigMetricsFiltersToGetData.length; x++) {

                        var dataFilter = arrayConfigMetricsFiltersToGetData[x].split(":");

                        if (dataFilter[0] == 'Individual') {
                            var dataIndividuos = dataFilter[1].split(";");

                            for (xi = 0; xi < dataIndividuos.length; xi++) {
                                if (!$scope.arrayIndividualsUsed[dataIndividuos[xi]]) {
                                    
                                    $scope.arrayIndividualsUsed[dataIndividuos[xi]] = dataIndividuos[xi];
                                }
                            }


                        }
                    }


                    $scope.visualizationByMetricList = VisualizationByDataset.get({id: id}, //function(visualizationByMetricList) {
                        function (VisualizationByDatasetList) {
                            for (i in VisualizationByDatasetList.results) {
                                var Tmp = {
                                    "visualization_id": VisualizationByDatasetList.results[i]['visualization'],
                                    "title": VisualizationByDatasetList.results[i]['title']
                                }

                                found = false;

                                if (id_visu == VisualizationByDatasetList.results[i]['visualization']) {
                                    found = true;
                                } else {
                                    for (var j = 0; j < $scope.relatedVisualizations.length; j++) {
                                        if ($scope.relatedVisualizations[j].visualization_id == VisualizationByDatasetList.results[i]['visualization']) {
                                            found = true;
                                            break;
                                        }
                                    }
                                }

                                if (!found) {
                                    $scope.relatedVisualizations.push(Tmp);
                                }


                            }

                        });

                }

                $scope.fcmRelated = [];
                $scope.idsFCM_related = [];
                if ($scope.arrayIndividualsUsed.length > 0) {
                    for (var cj in $scope.arrayIndividualsUsed) {
                        idIndiv = $scope.arrayIndividualsUsed[cj];

                        $scope.relatedFCMByIndividual = FCMByIndividualSelected.query({
                            id: idIndiv
                        }, function (relatedFCMByIndividual) {

                            for (var ci in relatedFCMByIndividual) {
                                if (relatedFCMByIndividual[ci]) {
                                    var a = $scope.idsFCM_related.indexOf(relatedFCMByIndividual[ci]['id']);
                                    if (a < 0) {
                                        $scope.idsFCM_related.push(relatedFCMByIndividual[ci]['id']);
                                        var datosFCMByIndividual = {
                                            'id': relatedFCMByIndividual[ci]['id'],
                                            'title': relatedFCMByIndividual[ci]['title']
                                        };
                                        $scope.fcmRelated.push(datosFCMByIndividual);
                                    }
                                }
                            }

                        }, function (error) {

                        });
                    }
                }

                for (i in $scope.visualization.datasets_in_visualization) {
                    var idDataset = $scope.visualization.datasets_in_visualization[i].dataset_id;

                    $scope.FCMByDatasetSelected = FCMByDatasetSelected.query({
                        id: idDataset
                    }, function (relatedFCMByDataset) {

                        for (var ci in relatedFCMByDataset) {
                            if (relatedFCMByDataset[ci]) {
                                var a = $scope.idsFCM_related.indexOf(relatedFCMByDataset[ci]['id']);
                                if (a < 0) {
                                    $scope.idsFCM_related.push(relatedFCMByDataset[ci]['id']);
                                    var datosFCMByDataset = {
                                        'id': relatedFCMByDataset[ci]['id'],
                                        'title': relatedFCMByDataset[ci]['title']
                                    };
                                    $scope.fcmRelated.push(datosFCMByDataset);
                                }
                            }
                        }

                    }, function (error) {

                    });

                }

                var colorTmp = [];
                for (i in $scope.visualization.historical_events_in_visualization) {
                    id = $scope.visualization.historical_events_in_visualization[i].historical_event_id;
                    colorTmp[id] = $scope.visualization.historical_events_in_visualization[i].color;
                    $scope.getHistoricalEventcData(id, colorTmp[id]);
                    $scope.visualizationByEventList = VisualizationByEvent.get({id: id}, function (visualizationByEventList) {

                        for (i in visualizationByEventList.results) {
                            var Tmp = {
                                "visualization_id": visualizationByEventList.results[i]['visualization'],
                                "title": visualizationByEventList.results[i]['title']
                            }

                            found = false;

                            if (id_visu == visualizationByEventList.results[i]['visualization']) {
                                found = true;
                            } else {
                                for (var j = 0; j < $scope.relatedVisualizations.length; j++) {
                                    if ($scope.relatedVisualizations[j].visualization_id == visualizationByEventList.results[i]['visualization']) {
                                        found = true;
                                        break;
                                    }
                                }
                            }

                            if (!found) {
                                $scope.relatedVisualizations.push(Tmp);
                            }


                        }

                    });

                }

            }, function (error) {
                //throw {message: JSON.stringify(error.data.message)};                
                $location.path('/visualizations');
            });


            // Function for deleting the visualization
            $scope.deleteVisualization = function (visualization) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the visualization '" + visualization.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the visualization via the API
                    visualization.$delete({}, function () {
                        $location.path('/visualizations');
                    });
                });
            };

            $scope.deleteCurrentVisualisation = function () {
                $scope.deleteVisualization($scope.visualization);
            }

        }
    ])

	//controler to list visualizations
    .controller('VisualizationsController', [
        '$scope', 'Visualization', '$log', '$routeParams', function ($scope, Visualization, $log, $routeParams) {

            $scope.visualizations = Visualization.query({
                page: $routeParams.page
            }, function (visualizationList) {
            }, function (error) {
                throw {message: JSON.stringify(error.data.message)};
            });

        }
    ])

	//controler to view the detail of a visualization
    .controller('VisualizationDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Visualization',
        function ($scope, $routeParams, $location, Visualization) {

            $scope.visualization = Visualization.get({id: $routeParams.visualizationId}, function (visualizationList) {
            }, function (error) {
                throw {message: JSON.stringify(error.data.message)};
            });

            $scope.deleteVisualization = function (visualization) {
                visualization.$delete({}, function () {
                    $location.path('/visualization');
                });
            };


        }
    ])

	//controler to edit of a visualization
    .controller('VisualizationsEditController', [
        '$filter',
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Event',
        'Metric',
        'Dataset',
        'Visualization',
        '$location',
        'VisualizationsControllerHelper',
        '$log',
        'dialogs',
        'API_CONF',
        'Individual',
        'Unit',
        'Auth',
        function ($filter, $scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, dialogs, API_CONF, Individual, Unit, Auth) {

            $scope.user = Auth;

            $scope.userCanSave = true;

            $scope.DatasetsLoaded = [];
            $scope.TimeSelector = [];
            $scope.scaleColor = '#f27711';

            //$scope.curPageDataset = 0;
            //$scope.pageSizeDataset = 5;
            //$scope.pageSizeDataset = 2;
            //$scope.pagePagesSizeDataset = 10;
            
            //$scope.pageChangedDataset = function() {
			//	console.log("2 $scope.pageChangedDataset");
			//}
						

            $scope.list = false;
            $scope.firstLoad = true;

            if ($scope.idvisulist) {
                $routeParams.visualizationId = $scope.idvisulist;
                $scope.list = true;
            }

            var locationURL = $location.path();

            if (locationURL.indexOf("edit") > -1) {
                $scope.mode = "edit";
                $scope.isFirstOpen = true;
            } else {
                $scope.mode = "view";
            }


            $scope.resetlocation = '/visualizations/' + $routeParams.visualizationId + '/edit/';

            helper.baseVisualizationsCreateController($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, API_CONF, Individual, Unit);

            $scope.ListMetricsFilter = [];
            $scope.ListMetricsFilterModal = [];
            
            $scope.visualization = Visualization.get({id: $routeParams.visualizationId}, function (visualization) {

                $scope.visualization.language_data = {
                    input: visualization.language_id,
                    output: [visualization.language_id]
                };

				$scope.$watchCollection(
				"visualization.language_data",
				function( newValue, oldValue ) 
				{
					if (newValue.output[0]!=oldValue.output[0]) {
						$scope.disableRevert = false;
					}
					else if (newValue.output.length!=oldValue.output.length) {						
						$scope.disableRevert = false;
					}
				}
				);

                $scope.visualization.location_data = {
                    input: visualization.location,
                    output: [visualization.location]
                };


				$scope.$watchCollection(
				"visualization.location_data",
				function( newValue, oldValue ) 
				{
					if (newValue.output[0]!=oldValue.output[0]) {
						$scope.disableRevert = false;
					}
					else if (newValue.output.length!=oldValue.output.length) {						
						$scope.disableRevert = false;
					}
				}
				);

                $scope.visualization.policy_domains_data = {
                    input: visualization.policy_domains,
                    output: visualization.policy_domains
                };


				$scope.$watchCollection(
				"visualization.policy_domains_data",
				function( newValue, oldValue ) 
				{
					if (newValue.output[0]!=oldValue.output[0]) {
						$scope.disableRevert = false;
					}
					else if (newValue.output.length!=oldValue.output.length) {						
						$scope.disableRevert = false;
					}
				}
				);
								
				
            }, function (error) {
                //throw {message: JSON.stringify(error.data.message)};
                //console.log (JSON.stringify(error.data.message));
            });


            $scope.visualization.$promise.then(function (metric) {

                $scope.visualization.language = $scope.visualization.language_id;

                var configurationFilter = $scope.visualization.filter_configuration;
                var arrayConfigFilter = configurationFilter.split(",");

                for (x = 0; x < arrayConfigFilter.length; x++) {
                    var dataFilter = arrayConfigFilter[x].split("=");

                    if (dataFilter[0] == 'graphSelected') {

                        if ((dataFilter[1] == 'graph_line') || (dataFilter[1] == 'graph_pie') || (dataFilter[1] == 'graph_bars')) {
                            $scope.tabParent = 2;
                        } else if (dataFilter[1]) {
                            $scope.tabParent = 1;
                        } else {
                            $scope.tabParent = 2;
                        }
                        $scope.tabSon = dataFilter[1];
                        $scope.typeToPlot = dataFilter[1];

                    } else if (dataFilter[0] == 'resolution') {

                        var endPos = $scope.resolutionoptions.length - 1;

                        for (var i = 0; i < $scope.resolutionoptions.length; i++) {

                            if (dataFilter[1] == $scope.resolutionoptions[i].value) {
                                endPos = i;
                            }
                        };


                        $scope.resolution = $scope.resolutionoptions[endPos];
                        $scope.FilterResolution = $scope.arrayResolutions[endPos];

                    } else if (dataFilter[0] == 'scaleColor') {
                        if (dataFilter[1]) {
                            $scope.scaleColor = dataFilter[1];
                        } else {
                            $scope.scaleColor = '#f27711';
                        }
                    } else {
                        eval("$scope." + dataFilter[0] + "=" + dataFilter[1]);
                    }
                }

                $scope.idHE = [];
                $scope.titleHE = [];
                $scope.startDateHE = [];
                $scope.endDateHE = [];
                $scope.descHE = [];
                $scope.colorHE = [];

                $scope.eventsToPlot = [];

                $scope.sem = 0;
                for (i in $scope.visualization.historical_events_in_visualization) {
                    var endEventDate = '';
                    var startEventDate = '';
                    var titleEvent = '';
                    var getHEData = true;
                    if ($scope.visualization.historical_events_in_visualization[i].data) {
                        endEventDate = $scope.visualization.historical_events_in_visualization[i].data.endEventDate;
                        startEventDate = $scope.visualization.historical_events_in_visualization[i].data.startEventDate;
                        titleEvent = $scope.visualization.historical_events_in_visualization[i].data.title;
                        getHEData = false;
                    }

                    $scope.idHE[(parseInt(i) + 1)] = $scope.visualization.historical_events_in_visualization[i].historical_event_id;
                    $scope.titleHE[(parseInt(i) + 1)] = titleEvent;
                    $scope.startDateHE[(parseInt(i) + 1)] = startEventDate;
                    $scope.endDateHE[(parseInt(i) + 1)] = endEventDate;
                    $scope.descHE[(parseInt(i) + 1)] = $scope.visualization.historical_events_in_visualization[i].description;
                    $scope.colorHE[(parseInt(i) + 1)] = $scope.visualization.historical_events_in_visualization[i].color;

                    var datosInT = {
                        id: $scope.visualization.historical_events_in_visualization[i].historical_event_id, 
                        title: titleEvent, 
                        startDate: startEventDate, 
                        endDate: endEventDate,
                        desc: $scope.visualization.historical_events_in_visualization[i].description,
                        color: $scope.visualization.historical_events_in_visualization[i].color
                    }

                    $scope.eventsToPlot[i] = datosInT;

                    if (getHEData) {
                        $scope.getEventDataDetail(i, $scope.visualization.historical_events_in_visualization[i], function (resultado) {
                            $scope.sem = $scope.sem + 1;
                        });
                    } else {
                        $scope.sem = $scope.sem + 1;
                    }
                }


                $scope.ListMetricsFilter = [];
                $scope.ListMetricsFilterModal = [];
                
                $scope.metricsFilter = $scope.ListMetricsFilter;

                $scope.MetricSelectediId_ = [];
                $scope.MetricSelectediIndex_ = [];
                $scope.MetricSelectorLabelColumn_ = [];
                $scope.MetricSelectorDataColumn_ = [];
                $scope.MetricSelectorGroupingData_ = [];

                $scope.unitsCombo_value_ = [];
                $scope.UnitSelectorLabelColumn_ = [];
                $scope.IndividualSelectorLabelColumn_ = [];
                $scope.IndividualDatasetCheckboxes_ = [];
                $scope.ModalIndividualDatasetCheckboxes_ = [];

                $scope.ListIndividualDatasetCheckboxes_ = [];
                $scope.dataset_color_palete_ = [];

                $scope.individualCombo_value_ = [];

                $scope.optionsCombo_ = [];
                $scope.optionsCombo_value_ = [];


                for (i in $scope.visualization.datasets_in_visualization) {

                    var id = $scope.visualization.datasets_in_visualization[i].dataset_id;

                    $scope.MetricSelectediId_[id] = id;
                    $scope.MetricSelectediIndex_[id] = id;

                    var configurationMetricsFilters = $scope.visualization.datasets_in_visualization[i].visualization_query;

                    var arrayConfigMetricsFilters = configurationMetricsFilters.split(",");


                    var valueColumTemp = "";
                    var valueGroupTemp = "";
                    for (x = 0; x < arrayConfigMetricsFilters.length; x++) {
                        var dataFilter = arrayConfigMetricsFilters[x].split(":");

                        if (dataFilter[0] == 'Label') {
                            $scope.MetricSelectorLabelColumn_[id] = dataFilter[1];
                        }

                        else if (dataFilter[0] == 'Column') {
                            $scope.MetricSelectorDataColumn_[id] = dataFilter[1];
                            valueColumTemp = dataFilter[1];

                        } else if (dataFilter[0] == 'Grouping') {
                            if (dataFilter[1] != "undefined") {
                                $scope.MetricSelectorGroupingData_[id] = dataFilter[1];
                                valueGroupTemp = dataFilter[1];
                            } else {
                                $scope.MetricSelectorGroupingData_[id] = "";
                                valueGroupTemp = "";
                            }

                        } else if (dataFilter[0] == 'Individual') {
                            $scope.ListIndividualDatasetCheckboxes_[id] = dataFilter[1].split(";");
                        } else if (dataFilter[0] == 'Colors') {
                            var tmp = dataFilter[1].split(";");
                            $scope.dataset_color_palete_[id] = [];

                            for (j in $scope.ListIndividualDatasetCheckboxes_[id]) {
                                var posj = $scope.ListIndividualDatasetCheckboxes_[id][j];
                                $scope.dataset_color_palete_[id][posj] = tmp[j];
                            }

                        }

                    }

                    selectedText = " ";

                    var myObject = {
                        'id': $scope.MetricSelectediId_[id], //'name': $scope.visualization.metrics_in_visualization[i].title,
                        'name': $scope.visualization.datasets_in_visualization[i].title, //'title': $scope.visualization.metrics_in_visualization[i].title,
                        'title': $scope.visualization.datasets_in_visualization[i].title, //'issued': $scope.visualization.metrics_in_visualization[i].issued,
                        'issued': $scope.visualization.datasets_in_visualization[i].issued,
                        'identities': $scope.ListIndividualDatasetCheckboxes_[id],
                        'identitiescolors': $scope.dataset_color_palete_[id],
                        'column': $scope.MetricSelectorLabelColumn_[id],
                        'value': $scope.MetricSelectorDataColumn_[id],
                        'group': $scope.MetricSelectorGroupingData_[id]
                    };

                    $scope.ListMetricsFilter[i] = myObject;
                    $scope.getMetricDataDetail(i, id, $scope.MetricSelectorLabelColumn_[id], $scope.MetricSelectorDataColumn_[id], $scope.MetricSelectorGroupingData_[id], $scope.ListIndividualDatasetCheckboxes_[id], $scope.dataset_color_palete_[id]);


                    $scope.correctmetrics = "1";
                }

                $scope.rePlotGraph();

            });


            $scope.getEventDataDetail = function (posI, datIn, callback) {

                $scope.her = Event.get({id: datIn.historical_event_id}, function (her) {

                    var tmp_startDate = $filter('date')(her.startEventDate, "yyyy-MM-dd");
                    var tmp_endDate = $filter('date')(her.endEventDate, "yyyy-MM-dd");

                    var myObject = {
                        id: her.id,
                        title: her.title, 
                        startDate: tmp_startDate,
                        endDate: tmp_endDate,
                        desc: datIn.description,
                        color: datIn.color
                    }

                    $scope.titleHE[(parseInt(posI) + 1)] = her.title;
                    $scope.startDateHE[(parseInt(posI) + 1)] = her.startEventDate;
                    $scope.endDateHE[(parseInt(posI) + 1)] = her.endEventDate;

                    $scope.eventsToPlot[posI] = myObject;
                    callback(myObject);

                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });

            };

            $scope.getMetricDataDetail = function (posI, metricId, column, value, group, identities, identitiescolors) {

                $scope.metric = Dataset.get({id: metricId}, function (metric) {

                    var myObject = {
                        'id': metric.id,
                        'name': metric.title,
                        'title': metric.title,
                        'issued': metric.issued,
                        'column': column,
                        'value': value,
                        'group': group,
                        'identities': identities,
                        'identitiescolors': identitiescolors
                    };

                    $scope.ListMetricsFilter[posI] = myObject;

                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            };


            $scope.createVisualization = function (metricListIn) {
                $scope.visualization.views_count = 0;
                $scope.visualization.visualization_type_id = 1;

                if ($scope.typeToPlot == 'graph_line') {
                    $scope.visualization.visualization_type_id = 1;
                } else if ($scope.typeToPlot == 'graph_pie') {
                    $scope.visualization.visualization_type_id = 2;
                } else if ($scope.typeToPlot == 'graph_bars') {
                    $scope.visualization.visualization_type_id = 3;
                } else {
                    $scope.visualization.visualization_type_id = 4;
                }

                $scope.visualization.status_flag_id = 0;

                var dataConfig = [];
                dataConfig['graphSelected'] = $scope.typeToPlot;
                dataConfig['showLegend'] = $scope.showLegend;
                dataConfig['showLines'] = $scope.showLines;
                dataConfig['showAreas'] = $scope.showAreas;
                dataConfig['showPoints'] = $scope.showPoints;
                dataConfig['showLabels'] = $scope.showLabels;
                dataConfig['showGrid'] = $scope.showGrid;
                dataConfig['showYAxes'] = $scope.showYAxes;
                dataConfig['showZoom'] = $scope.showZoom;
                dataConfig['showBubbles'] = $scope.showBubbles;
                dataConfig['showMovement'] = $scope.showMovement;
                dataConfig['scaleColor'] = $scope.scaleColor;

                dataConfig['showAsPercentatge'] = $scope.showAsPercentatge;
                dataConfig['resolution'] = $scope.resolution['value'];

                if ($scope.timeStart != '----') {
                    dataConfig['timeStart'] = $scope.timeStart;
                }
                if ($scope.timeEnd != '----') {
                    dataConfig['timeEnd'] = $scope.timeEnd;
                }


                var dataMetrics = [];

                for (j in metricListIn) {
                    i = metricListIn[j].id;
                    $scope.MetricSelectediId_[i] = i;

                    if (!isNaN($scope.MetricSelectediId_[i])) {
                        var myindex = $scope.MetricSelectediIndex_[i];


                        value = '';

                        var arrayValuesInString = [];
                        if ($scope.IndividualDatasetCheckboxes_[myindex]) {
	                        for (var i = 0; i < $scope.IndividualDatasetCheckboxes_[myindex].length; i++) {
	
	                            if (!isNaN(i)) {
	                                if ($scope.IndividualDatasetCheckboxes_[myindex][i] > 0) {
	                                    var a = arrayValuesInString.indexOf($scope.IndividualDatasetCheckboxes_[myindex][i]);
	                                    if (a < 0) {
	                                        if (value) {
	                                            value = value + ';';
	                                        }
	                                        arrayValuesInString.push($scope.IndividualDatasetCheckboxes_[myindex][i]);
	                                        value = value + $scope.IndividualDatasetCheckboxes_[myindex][i];
	                                    }
	                                }
	                            }
	                        }
                        }

                        var selectorIndividualData = value;

                        value = '';
                        for (var i in arrayValuesInString) {

                            if (value) {
                                value = value + ';';
                            }
                            value = value + $scope.dataset_color_palete_[metricListIn[j].id][arrayValuesInString[i]];

                        }
                        
                        var selectorIndividualColorData = value;

                        var visualization_query_data = 'Individual:' + selectorIndividualData + ',Colors:' + selectorIndividualColorData;


                        var rowMetric = {
                            dataset: myindex,
                            visualization_query: visualization_query_data
                        };

                        dataMetrics.push(rowMetric);
                    }
                }


                var dataHE = [];

                for (i in $scope.idHE) {
                    if (!isNaN($scope.idHE[i])) {
                        var rowHE = {
                            historical_event: $scope.idHE[i],
                            description: $scope.descHE[i],
                            color: $scope.colorHE[i]
                        };
                        dataHE.push(rowHE);
                    }
                }


                var string_filter_configuration = "";
                for (key in dataConfig) {
                    if (!string_filter_configuration == "") {
                        string_filter_configuration = string_filter_configuration + ",";
                    }
                    string_filter_configuration = string_filter_configuration + key + "=" + dataConfig[key];
                }


                $scope.visualization.filter_configuration = string_filter_configuration;
                if (dataHE.length > 0) {
                    $scope.visualization.historical_events_in_visualization = dataHE;
                } else {
                    var rowHE = {
                        historical_event: "",
                        description: "",
                        color: ""
                    };
                    dataHE.push(rowHE);

                    $scope.visualization.historical_events_in_visualization = dataHE;
                }


                $scope.visualization.datasets_in_visualization = dataMetrics;
                $scope.visualization.language_id = $scope.visualization.language_data.output[0];
                $scope.visualization.location = $scope.visualization.location_data.output[0];
                $scope.visualization.policy_domains = $scope.visualization.policy_domains_data.output;

                var saveErrorCallback = function (err) {
                    var headers = err.headers();
                    if (headers['content-type'] == 'text/html') {
                        dialogs.error("Internal Server Error", "Please contact the Policy Compass Administrators.");
                    }
                    if (headers['content-type'] == 'application/json') {
                        var data = err.data;
                        var message = '';

                        for (var key in data) {
                            message += '<b>' + key + '</b>' + ': ' + data[key] + '<br />';
                        }
                        dialogs.error("Error", message);
                    }
                };

                if (($scope.user.state.userPath != $scope.visualization.creator_path) && ($scope.user.state.isAdmin != true)) {
                    delete $scope.visualization.id;
                    delete $scope.visualization.self;
                    delete $scope.visualization.creator_path;
                    delete $scope.visualization.created_at;
                    delete $scope.visualization.updated_at;

                    $cntHE = 0;
                    for (i = 0; i < $scope.visualization.historical_events_in_visualization.length; i++) {
                        if ($scope.visualization.historical_events_in_visualization[i].historical_event > 0) {
                            $cntHE = $cntHE + 1;
                        }
                    }
                    if ($cntHE == 0) {
                        delete $scope.visualization.historical_events_in_visualization;
                    }


                    Visualization.save($scope.visualization, function (value, responseHeaders) {
                        $location.path('/visualizations/' + value.id);
                    }, saveErrorCallback);
                } else {

                    Visualization.update($scope.visualization, function (value, responseHeaders) {
                        $location.path('/visualizations/' + value.id);
                    }, saveErrorCallback);
                }


            };


        }
    ])


	//controler to view a graph
    .controller('VisualizationsGraphController', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Event',
        'Metric',
        'Visualization',
        '$location',
        'VisualizationsControllerHelper',
        '$log',
        'API_CONF',
        function ($scope, $route, $routeParams, $modal, Event, Metric, Visualization, $location, helper, $log, API_CONF) {

            


        }
    ])

	//controler to create a new visualization
    .controller('VisualizationsCreateController', [
        '$scope',
        '$route',
        '$routeParams',
        '$modal',
        'Event',
        'Metric',
        'Dataset',
        'Visualization',
        '$location',
        'VisualizationsControllerHelper',
        '$log',
        'dialogs',
        'API_CONF',
        'Individual',
        'Unit',
        'Auth',
        function ($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, dialogs, API_CONF, Individual, Unit, Auth) {

			$scope.hideTabs = false;
			
            $scope.user = Auth;

            $scope.DatasetsLoaded = [];
            $scope.TimeSelector = [];
            $scope.scaleColor = '#f27711';

            $scope.mode = "create";
            $scope.isFirstOpen = true;
            $scope.firstLoad = false;
            $scope.resetlocation = "/visualizations/create/";

            helper.baseVisualizationsCreateController($scope, $route, $routeParams, $modal, Event, Metric, Dataset, Visualization, $location, helper, $log, API_CONF, Individual, Unit);

            $scope.tabParent = 2;
            $scope.tabSon = 'graph_line';
            $scope.typeToPlot = 'graph_line';

            $scope.eventsToPlot = [];

            $scope.MetricSelectediId_ = [];
            $scope.MetricSelectediIndex_ = [];
            $scope.MetricSelectorLabelColumn_ = [];
            $scope.MetricSelectorDataColumn_ = [];
            $scope.MetricSelectorGroupingData_ = [];
            $scope.unitsCombo_value_ = [];
            $scope.UnitSelectorLabelColumn_ = [];
            $scope.IndividualSelectorLabelColumn_ = [];
            $scope.IndividualDatasetCheckboxes_ = [];
            $scope.ModalIndividualDatasetCheckboxes_ = [];
            $scope.dataset_color_palete_ = [];
            $scope.individualCombo_value_ = [];
            $scope.optionsCombo_ = [];
            $scope.optionsCombo_value_ = [];
            $scope.idHE = [];
            $scope.titleHE = [];
            $scope.startDateHE = [];
            $scope.endDateHE = [];
            $scope.descHE = [];
            $scope.colorHE = [];

            //filters
            $scope.showLegend = true;
            $scope.showLines = true;
            $scope.showAreas = true;
            $scope.showPoints = true;
            $scope.showLabels = true;
            $scope.showGrid = true;
            $scope.showYAxes = false;
            $scope.showZoom = false;
            $scope.showBubbles = false;
            $scope.showMovement = true;
            $scope.visualization = {};

            $scope.visualization.language_data = {
                input: '',
                output: []
            };

            $scope.visualization.location_data = {
                input: '',
                output: []
            };

            $scope.visualization.policy_domains_data = {
                input: '',
                output: []
            };

            this.historicalevent_he_id = '';
            this.historicalevent_he_title = '';
            this.historicalevent_he_startdate = '';
            this.historicalevent_he_enddate = '';
            this.historicalevent_he_description = '';
            
            var datasetsURL = $routeParams.datasets;
			
			
            if (datasetsURL) {
                var arrayMetricsURL = datasetsURL.split(",");
                for (x = 0; x < arrayMetricsURL.length; x++) {
                    if (arrayMetricsURL[x] > 0) {
                        $scope.metric = Dataset.get({id: arrayMetricsURL[x]}, function (metric) {
                            if (metric.id > 0) {
                            	
                            	$scope.dataset_color_palete_[metric.id]=[];
                            	
                            	for (xj = 0; xj < metric.data.individuals.length; xj++) {                            		
                            		 $scope.dataset_color_palete_[metric.id][metric.data.individuals[xj]]=$scope.colorScale(metric.data.individuals[xj]);
                            	}
                            	//$scope.dataset_color_palete_[metric.id]
                                $scope.addFilterMetric(metric.id, metric.title, metric.issued);
                            }
                        }, function (err) {
                            throw {message: JSON.stringify(err.data)};
                        });
                    }
                }
            }
            else {
            	$scope.ListMetricsFilter = [];
            	$scope.showModal('datasets');
            }

            var eventsURL = $routeParams.events;

            if (eventsURL) {
                var arrayEventsURL = eventsURL.split(",");
                for (x = 0; x < arrayEventsURL.length; x++) {
                    if (arrayEventsURL[x] > 0) {
                        $scope.event = Event.get({id: arrayEventsURL[x]},

                            function (event) {

                                if (event.id > 0) {
                                    var datosInT = {
                                        id: event.id,
                                        title: event.title,
                                        startDate: event.startEventDate,
                                        endDate: event.endEventDate,
                                        color: '#000000',
                                        desc: event.description
                                    }

                                    $scope.eventsToPlot.push(datosInT);

                                }

                            }, function (err) {
                                throw {message: JSON.stringify(err.data)};
                            });
                    }

                }
            }
            


            $scope.createVisualization = function (metricListIn) {

                $scope.visualization.views_count = 0;
                $scope.visualization.visualization_type_id = 1;


                if ($scope.typeToPlot == 'graph_line') {
                    $scope.visualization.visualization_type_id = 1;
                } else if ($scope.typeToPlot == 'graph_pie') {
                    $scope.visualization.visualization_type_id = 2;
                } else if ($scope.typeToPlot == 'graph_bars') {
                    $scope.visualization.visualization_type_id = 3;
                } else {
                    $scope.visualization.visualization_type_id = 4;
                }


                $scope.visualization.status_flag_id = 0;

                var dataConfig = [];
                dataConfig['graphSelected'] = $scope.typeToPlot;
                dataConfig['showLegend'] = $scope.showLegend;
                dataConfig['showLines'] = $scope.showLines;
                dataConfig['showAreas'] = $scope.showAreas;
                dataConfig['showPoints'] = $scope.showPoints;
                dataConfig['showLabels'] = $scope.showLabels;
                dataConfig['showGrid'] = $scope.showGrid;
                dataConfig['showYAxes'] = $scope.showYAxes;
                dataConfig['showZoom'] = $scope.showZoom;
                dataConfig['showBubbles'] = $scope.showBubbles;
                dataConfig['showMovement'] = $scope.showMovement;
                dataConfig['scaleColor'] = $scope.scaleColor;


                if (!$scope.showAsPercentatge) {
                    $scope.showAsPercentatge = false;
                }
                dataConfig['showAsPercentatge'] = $scope.showAsPercentatge;
                dataConfig['resolution'] = $scope.resolution['value'];

                if ($scope.timeStart != '----') {
                    dataConfig['timeStart'] = $scope.timeStart;
                }
                if ($scope.timeEnd != '----') {
                    dataConfig['timeEnd'] = $scope.timeEnd;
                }


                var dataMetrics = [];

                for (j in metricListIn) {
                    i = metricListIn[j].id;

                    if (!isNaN($scope.MetricSelectediIndex_[i])) {

                        var myindex = $scope.MetricSelectediIndex_[i];
                        value = '';

                        arrayValuesInString = [];
                        if ($scope.IndividualDatasetCheckboxes_.length > 0) {
                            for (var i = 0; i < $scope.IndividualDatasetCheckboxes_[myindex].length; i++) {
                                if (!isNaN(i)) {
                                    if ($scope.IndividualDatasetCheckboxes_[myindex][i] > 0) {
                                        if (value) {
                                            value = value + ';';
                                        }
                                        value = value + $scope.IndividualDatasetCheckboxes_[myindex][i];

                                        arrayValuesInString.push($scope.IndividualDatasetCheckboxes_[myindex][i]);
                                    }
                                }
                            };
                        }

                        var selectorIndividualData = value;
                        value = '';

                        for (var i in arrayValuesInString) {
                            if (value) {
                                value = value + ';';
                            }
                            value = value + $scope.dataset_color_palete_[metricListIn[j].id][arrayValuesInString[i]];
                        }

                        var selectorIndividualColorData = value;

                        var visualization_query_data = 'Individual:' + selectorIndividualData + ',Colors:' + selectorIndividualColorData;

                        var rowMetric = {
                            dataset: myindex,
                            visualization_query: visualization_query_data
                        };

                        dataMetrics.push(rowMetric);
                    }
                }


                var dataHE = [];

                for (i in $scope.idHE) {
                    if (!isNaN($scope.idHE[i])) {
                        var rowHE = {
                            historical_event: $scope.idHE[i],
                            description: $scope.descHE[i],
                            color: $scope.colorHE[i]
                        };
                        dataHE.push(rowHE);
                    }
                }


                var data = [];
                var extra = [];


                var string_filter_configuration = "";
                for (key in dataConfig) {
                    if (!string_filter_configuration == "") {
                        string_filter_configuration = string_filter_configuration + ",";
                    }
                    string_filter_configuration = string_filter_configuration + key + "=" + dataConfig[key];
                }

                $scope.visualization.filter_configuration = string_filter_configuration;
                $scope.visualization.historical_events_in_visualization = dataHE;
                $scope.visualization.datasets_in_visualization = dataMetrics;
                $scope.visualization.language_id = $scope.visualization.language_data.output[0];
                $scope.visualization.location = $scope.visualization.location_data.output[0];
                $scope.visualization.policy_domains = $scope.visualization.policy_domains_data.output;

                var saveErrorCallback = function (err) {
                    var headers = err.headers();
                    if (headers['content-type'] == 'text/html') {
                        dialogs.error("Internal Server Error", "Please contact the Policy Compass Administrators.");
                    }
                    if (headers['content-type'] == 'application/json') {
                        var data = err.data;
                        var message = '';

                        for (var key in data) {
                            message += '<b>' + key + '</b>' + ': ' + data[key] + '<br />';
                        }
                        dialogs.error("Error", message);
                    }
                };

                Visualization.save($scope.visualization, function (value, responseHeaders) {
                    $location.path('/visualizations/' + value.id);
                }, saveErrorCallback);

            };

            $scope.ListMetricsFilter = [];
            $scope.ListMetricsFilterModal = [];
            $scope.metricsFilter = $scope.ListMetricsFilter;

        }
        
    ])


angular.module('pcApp.visualization').filter('pagination', function () {
    return function (input, start) {
        start = +start;
        if (input) {
            return input.slice(start);
        } else {
            return start;
        }

    };
})

	//controller used in the modal window used to link datasets
    .controller('ModalWindowInstanceCtrlDataset', [
        '$scope',
        'VisualizationByDataset',
        'Visualization',
        'Event',
        '$filter',
        '$route',
        '$routeParams',
        '$modalInstance',
        '$modal',
        'item',
        'searchclient',
        '$location',
        '$log',
        'API_CONF',
        function ($scope, VisualizationByDataset, Visualization, Event, $filter, $route, $routeParams, $modalInstance, $modal, item, searchclient, $location, $log, API_CONF) {

            $scope.displaycontentMetricModal = function (idMetric) {
                var containerLink = document.getElementById("modal-edit-metric-button-" + idMetric);
                $(containerLink).parent().next().toggle(200);
            };

            $scope.okModalWindowDataset = function () {
            	
            	$scope.enableRevertButton();
            	$scope.copyDatasets($scope.ListMetricsFilterModal);
            	
            	$scope.copyIndividuals($scope.ModalIndividualDatasetCheckboxes_);
            	
            	$scope.rePlotGraph();
                $modalInstance.close();
            };
					
            $scope.cancelModalWindowDataset = function () {            	
                $modalInstance.dismiss('cancel');
            };

        }
    ])

	//Controller used in modal windows to link event
    .controller('ModalInstanceCtrl', [
        '$scope',
        'VisualizationByDataset',
        'Visualization',
        'Event',
        '$filter',
        '$route',
        '$routeParams',
        '$modalInstance',
        '$modal',
        'item',
        'searchclient',
        '$location',
        '$log',
        'API_CONF',
        function ($scope, VisualizationByDataset, Visualization, Event, $filter, $route, $routeParams, $modalInstance, $modal, item, searchclient, $location, $log, API_CONF) {

            $scope.idsEventsToPlot = [];
            $scope.showLoading = true;

            for (i in $scope.eventsToPlot) {
                $scope.idsEventsToPlot[$scope.eventsToPlot[i].id] = $scope.eventsToPlot[i].id;
            }

            $scope.historicalevent_color_palete = '#f7941e';

            $scope.metricslist = item.metricsArray;
            $scope.recomendationevents = [];
            //$scope.curPage = 0;
            $scope.curPage = 1;
            
            $scope.pageSize = 10;
            $scope.numberOfPages = function () {
                return Math.ceil($scope.recomendationevents.length / $scope.pageSize);
            };


            $scope.startDateToFilter = item.startDate;
            $scope.endDateToFilter = item.endDate;

            if (!$scope.startDateToFilter) {
                $scope.startDateToFilter = item.minDateToSearch;
            }

            if (!$scope.endDateToFilter) {
                $scope.endDateToFilter = item.maxDateToSearch;
            }
			
			$scope.iniStartDateToFilter = $scope.startDateToFilter;
			$scope.iniEndDateToFilter = $scope.endDateToFilter;
			
            $scope.paginationEvents = 1;
            $scope.filterEvents = "";
            $scope.paginationEvents = "";

            $scope.arrayHE = [];
            $scope.recomendationevents = [];
            for (var i = 0; i < $scope.metricslist.length; i++) {
                var metricId = $scope.metricslist[i]

                $scope.visualizationByMetricList = VisualizationByDataset.get({id: metricId}, function (visualizationByMetricList) {

                    for (i in visualizationByMetricList.results) {
                        var idVisu = visualizationByMetricList.results[i]['visualization'];
                        $scope.visualizationRec = Visualization.get({id: idVisu}, function (visualizationList) {

                            if (visualizationList.historical_events_in_visualization.length > 0) {

                                for (var i = 0; i < visualizationList.historical_events_in_visualization.length; i++) {

                                    if ($scope.arrayHE.indexOf(visualizationList.historical_events_in_visualization[i].historical_event_id) == -1) {
                                        var eventId = visualizationList.historical_events_in_visualization[i].historical_event_id;
                                        $scope.herec = Event.get({id: eventId}, function (herec) {

                                            var arrayDatos = []
                                            arrayDatos['_source'] = herec;

                                            if ($scope.arrayHE.indexOf(herec.id) == -1) {
                                                $scope.arrayHE[herec.id] = herec.id;
                                                $scope.recomendationevents.push(herec);
                                            }

                                        }, function (err) {
                                            throw {message: JSON.stringify(err.data)};
                                        });


                                    } else {
                                    	//element not found
                                    }
                                };
                            }
                        }, function (error) {
                            throw {message: JSON.stringify(error.data.message)};
                        });
                    }
                    $scope.showLoading = false;
                });
                $scope.showLoading = false;
            }


            $scope.recommendedEvents = function (arrayIndividuals, startDateToSearch, endDateToSearch) {
                $scope.pagToSearch = 1;
                $scope.itemsperpagesize = 1000;
                $scope.itemssearchfrom = 0;

                var sort = ["title.lower_case_sort"];

                query = {};

                query = {
                    "filtered": {
                        "filter": {
                            "terms": {
                                "geoLocation": item.arrayIndividuals
                            }
                        }
                    }
                };

                if (startDateToSearch || endDateToSearch) {
					/*
                    query.filtered['filter'] = {
                        "and": [
                            {
                                "range": {
                                    "startEventDate": {"gte": startDateToSearch,}
                                }
                            }, {
                                "range": {
                                    "endEventDate": {"lte": endDateToSearch,}
                                }
                            }
                        ]
                    };
					*/
                    query.filtered['filter'] = {
                        "bool": {
                        	"must_not" : [
                        	{ 
								"range": {"endEventDate":{"lte": startDateToSearch}}
							},
							{
								"range": {"startEventDate":{"gte": endDateToSearch}}
							}
                        	]                        	
                        } 
                    };

                }

                //Perform search through client and get a search Promise
                searchclient.search({
                    index: API_CONF.ELASTIC_INDEX_NAME,
                    type: 'event',
                    body: {
                        from: $scope.itemssearchfrom,
                        sort: sort,
                        query: query
                    }
                }).then(function (resp) {

                    for (var i = 0; i < resp.hits.hits.length; i++) {

                        if ($scope.arrayHE.indexOf(resp.hits.hits[i]._id) == -1) {
                            $scope.arrayHE[resp.hits.hits[i]._source.id] = resp.hits.hits[i]._source.id;
                            $scope.recomendationevents.push(resp.hits.hits[i]._source);
                        }
                    }

                }, function (err) {
                    console.trace(err.message);
                });


            };

            if (item.arrayIndividuals.length > 0) {
                $scope.recommendedEvents(item.arrayIndividuals, item.minDateToSearch, item.maxDateToSearch);
            }

			$scope.pageChangedHESearch = function (pagIn, textIn, text_startDateToFilter, text_endDateToFilter) {
				
				console.log(pagIn);
				$scope.findEventsByFilter(pagIn, textIn, text_startDateToFilter, text_endDateToFilter);	
			}
			
            $scope.findEventsByFilter = function (pagIn, textIn, text_startDateToFilter, text_endDateToFilter) {
				
                var endDateToSearch = "";
                var startDateToSearch = "";

                if (pagIn) {

                    if (pagIn == 'ini') {
                        $scope.pagToSearch = 1;
                    } else if (pagIn == 'next') {
                        $scope.pagToSearch = $scope.pagToSearch + 1;
                    } else if (pagIn == 'prev') {
                        $scope.pagToSearch = $scope.pagToSearch - 1;
                    } else if (!isNaN(pagIn)) {
                        $scope.pagToSearch = pagIn;
                    } else {
                        $scope.pagToSearch = 1;
                        pagToSearch = 1;
                    }

                    $scope.itemsperpagesize = 10;
                    $scope.itemssearchfrom = ($scope.pagToSearch - 1) * $scope.itemsperpagesize;

                } else {
                    pagToSearch = 1;
                    $scope.pagToSearch = 1;
                    $scope.itemssearchfrom = 0;
                }
                $scope.filterEvents = "";
                if (textIn) {
                    $scope.filterEvents = textIn;
                }


                if (text_startDateToFilter) {
                    $scope.startDateToFilter = text_startDateToFilter;
                    startDateToSearch = text_startDateToFilter;
                    startDateToSearch = $filter('date')(text_startDateToFilter, "yyyy-MM-dd");
                }
                if (text_endDateToFilter) {
                    $scope.text_endDateToFilter = text_endDateToFilter;
                    endDateToSearch = text_endDateToFilter;
                    endDateToSearch = $filter('date')(text_endDateToFilter, "yyyy-MM-dd");
                }

                if (!endDateToSearch) {
                    var d = new Date();
                    endDateToSearch = $filter('date')(d, "yyyy-MM-dd");
                }

                //Build Sort
                var sort = ["title.lower_case_sort"];

                //Build query
                var query = {
                    "filtered": {
                        "query": {
                            "match_all": {}
                        }
                    }
                };


                if (!startDateToSearch) {
                    startDateToSearch = '0000-01-01';
                }


                if ($scope.filterEvents) {
                    query = {};
                    query = {
                        "filtered": {
                            "query": {
                                "fuzzy_like_this": {
                                    "fields": ["title", "description"],
                                    "like_text": $scope.filterEvents
                                }
                            }
                        }
                    };
                }

                if (startDateToSearch || endDateToSearch) {

					query.filtered['filter'] = {};
					/*					
                    query.filtered['filter'] = {
                        "and": [
                            {
                                "range": {
                                    "startEventDate": {"gte": startDateToSearch,}
                                }
                            }, {
                                "range": {
                                    "endEventDate": {"lte": endDateToSearch,}
                                }
                            }
                        ]
                    };
					*/                   
                    query.filtered['filter'] = {
                        "bool": {
                        	"must_not" : [
                        	{ 
								"range": {"endEventDate":{"lte": startDateToSearch}}
							},
							{
								"range": {"startEventDate":{"gte": endDateToSearch}}
							}
                        	]                        	
                        } 
                    };

                }

                if ($scope.itemssearchfrom < 0) {
                    $scope.itemssearchfrom = 0;
                }

                //Perform search through client and get a search Promise
                searchclient.search({
                    index: API_CONF.ELASTIC_INDEX_NAME,
                    type: 'event',
                    body: {
                    	size: $scope.itemsperpagesize,
                        from: $scope.itemssearchfrom,
                        sort: sort,
                        query: query
                    }
                }).then(function (resp) {
                    $scope.searchResults = resp.hits.hits;
                    $scope.searchResultsCount = resp.hits.total;
                    $scope.totalItems = $scope.searchResultsCount;

                    $scope.events = resp;

                }, function (err) {
                    console.trace(err.message);
                });

            };


            $scope.findEventsByFilter('ini', "", $scope.startDateToFilter, $scope.endDateToFilter);

            $scope.item = item;

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };


        }
    ])
