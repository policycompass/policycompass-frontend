/*
 angular.module('pcApp.common.directives.common', [

 ])
 */
angular.module('pcApp.common.directives.search', [])


/***** How to use this directive
 Example:
 <div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="2" functionformetric="rePlotGraph()"></div>
 Where:
 class="selectorMetrics" -> Use the directive
 metrics-list="ListMetricsFilter" -> paramenter with the array of metrics selected
 example return value: [{"id":41,"title":"Unemployment in Germany 2002-2013","issued":"2014-11-18T06:55:39.597Z"}]
 number-Max-Metrics="50"  -> max numbers user can select, if its null is 1
 functionformetric="rePlotGraph()" -> functioin that will be executed when user add/delete a mertric from the list. If it's null nothing is execute
 *******///.directive('selectorMetrics', ['$log', 'SearchMetrics', function ($log, SearchMetrics) {
    .directive('selectorMetrics', [
        '$log', 'searchclient', 'API_CONF', function ($log, searchclient, API_CONF) {

            return {
                restrict: 'C',
                scope: {
                    metricsList: '=metricsList',
                    numberMaxMetrics: '@numberMaxMetrics',
                    functionformetric: "&functionformetric"
                },
                compile: function (element, attributes) {
                    return {
                        pre: function (scope, element, attributes, controller, transcludeFn) {

                        },
                        post: function (scope, element, attributes, controller, transcludeFn) {

                        }
                    }
                },
                controller: function ($scope, $element, $attrs, $location, dialogs) {

                    $scope.MetricSelectediId_ = [];
                    //to set the input metrics list as selected


                    $scope.$watchCollection('metricsList', function (metricsList) {

                        $scope.MetricSelectediId_ = [];
                        if (isNaN($scope.numberMaxMetrics)) {
                            $scope.numberMaxMetrics = 1;
                        }

                        if (!metricsList) {
                            $scope.metricsList = [];
                        }

                        for (var k in $scope.metricsList) {
                            $scope.MetricSelectediId_[$scope.metricsList[k].id] = $scope.metricsList[k].id;
                        }

                    });

                    /*
                     setTimeout(function () {

                     if (isNaN($scope.numberMaxMetrics))
                     {
                     $scope.numberMaxMetrics=1;
                     }

                     if (!$scope.metricsList)
                     {
                     $scope.metricsList = [];
                     }

                     for (var k in $scope.metricsList)
                     {
                     $scope.MetricSelectediId_[$scope.metricsList[k].id]=$scope.metricsList[k].id;
                     }

                     }, 1000);
                     */

                    $scope.searchtext = '';
                    $scope.itemsperpagesize = 10;
                    $scope.itemssearchfrom = 0;
                    $scope.pagToSearch = 1;

                    $scope.clickMetric = function (idMetric, title, issued) {

                        var addmetric = true;
                        if (idMetric > 0) {
                            addmetric = true;
                        } else {
                            addmetric = false;
                        }

                        if (!$scope.metricsList) {
                            $scope.metricsList = [];
                        }

                        for (var k = 0; k < $scope.metricsList.length; k++)
                            //for (var k in $scope.metricsList)
                        {
                            //console.log("id="+$scope.metricsList[k].id);
                            if ($scope.metricsList[k].id == idMetric) {
                                addmetric = false;
                                var dlg = dialogs.confirm("Are you sure?", "Do you want to remove '" + title + "' from the list of metrics?");
                                dlg.result.then(function (k) {
                                    //console.log(k);

                                    //console.log("idMetric="+idMetric);
                                    $scope.metricsList.splice(k, 1);
                                    $scope.MetricSelectediId_[idMetric] = '';
                                    $scope.functionformetric();

                                });

                            }
                        }

                        if (addmetric) {
                            var myObject = {
                                'id': idMetric,
                                'title': title,
                                'issued': issued
                            };
                            $scope.metricsList.push(myObject);
                            $scope.functionformetric();
                        }

                        for (var k in $scope.metricsList) {
                            $scope.MetricSelectediId_[$scope.metricsList[k].id] = $scope.metricsList[k].id;
                        }

                    };

                    $scope.findMetricsByFilter = function (pagIn) {

                        if (pagIn == 'next') {
                            $scope.pagToSearch = $scope.pagToSearch + 1;
                        } else if (pagIn == 'prev') {
                            $scope.pagToSearch = $scope.pagToSearch - 1;
                        } else {
                            $scope.pagToSearch = 1;
                        }

                        $scope.itemssearchfrom = ($scope.pagToSearch - 1) * $scope.itemsperpagesize;

                        /*
                         $scope.metricsFilter = SearchMetrics.query(
                         {
                         type: 'metric',
                         sort: 'title',
                         size: $scope.itemsperpagesize,
                         from: $scope.itemssearchfrom,
                         q: 'title:*'+$scope.searchtext+'*',
                         },
                         function(metricList) {
                         },
                         function(error) {
                         //throw { message: JSON.stringify(err.data)};
                         throw { message: JSON.stringify(error.data)};
                         });
                         */
                        //var sort =    ["title"];
                        //var sort =     [{"title" : {"order" : "asc"}}];
                        var sort = ["title.lower_case_sort"];
                        //var sort =     [{"id" : {"order" : "desc"}},"_score"];

                        //Build query
                        if ($scope.searchtext) {
                            var query = {
                                match: {
                                    _all: $scope.searchtext
                                }
                            };
                        } else {
                            var query = {
                                match_all: {}
                            }
                        }

                        //Perform search through client and get a search Promise
                        searchclient.search({
                            index: API_CONF.ELASTIC_INDEX_NAME,
                            type: 'metric',
                            body: {
                                size: $scope.itemsperpagesize,
                                from: $scope.itemssearchfrom,
                                sort: sort,
                                query: query
                            }
                        }).then(function (resp) {
                            //If search is successfull return results in searchResults objects
                            $scope.metricsFilter = resp;

                        }, function (err) {
                            console.trace(err.message);
                        });

                    };

                    $scope.findMetricsByFilter(1);
                },

                template: '<div ng-show="metricsList.length<numberMaxMetrics">' + '<label for="">Search metric by title</label> ' + '<div class="filterMetricsPagination" id="filterMetricsPaginationDirective">' + '<div class="button-group">' + '<button ng-show="metricsFilter.hits.total>1" ng-disabled="pagToSearch==1"  class="btn btn-warning" ng-click="findMetricsByFilter(\'prev\')">' + '<span class="glyphicon glyphicon-chevron-left"></span>  Previous' + '</button>' + '<button ng-show="metricsFilter.hits.total>1" ng-disabled="metricsFilter.hits.total<=pagToSearch*itemsperpagesize" class="btn btn-warning pull-right" ng-click="findMetricsByFilter(\'next\')">' + 'Next <span class="glyphicon glyphicon-chevron-right"></span>' + '</button>' + '</div></div>' + '<input placeholder="--all metrics--" ng-model="searchtext" ng-change="findMetricsByFilter(\'1\')" type="text" id="filterMetricDirective" >' + '<div class="filterMetricsPaginationHeader" id="filterMetricsPaginationHeaderDirective">' + '<div>' + '<label ng-show="metricsFilter.hits.total>1" for="">{{metricsFilter.hits.total}} metrics found</label>' + '<label ng-show="metricsFilter.hits.total==1" for="">{{metricsFilter.hits.totalt}} metric found</label>' + '<label ng-show="metricsFilter.hits.total==0" for="">no metrics found</label>' + '</div>' + '</div>' + '<div class="filterMetricsPaginationBody createvisualization" id="filterMetricsPaginationBodyDirective">' + '<ul class="metrics-list">' + '<li ng-class="{\'metrics-list active\':MetricSelectediId_[metric._source.id]>0,\'metrics-list\':MetricSelectediId_[metric.id]}" name="designer-metrics-num-{{metric.id}}" ng-repeat="metric in metricsFilter.hits.hits track by $index" ><a href="" x-ng-click="clickMetric(metric._source.id, metric._source.title, metric._source.issued);"  title="{{ !MetricSelectediId_[metric._source.id]>0 && \'Add \' || \'Remove \' }} \'{{metric._source.title}}\'">{{metric._source.title}} - {{ metric._source.issued | date:\'longDate\' }}</a></li>' + '</ul>' + //'<div class="filterMetricsPagination" id="filterMetricsPaginationDirective">' +
                    //	'<button ng-show="metricsFilter.hits.total>1" ng-disabled="pagToSearch==1"  class="btn btn-warning" ng-click="findMetricsByFilter(\'prev\')">' +
                    //		'<span class="glyphicon glyphicon-chevron-left"></span>  Previous' +
                    //	'</button>' +
                    //	'<button ng-show="metricsFilter.hits.total>1" ng-disabled="metricsFilter.hits.total<=pagToSearch*itemsperpagesize" class="btn btn-warning pull-right" ng-click="findMetricsByFilter(\'next\')">' +
                    //		'Next <span class="glyphicon glyphicon-chevron-right"></span>' +
                    //	'</button>' +
                    //'</div>' +
                '</div>' + '</div>' + '</div>' + '<div class="createvisualization" ng-show="metricsList.length>=numberMaxMetrics">' + '<ul class="metrics-list">' + '<li class="metrics-list active" ng-repeat="metric in metricsList track by $index" ><a href="" x-ng-click="clickMetric(metric.id, metric.title, metric.issued);" title="Delete \'{{metric.title}}\'">{{metric.title}} - {{ metric.issued | date:\'longDate\' }}</a></li>' + '</ul>' + '</div>' + '<div><hr></div>'

            };
        }
    ])

/***** How to use this directive
 Example:
 <div id="filterDatasets" class="selectorDatasets"
 datasets-list="ListDatasetsFilter" number-Max-Datasets="2" functionfordataset="rePlotGraph()"></div>
 Where:
 class="selectorDatasets" -> Use the directive
 datasets-list="ListDatasetsFilter" -> paramenter with the array of datasets selected
 example return value: [{"id":41,"title":"Unemployment in Germany 2002-2013","issued":"2014-11-18T06:55:39.597Z"}]
 number-Max-Datasets="50"  -> max numbers user can select, if its null is 1
 functionfordataset="rePlotGraph()" -> functioin that will be executed when user add/delete a dataset from the list. If it's null nothing is execute
 *******/
    .directive('selectorDatasets', [
        '$log', 'searchclient', 'API_CONF', function ($log, searchclient, API_CONF) {

            return {
                restrict: 'C',
                scope: {
                    datasetsList: '=datasetsList',
                    numberMaxDatasets: '@numberMaxDatasets',
                    functionfordataset: "&functionfordataset",
                    disableRow: '=disableRow',
                    indexdataset: "=indexdataset"
                },
                compile: function (element, attributes) {
                    return {
                        pre: function (scope, element, attributes, controller, transcludeFn) {

                        },
                        post: function (scope, element, attributes, controller, transcludeFn) {

                        }
                    }
                },
                controller: function ($scope, $element, $attrs, $location, dialogs) {

                    $scope.DatasetSelectediId_ = [];


                    $scope.arrayGranularitiesAvailable = [];

                    $scope.$watchCollection('disableRow', function (disableRow) {

                        $scope.viewAll = false;
                        $scope.arrayGranularitiesAvailable = [];
                        if (!disableRow) {
                            $scope.viewAll = true;
                            //$scope.arrayGranularitiesAvailable.push('year');
                        } else {
                            for (var k in disableRow) {

                                $scope.arrayGranularitiesAvailable.push(disableRow[k].value);
                            }

                        }
                    });

                    $scope.$watchCollection('datasetsList', function (datasetsList) {

                        $scope.DatasetSelectediId_ = [];

                        if (isNaN($scope.numberMaxDatasets)) {
                            $scope.numberMaxDatasets = 1;
                        }

                        if (!datasetsList) {
                            $scope.datasetsList = [];

                        }

                        for (var k in $scope.datasetsList) {
                            $scope.DatasetSelectediId_[$scope.datasetsList[k].id] = $scope.datasetsList[k].id;
                        }

                    });

                    $scope.searchtext = '';
                    $scope.itemsperpagesize = 10;
                    $scope.itemssearchfrom = 0;
                    $scope.pagToSearch = 1;

                    $scope.clickDataset = function (idDataset, title, issued) {
                        //console.log("idDataset="+idDataset);
                        var addDataset = true;
                        if (idDataset > 0) {
                            addDataset = true;
                        } else {
                            addDataset = false;
                        }

                        if (!$scope.datasetsList) {
                            $scope.datasetsList = [];
                        }

                        for (var k = 0; k < $scope.datasetsList.length; k++)
                            //for (var k in $scope.datasetsList)
                        {
//					console.log("k="+k+"---id="+$scope.datasetsList[k].id+"--idDataset="+idDataset);

                            if ($scope.datasetsList[k].id == idDataset) {
                                var kT = k;
                                addDataset = false;
                                var dlg = dialogs.confirm("Are you sure?", "Do you want to remove '" + title + "' from the list of datasets?");
                                dlg.result.then(function (answer) {
                                    //console.log($scope.datasetsList);
                                    //console.log("idDataset="+idDataset);
                                    $scope.indexdataset = kT;
                                    $scope.datasetsList.splice(kT, 1);
                                    $scope.DatasetSelectediId_[idDataset] = '';
                                    $scope.functionfordataset();
                                });

                            }
                        }

                        if (addDataset) {
                            var myObject = {
                                'id': idDataset,
                                'title': title,
                                'issued': issued
                            };
                            $scope.datasetsList.push(myObject);
                            $scope.functionfordataset();
                        }

                        for (var k in $scope.datasetsList) {
                            $scope.DatasetSelectediId_[$scope.datasetsList[k].id] = $scope.datasetsList[k].id;
                        }

                    };

                    $scope.findDatasetsByFilter = function (pagIn) {

                        if (pagIn == 'next') {
                            $scope.pagToSearch = $scope.pagToSearch + 1;
                        } else if (pagIn == 'prev') {
                            $scope.pagToSearch = $scope.pagToSearch - 1;
                        } else {
                            $scope.pagToSearch = 1;
                        }

                        $scope.itemssearchfrom = ($scope.pagToSearch - 1) * $scope.itemsperpagesize;

                        $scope.showerrormessage = false;
                        //var sort =    ["title"];
                        //var sort =     [{"title" : {"order" : "asc"}}];
                        var sort = ["title.lower_case_sort"];
                        //var sort =     [{"id" : {"order" : "desc"}},"_score"];

                        //Build query
                        if ($scope.searchtext) {
                            var query = {
                                match: {
                                    _all: $scope.searchtext
                                }
                            };
                        } else {
                            var query = {
                                match_all: {}
                            }
                        }

                        //Perform search through client and get a search Promise
                        searchclient.search({
                            index: API_CONF.ELASTIC_INDEX_NAME,
                            type: 'dataset', //type: 'metric',
                            body: {
                                size: $scope.itemsperpagesize,
                                from: $scope.itemssearchfrom,
                                sort: sort,
                                query: query
                            }
                        }).then(function (resp) {
                            //If search is successfull return results in searchResults objects
                            $scope.datasetsFilter = resp;


                        }, function (err) {
                            console.trace(err.message);
                            $scope.showerrormessage = true;
                        });

                    };

                    $scope.findDatasetsByFilter(1);
                },
/*
                template: '' + '<div ng-show="showerrormessage"><label for="">There is a problem in the search. No datasets found!!!</label></div>' + '<div ng-show="!showerrormessage">' + '<div ng-show="datasetsList.length<numberMaxDatasets">' + '<label for="">Search dataset by title</label> ' + '<div class="filterMetricsPagination" id="filterMetricsPaginationDirective">' + '<div class="button-group">' + '<button ng-show="datasetsFilter.hits.total>1" ng-disabled="pagToSearch==1"  class="btn" ng-click="findDatasetsByFilter(\'prev\')">' + '<span class="glyphicon glyphicon-chevron-left"></span>  Previous' + '</button>' + '<button ng-show="datasetsFilter.hits.total>1" ng-disabled="datasetsFilter.hits.total<=pagToSearch*itemsperpagesize" class="btn" ng-click="findDatasetsByFilter(\'next\')">' + 'Next <span class="glyphicon glyphicon-chevron-right"></span>' + '</button>' + '</div></div>' + '<input placeholder="--all datasets--" ng-model="searchtext" ng-change="findDatasetsByFilter(\'1\')" type="text" id="filterDatasetDirective" >' + '<div class="filterDatasetsPaginationHeader" id="filterDatasetsPaginationHeaderDirective">' + '<div>' + '<label ng-show="datasetsFilter.hits.total>1" for="">{{datasetsFilter.hits.total}} datasets found</label>' + '<label ng-show="datasetsFilter.hits.total==1" for="">{{datasetsFilter.hits.totalt}} dataset found</label>' + '<label ng-show="datasetsFilter.hits.total==0" for="">no datasets found</label>' + '</div>' + '</div>' +

                '<div class="filterDatasetPaginationBody createvisualization" id="filterDatasetsPaginationBodyDirective">' + '<ul class="datasets-list metrics-list ">' + '<li ng-class="{\'metrics-list dataset-list active\':DatasetSelectediId_[dataset._source.id]>0,\'metrics-list dataset-list\':DatasetSelectediId_[dataset.id]}" name="designer-dataset-num-{{dataset.id}}" ng-repeat="dataset in datasetsFilter.hits.hits track by $index" >' + //'<a href="" x-ng-click="clickDataset(dataset._source.id, dataset._source.title, dataset._source.issued);"  title="{{ !DatasetSelectediId_[dataset._source.id]>0 && \'Add \' || \'Delete \' }} \'{{dataset._source.title}}\'">--> TO DELETE <-- {{dataset._source.title}} - {{ dataset._source.issued | date:\'longDate\' }} --> TO DELETE <--</a></br>'+
                '<a ng-show="viewAll || arrayGranularitiesAvailable.indexOf(dataset._source.time.resolution)!=-1 || DatasetSelectediId_[dataset._source.id]>0" href="" x-ng-click="clickDataset(dataset._source.id, dataset._source.title, dataset._source.issued);"  title="{{ !DatasetSelectediId_[dataset._source.id]>0 && \'Add \' || \'Remove \' }} \'{{dataset._source.title}}\'">{{dataset._source.title}} - {{ dataset._source.issued | date:\'longDate\' }}</a>' + '<span ng-hide="viewAll || arrayGranularitiesAvailable.indexOf(dataset._source.time.resolution)!=-1  || DatasetSelectediId_[dataset._source.id]>0">{{dataset._source.title}} - {{ dataset._source.issued | date:\'longDate\' }}</span>' + '</li>' + '</ul>' + '</div>' + '</div>' + '</div>' + '<div class="createvisualization" ng-show="datasetsList.length>=numberMaxDatasets">' + '<ul class="datasets-list">' + '<li class="dataset-list active" ng-repeat="dataset in datasetsList track by $index" ><a href="" x-ng-click="clickDataset(dataset.id, dataset.title, dataset.issued);" title="Delete \'{{dataset.title}}\'">{{dataset.title}} - {{ dataset.issued | date:\'longDate\' }}</a></li>' + '</ul>' + '</div>' + '<div><hr></div>' + '</div>'
                */

                template: '' +
                '<div ng-show="showerrormessage"><label for="">There is a problem in the search. No datasets found!!!</label></div>' +
                '<div ng-show="!showerrormessage">' +
                    '<div>' +
                    	'<form name="searchDatasetsFormModal" role="form" novalidate>' +
	                        '<div class="row">' +
	                            '<div class="col-sm-4">' +
	                            	'<div class="form-group ng-scope">' +
	                                	'<label for="filterEvent">Search text</label>' +
	                                	'<p class="input-group">' +                                    		
	                                		'<input ng-keyup="$event.keyCode == 13 && findDatasetsByFilter(\'1\')" placeholder="--all datasets--" ng-model="searchtext" type="text" id="filterDatasetDirective" class="form-control ng-isolate-scope ng-pristine ng-valid-required ng-valid">' +                                    
	                                		'<span class="input-group-btn">' +
					                			'<a type="button" class="btn btn-default" ng-click="findDatasetsByFilter(\'1\')"><i class="glyphicon glyphicon-search"></i></a>' + 
											'</span>' +
										'</p>' +
					                '</div>' +
	                            '</div>'+
	                        '</div>' +
                        '</form>' +
                    '</div>' +
                    '<hr>' +
                    '<div>' +                    
                    	'<div>' + 
                    		'<label ng-show="datasetsFilter.hits.total>1" for="">{{datasetsFilter.hits.total}} datasets found</label>' + 
                    		'<label ng-show="datasetsFilter.hits.total==1" for="">{{datasetsFilter.hits.total}} dataset found</label>' + 
                    		'<label ng-show="datasetsFilter.hits.total==0" for="">no datasets found</label>' + 
                    	'</div>' +
                        '<div class="createvisualization ">' +
                            '<div class="filterMetricsPagination" id="filterMetricsPaginationDirective">' +
                                '<div class="button-group">' +
                                    '<button ng-show="datasetsFilter.hits.total>1" ng-disabled="pagToSearch==1" class="btn" ng-click="findDatasetsByFilter(\'prev\')">' +
                                        '<span class="glyphicon glyphicon-chevron-left"></span> Previous'+
                                    '</button>' +
                                    '<button ng-show="datasetsFilter.hits.total>1" ng-disabled="datasetsFilter.hits.total<=pagToSearch*itemsperpagesize" class="btn" ng-click="findDatasetsByFilter(\'next\')">' +
                                        'Next <span class="glyphicon glyphicon-chevron-right"></span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="row">' +
                        	'<ul class="datasets-list metrics-list ">' + 
                        		'<li ng-class="{\'metrics-list dataset-list active\':DatasetSelectediId_[dataset._source.id]>0,\'metrics-list dataset-list\':DatasetSelectediId_[dataset.id]}" name="designer-dataset-num-{{dataset.id}}" ng-repeat="dataset in datasetsFilter.hits.hits track by $index" >' + 
                					'<a ng-show="viewAll || arrayGranularitiesAvailable.indexOf(dataset._source.time.resolution)!=-1 || DatasetSelectediId_[dataset._source.id]>0" href="" x-ng-click="clickDataset(dataset._source.id, dataset._source.title, dataset._source.issued);"  title="{{ !DatasetSelectediId_[dataset._source.id]>0 && \'Add \' || \'Remove \' }} \'{{dataset._source.title}}\'">{{dataset._source.title}} - {{ dataset._source.issued | date:\'longDate\' }}</a>' + 
                					'<span ng-hide="viewAll || arrayGranularitiesAvailable.indexOf(dataset._source.time.resolution)!=-1  || DatasetSelectediId_[dataset._source.id]>0">{{dataset._source.title}} - {{ dataset._source.issued | date:\'longDate\' }}</span>' + 
                				'</li>' + 
                			'</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>'
               
            };
        }
    ])

    .directive('selectorIndicators', [
        '$log', 'searchclient', 'API_CONF', function ($log, searchclient, API_CONF) {
            return {
                restrict: 'C',
                scope: {
                    datasetsList: '=',
                    numberMaxDatasets: '@',
                    functionfordataset: "&"
                },
                controller: function ($scope, $element, $attrs, $location, dialogs) {
                    $scope.selection = [];

                    $scope.$watchCollection('datasetsList', function (datasetsList) {
                        $scope.selection = [];
                        if (isNaN($scope.numberMaxDatasets)) {
                            $scope.numberMaxDatasets = 1;
                        }
                        if (!datasetsList) {
                            $scope.datasetsList = [];
                        }
                        for (var k in $scope.datasetsList) {
                            $scope.selection[$scope.datasetsList[k].id] = $scope.datasetsList[k].id;
                        }
                    });

                    $scope.searchtext = '';
                    $scope.itemsperpagesize = 10;
                    $scope.itemssearchfrom = 0;
                    $scope.pagToSearch = 1;

                    $scope.clickDataset = function (idDataset, title, issued, unit_category) {
                        var addDataset = true;
                        if (idDataset > 0) {
                            addDataset = true;
                        } else {
                            addDataset = false;
                        }

                        if (!$scope.datasetsList) {
                            $scope.datasetsList = [];
                        }
                        var k;

                        for (k = 0; k < $scope.datasetsList.length; k++) {
                            if ($scope.datasetsList[k].id == idDataset) {
                                addDataset = false;
                                $scope.datasetsList.splice(k, 1);
                                $scope.selection[idDataset] = '';
                                $scope.functionfordataset();
                            }
                        }

                        if (addDataset && $scope.datasetsList.length < $scope.numberMaxDatasets) {
                            var myObject = {
                                'id': idDataset,
                                'title': title,
                                'issued': issued,
                                'unit_category': unit_category
                            };
                            $scope.datasetsList.push(myObject);
                            $scope.functionfordataset();
                        }

                        for (k in $scope.datasetsList) {
                            $scope.selection[$scope.datasetsList[k].id] = $scope.datasetsList[k].id;
                        }
                    };

                    $scope.findDatasetsByFilter = function (pagIn) {
                        if (pagIn == 'next') {
                            $scope.pagToSearch = $scope.pagToSearch + 1;
                        } else if (pagIn == 'prev') {
                            $scope.pagToSearch = $scope.pagToSearch - 1;
                        } else {
                            $scope.pagToSearch = 1;
                        }

                        $scope.itemssearchfrom = ($scope.pagToSearch - 1) * $scope.itemsperpagesize;
                        $scope.showerrormessage = false;
                        //var sort =    ["title"];
                        //var sort =     [{"title" : {"order" : "asc"}}];
                        var sort = [{"issued": {"order": "desc"}}];
                        //var sort =     [{"id" : {"order" : "desc"}},"_score"];

                        //Build query
                        if ($scope.searchtext) {
                            var query = {
                                match: {
                                    _all: $scope.searchtext
                                }
                            };
                        } else {
                            var query = {
                                match_all: {}
                            }
                        }

                        //Perform search through client and get a search Promise
                        searchclient.search({
                            index: API_CONF.ELASTIC_INDEX_NAME,
                            type: 'indicator', //type: 'metric',
                            body: {
                                size: $scope.itemsperpagesize,
                                from: $scope.itemssearchfrom,
                                sort: sort,
                                query: query
                            }
                        }).then(function (resp) {
                            //If search is successfull return results in searchResults objects
                            $scope.datasetsFilter = resp;

                        }, function (err) {
                            console.trace(err.message);
                            $scope.showerrormessage = true;
                        });

                    };
                    $scope.findDatasetsByFilter(1);
                },
                templateUrl: 'modules/common/partials/searchIndicator.html'
            };
        }
    ]);
