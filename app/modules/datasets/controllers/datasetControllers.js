/**
 * Created by fki on 8/5/15.
 */
/**
 * Module for all Datasets Controllers
 */

angular.module('pcApp.datasets.controllers.dataset', [
    'pcApp.datasets.services.dataset',
    'pcApp.references.services.reference',
    'dialogs.main',
    'ngProgress'
])


    .factory('DatasetsControllerHelper', ['dialogs', '$log', function (dialogs, $log) {
        return {
            /**
             * Base Controller for creating and editing a dataset.
             * Thos two operations share most of the functionality, because they are using the same view.
             * @param $scope
             */
            baseCreateEditController: function ($scope) {

            },
            generateTimeSeries: function (resolution, start, end) {
                var allowedResolutions = ['day', 'month', 'year', 'quarter'];
                if (!_.contains(allowedResolutions, resolution)) {
                    return null
                }

                var result = [];
                var quarterToMonth = {
                    'Q1': '01',
                    'Q2': '04',
                    'Q3': '07',
                    'Q4': '10'
                };
                var monthToQuarter = _.invert(quarterToMonth);

                var quarterFormatToDate = function (dateString) {
                    var dateArray = dateString.split('-');
                    return dateArray[0] + '-' + quarterToMonth[dateArray[1]]
                };

                var getDateExtract = function (date, type) {
                    var year = date.getFullYear();
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    var day = ("0" + (date.getDate())).slice(-2);
                    if (type == 'month') {
                        return year + '-' + month;
                    } else if (type == 'day') {
                        return year + '-' + month + '-' + day;
                    } else if (type == 'year') {
                        return year;
                    } else if (type == 'quarter') {
                        return year + '-' + monthToQuarter[month];
                    }
                };

                var getNextDate = function (date, type) {
                    if (type == 'month') {
                        return new Date(date.setMonth(date.getMonth() + 1))
                    } else if (type == 'day') {
                        return new Date(date.setDate(date.getDate() + 1))
                    } else if (type == 'year') {
                        return new Date(date.setFullYear(date.getFullYear() + 1))
                    } else if (type == 'quarter') {
                        return new Date(date.setMonth(date.getMonth() + 3))
                    }
                };

                if (resolution == 'quarter') {
                    end = quarterFormatToDate(end);
                    start = quarterFormatToDate(start);
                }

                var end = new Date(Date.parse(end));
                var start = new Date(Date.parse(start));

                do {
                    result.push(getDateExtract(new Date(start), resolution));
                    start = getNextDate(start, resolution)
                } while (start.getTime() <= end.getTime());

                return result;
            },
            getTableSelection: function (startRow, startColumn, endRow, endColumn, items) {
                //$log.info('sR '+ startRow + ' sC ' + startColumn + ' eR ' + endRow + ' eC ' +   endColumn);
                var result = [];
                if(startRow == endRow && startColumn == endColumn) {
                    result.push(items[startRow][startColumn]);
                }
                else if(startRow == endRow) {
                    if(endColumn >= startColumn) {
                        result = items[startRow].slice(startColumn, endColumn+1);
                    } else {
                        result = items[startRow].slice(endColumn, startColumn+1);
                    }
                }
                else if(startColumn == endColumn){
                    var i;
                    if(startRow <= endRow) {
                        result = [];
                        for(i=startRow; i<=endRow; i++){
                            result.push(items[i][startColumn]);
                        }
                    }
                    if(startRow > endRow) {
                        result = [];
                        for(i=endRow; i<=startRow; i++){
                            result.push(items[i][startColumn]);
                        }
                    }
                }
                return result;
            }
            
            
        };
    }])

    .controller('DatasetStep1Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {

            $scope.inputTable = creationService.inputTable;

            $scope.inputTable.settings.afterInit = function() {
                $scope.inputInstance = this;
            };


            $log.info($scope.inputTable);
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
                        $scope.inputTable.items = response['result'];
                        $scope.dropzone.isCollapsed = true;
                        $scope.inputInstance.loadData($scope.inputTable.items);
                    }
                },
                isCollapsed: true
            };


            $scope.clearGrid = function () {
                var dlg = dialogs.confirm(
                    "Are you sure?",
                    "Do you really want to clear the Dataset Content?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    $scope.inputTable.items = [[]];
                    $scope.inputInstance.loadData($scope.inputTable.items);
                });
            };

            $scope.rotateData = function () {
                var data =  $scope.inputTable.items;
                var newData = [[]];
                _.each(data, function(element, index, list){
                    var colum_index = index;
                    _.each(element, function(element, index, list){
                        if(element != null){
                            if(colum_index == 0) {
                                newData[index] = [element];
                            } else {
                                newData[index].push(element);
                            }
                        }
                    });
                });
                $scope.inputTable.items = newData;
                $scope.inputInstance.loadData($scope.inputTable.items);
            };
    }])

    .controller('DatasetStep2Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {

            var getSelection = function (startRow, startColumn, endRow, endColumn) {
                var result = DatasetsControllerHelper.getTableSelection(
                    startRow,
                    startColumn,
                    endRow,
                    endColumn,
                    $scope.inputTable.items);

                angular.forEach(result, function (r) {
                    if((!_.contains($scope.individualSelection, r)) && r != null){
                        $log.info(r);
                        $scope.individualSelection.push(r);
                        $scope.$apply();
                    }
                });
            };

            var init = function () {
                $scope.inputTable = creationService.inputTable;
                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;

                if(creationService.individualSelection) {
                    $scope.individualSelection = creationService.individualSelection;
                } else {
                    $scope.individualSelection = [];
                }

                if(creationService.extraMetadata) {
                    $scope.extraMetadata = [];
                    angular.forEach(creationService.extraMetadata, function (em) {
                        $scope.extraMetadata.push({
                            classInput: em.classOutput,
                            classOutput: [],
                            indInput: em.indOutput,
                            indOutput: []
                        });
                    })
                } else {
                    $scope.extraMetadata = [{
                        classInput: [],
                        classOutput: [],
                        indInput: [],
                        indOutput: []
                    }];
                }
                creationService.classSelection = [];
                $scope.selection = {
                    input: creationService.classPreSelection,
                    output: creationService.classSelection
                };
            };

            init();

            $scope.removeIndividual = function (i) {
                $scope.individualSelection = _.without($scope.individualSelection, i);
            };

            $scope.addExtraMetadata = function () {
                $scope.extraMetadata.push({
                    classInput: [],
                    classOutput: [],
                    indInput: [],
                    indOutput: []
                });
            };

            $scope.nextStep = function () {
                creationService.classPreSelection = $scope.selection.output;
                creationService.extraMetadata = $scope.extraMetadata;
                creationService.individualSelection = $scope.individualSelection;
                $log.info(creationService);
            };

    }])

    .controller('DatasetStep3Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {

            var init = function () {
                $scope.inputTable = creationService.inputTable;
                $scope.inputTable.settings.contextMenu = false;

                $scope.inputTable.settings.afterInit = function() {
                    $scope.inputInstance = this;
                };


                $scope.timeResolution = {
                    input: [
                        {name: 'Day', id: 'day', placeholder: '2001-01-01'},
                        {name: 'Month', id: 'month', placeholder: '2001-01'},
                        {name: 'Year', id: 'year', placeholder: '2001'},
                        {name: 'Quarter', id: 'quarter', placeholder: '2001-Q1'}
                    ],
                    output: []
                };

                if(creationService.timeResolution) {
                    angular.forEach($scope.timeResolution.input, function (t) {
                        if(t.id == creationService.timeResolution) {
                            t.ticked = true;
                        }
                    });
                }

                $scope.time = {
                    start: creationService.time.start,
                    end: creationService.time.end
                };

            };
            init();
            $scope.pickStart = function () {
                var selection = $scope.inputInstance.getSelected();
                if(selection != 'undefined' && selection[0]==selection[2] && selection[1]==selection[3]) {
                    $scope.time.start = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };
            $scope.pickEnd = function () {
                var selection = $scope.inputInstance.getSelected();
                if(selection != 'undefined' && selection[0]==selection[2] && selection[1]==selection[3]) {
                    $scope.time.end = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };

            $scope.nextStep = function () {
                if($scope.timeResolution.output[0]) {
                    creationService.timeResolution = $scope.timeResolution.output[0].id;
                }
                creationService.time.start = $scope.time.start;
                creationService.time.end = $scope.time.end;
            };
    }])

    .controller('DatasetStep4Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        'Class',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, Class) {

            var getSelection = function (startRow, startColumn, endRow, endColumn) {
                var result = DatasetsControllerHelper.getTableSelection(
                    startRow,
                    startColumn,
                    endRow,
                    endColumn,
                    $scope.inputTable.items);


                var row = $scope.resultTable.items[$scope.selectionStep-1];
                //row = result;
                var i, start;
                for(i=1; i<row.length; i++){
                    if(row[i] == null || row[i] == '') {
                        start = i;
                        break;
                    }
                }

                for(i=start; i<row.length; i++){
                    row[i] = result[i-start];
                }

                $scope.resultTable.items[$scope.selectionStep-1] = row;
                $scope.$apply();
            };


            var init = function () {
                $scope.inputTable = creationService.inputTable;
                $scope.resultTable = creationService.resultTable;

                $scope.resultTable.settings.afterInit = function() {
                    $scope.resultInstance = this;
                };

                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;
                $scope.individualSelection = creationService.individualSelection;
                $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(
                    creationService.timeResolution,
                    creationService.time.start,
                    creationService.time.end);

                $scope.resultTable.settings.minCols = $scope.timeSeries.length + 1;
                //$scope.resultTable.settings.minRows = creationService.individualSelection.length + 1;
                $scope.resultTable.settings.colHeaders = [' '].concat($scope.timeSeries);

                $scope.selectionStep = 1;
                if($scope.resultTable.items.length == 0) {
                    angular.forEach(creationService.individualSelection, function (i) {
                        $scope.resultTable.items.push([i]);
                    });

                }
            };

            init();

            $scope.next = function () {
                $scope.selectionStep++;
            };

            $scope.prev = function () {
                $scope.selectionStep--;
            };

            $scope.reset = function () {
                $scope.resultTable.items = [];
                angular.forEach(creationService.individualSelection, function (i) {
                    $scope.resultTable.items.push([i]);
                });
                $scope.resultInstance.loadData($scope.resultTable.items);
            };
    }])

    .controller('DatasetStep5Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {

            var init = function () {
                $scope.ListDatasetsFilter = creationService.indicator;
            };

            init();

            $scope.nextStep = function () {
                creationService.indicator = $scope.ListDatasetsFilter;
            };

    }])

    .controller('DatasetStep6Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams) {

    }])

    .controller('DatasetStep7Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams) {

    }]);