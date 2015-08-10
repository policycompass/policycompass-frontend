/**
 * Created by fki on 8/5/15.
 */
/**
 * Module for all Datasets Controllers
 */

angular.module('pcApp.datasets.controllers.dataset', [
    'pcApp.datasets.services.dataset',
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
                        $scope.inputTable.instance.loadData($scope.inputTable.items);
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
                    $scope.inputTable.instance.loadData($scope.inputTable.items);
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
                $scope.inputTable.instance.loadData($scope.inputTable.items);
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
                //$log.info('sR '+ startRow + ' sC ' + startColumn + ' eR ' + endRow + ' eC ' +   endColumn);
                var result = [];
                if(startRow == endRow && startColumn == endColumn) {
                    result.push( $scope.inputTable.items[startRow][startColumn]);
                }
                else if(startRow == endRow) {
                    if(endColumn >= startColumn) {
                        result = $scope.inputTable.items[startRow].slice(startColumn, endColumn+1);
                    } else {
                        result = $scope.inputTable.items[startRow].slice(endColumn, startColumn+1);
                    }
                }
                else if(startColumn == endColumn){
                    var i;
                    if(startRow <= endRow) {
                        result = [];
                        for(i=startRow; i<=endRow; i++){
                            result.push( $scope.inputTable.items[i][startColumn]);
                        }
                    }
                    if(startRow > endRow) {
                        result = [];
                        for(i=endRow; i<=startRow; i++){
                            result.push( $scope.inputTable.items[i][startColumn]);
                        }
                    }
                }
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
                var selection = $scope.inputTable.instance.getSelected();
                if(selection != 'undefined' && selection[0]==selection[2] && selection[1]==selection[3]) {
                    $scope.time.start = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };
            $scope.pickEnd = function () {
                var selection = $scope.inputTable.instance.getSelected();
                if(selection != 'undefined' && selection[0]==selection[2] && selection[1]==selection[3]) {
                    $scope.time.end = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };

            $scope.nextStep = function () {
                creationService.timeResolution = $scope.timeResolution.output[0].id;
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
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams) {

    }])

    .controller('DatasetStep5Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams) {

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