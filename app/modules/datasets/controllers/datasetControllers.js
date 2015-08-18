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

                creationService.timeSeries = $scope.timeSeries;

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
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {

            var init = function () {
                $scope.resultTable = creationService.resultTable;
            };

            init();
    }])

    .controller('DatasetStep7Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        '$filter',
        'Dataset',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, $filter, Dataset) {

            var init = function () {
                $scope.dataset = creationService.dataset;
                $scope.spatial = {
                    input: creationService.dataset.spatial,
                    output: []
                };
                $scope.language = {
                    input: creationService.dataset.language,
                    output: []
                };
                $scope.policy_domains = {
                    input: creationService.dataset.policy_domains,
                    output: []
                };
                $scope.external_resource = {
                    input: creationService.dataset.external_resource,
                    output: []
                }
            };

            init();

            $scope.prevStep = function () {
                creationService.dataset.spatial = $scope.spatial.output;
                creationService.dataset.language = $scope.language.output;
                creationService.dataset.policy_domains = $scope.policy_domains.output;
                creationService.dataset.external_resource = $scope.external_resource.output;
                //creationService.dataset =   $scope.dataset;
            };

            var buildData = function () {
                var table = [];
                var individuals = creationService.individualSelection;

                var count_ind = 0;
                angular.forEach(individuals, function (i) {
                    var values = {};
                    for(var j=0; j < creationService.timeSeries.length; j++){
                        values[creationService.timeSeries[j]] = parseFloat(creationService.resultTable.items[count_ind][j+1]);
                    }
                    table.push({
                        row: count_ind+1,
                        individual: i,
                        values: values
                    });
                    count_ind++;
                });

                return {
                    table: table
                };
            };


            var saveFinish = function () {
                var payload = {};
                payload.time = {
                    resolution: creationService.timeResolution,
                    start: creationService.time.start,
                    end: creationService.time.end
                };
                payload.resource = {
                    url: creationService.dataset.resource.url,
                    issued: $filter('date')(creationService.dataset.resource.issued, 'yyyy-MM-dd'),
                    custom: creationService.dataset.resource.custom,
                    external_resource: $scope.external_resource.output[0]
                };
                payload.policy_domains =   $scope.policy_domains.output;
                payload.title = $scope.dataset.title;
                payload.acronym = $scope.dataset.acronym;
                payload.keywords = $scope.dataset.keywords;
                payload.license = $scope.dataset.license;
                payload.description = $scope.dataset.description;
                payload.spatial = $scope.spatial.output[0];
                payload.language_id = $scope.language.output[0];
                payload.indicator_id = creationService.indicator[0].id;
                payload.class_id = creationService.classPreSelection[0];
                payload.user_id = 1;
                payload.unit_id = 22;
                payload.data = buildData();
                $log.info(payload);
                save(payload);
            };

            var save = function (payload) {
                Dataset.save(payload, function(value, responseHeaders){
                        $log.info("Saved");
                    },
                    function(err) {
                        $log.info(err);
                    }
                );
            };


            $scope.saveObject = {
                saveFinish: saveFinish
            };

    }])

    .controller('DatasetDetailController', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        '$filter',
        'Dataset',
        'Individual',
        '$q',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, $filter, Dataset, Individual, $q) {

            $scope.showTable = false;
            $scope.moreMetadata = {
                isCollapsed: true
            };

            $scope.table = {
                settings: {
                    autoColumnSize: true,
                    contextMenu: false,
                    stretchH: 'all',
                    readOnly: true,
                    outsideClickDeselects: false,
                    afterInit: function() {
                        $scope.table.instance = this;
                    }
                },
                items: [],
                instance: null
            };

            // ToDo This should be part of a directive
            var getDatasetSuccess = function (dataset) {
                var table = dataset.data.table;
                var promises = [];

                // Resolve all Individuals first
                angular.forEach(table, function (row) {
                    promises.push(Individual.getById(row.individual).$promise);
                });

                // All Promises have to be resolved
                $q.all(promises).then(function (individuals) {

                    // Build the rows
                    for(var i=0; i<table.length; i++){
                        var row = [individuals[i].title];
                        angular.forEach(table[i].values, function (v) {
                            row.push(v);
                        });
                        $scope.table.items.push(row);
                    }

                    // Set the Column Headers
                    $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(
                        dataset.time.resolution,
                        dataset.time.start,
                        dataset.time.end);
                    $scope.table.settings.colHeaders = [' '].concat($scope.timeSeries);

                    // Show the table
                    $scope.showTable = true;
                });

            };

            var getDatasetError = function (error) {
                throw { message: JSON.stringify(error.data)};
            };

            $scope.dataset = Dataset.get({id: $routeParams.datasetId}, getDatasetSuccess, getDatasetError);


        }]);