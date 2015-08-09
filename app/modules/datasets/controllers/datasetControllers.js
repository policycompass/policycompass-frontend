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

            $scope.inputTable = creationService.inputTable;
            creationService.classSelection = [];
            $scope.individualSelection = [];

            $scope.$watch('inputTable.instance', function (newValue) {
                if(newValue != null){
                    $scope.inputTable.instance.addHook('afterSelectionEnd', function (startRow, startColumn, endRow, endColumn) {
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
                    });
                }
            });


            $scope.selection = {
                input: [],
                output: creationService.classSelection
            };

            $scope.test = function () {
                $scope.selection.input = [5];
            };


            $log.info(creationService.step);

    }])

    .controller('DatasetStep3Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams) {

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