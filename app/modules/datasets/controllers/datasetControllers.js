/**
 * Created by fki on 8/5/15.
 */
/**
 * Module for all Datasets Controllers
 */

angular.module('pcApp.datasets.controllers.dataset', [
    'pcApp.datasets.services.dataset',
    'pcApp.references.services.reference',
    'pcApp.indicators.services.indicator',
    'pcApp.config',
    'dialogs.main',
    'ngProgress'
])


    .factory('DatasetsControllerHelper', [
        'dialogs', '$log', function (dialogs, $log) {
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
                    if (startRow == endRow && startColumn == endColumn) {
                        result.push(items[startRow][startColumn]);
                    } else if (startRow == endRow) {
                        if (endColumn >= startColumn) {
                            result = items[startRow].slice(startColumn, endColumn + 1);
                        } else {
                            result = items[startRow].slice(endColumn, startColumn + 1);
                        }
                    } else if (startColumn == endColumn) {
                        var i;
                        if (startRow <= endRow) {
                            result = [];
                            for (i = startRow; i <= endRow; i++) {
                                result.push(items[i][startColumn]);
                            }
                        }
                        if (startRow > endRow) {
                            result = [];
                            for (i = endRow; i <= startRow; i++) {
                                result.push(items[i][startColumn]);
                            }
                        }
                    }
                    return result;
                }


            };
        }
    ])


    .controller('DatasetEditController', [
        '$scope',
        '$location',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        '$q',
        'Dataset',
        'Individual',
        'Indicator',
        'Auth',
        'API_CONF',
        function ($scope,
                  $location,
                  DatasetsControllerHelper,
                  $log,
                  dialogs,
                  ngProgress,
                  $routeParams,
                  creationService,
                  $q,
                  Dataset,
                  Individual,
                  Indicator,
                  Auth,
                  API_CONF
        ) {

            var init = function () {
                $scope.custom = false;
                $scope.userState = Auth.state;
            };

            init();

            $scope.toogleResource = function () {
                $scope.custom = !$scope.custom;
            };

            $scope.userState = Auth.state;

            $scope.showTable = false;
            $scope.moreMetadata = {
                isCollapsed: true
            };

            $scope.table = {
                settings: {
                    autoColumnSize: true,
                    contextMenu: false,
                    stretchH: 'all',
                    readOnly: false,
                    outsideClickDeselects: false,
                    afterInit: function () {
                        $scope.table.instance = this;
                    }
                },
                items: [],
                instance: null
            };

            // ToDo This should be part of a directive
            var getDatasetSuccess = function (dataset) {
                var getHeight = function (rows) {
                    var default_height = 500;
                    var row_height = 24;
                    if (rows > 0) {
                        var height = row_height * rows + row_height + 5;
                        if (height > default_height) {
                            return default_height;
                        } else {
                            return height;
                        }
                    } else {
                        return row_height * 2 + 15;
                    }
                };


                var table = dataset.data.table;
                var promises = [];

                // Resolve all Individuals first
                angular.forEach(table, function (row) {
                    promises.push(Individual.getById(row.individual).$promise);
                });

                // All Promises have to be resolved
                $q.all(promises).then(function (individuals) {

                    // Build the rows
                    for (var i = 0; i < table.length; i++) {
                        var row = [individuals[i].title];
                        angular.forEach(table[i].values, function (v) {
                            row.push(v);
                        });
                        $scope.table.items.push(row);
                    }

                    // Set the Column Headers
                    $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(dataset.time.resolution, dataset.time.start, dataset.time.end);
                    $scope.table.settings.colHeaders = [' '].concat($scope.timeSeries);

                    $scope.table.settings.height = getHeight(table.length);
                    // Show the table
                    $scope.showTable = true;
                    $scope.indicator = Indicator.get({id: dataset.indicator_id});
                });

                if(dataset.resource['custom']) {
                    $scope.custom = true;
                }

            };

            var getDatasetError = function (error) {
                $location.path('/datasets');
            };

            $scope.dataset = Dataset.get({id: $routeParams.datasetId}, getDatasetSuccess, getDatasetError);

            var preSave = function () {
                delete $scope.dataset['data']['individuals'];

                var table = [];
                var row = 0;
                angular.forEach($scope.table.items, function (i) {
                    var values = {};
                    for (var j = 0; j < $scope.timeSeries.length; j++) {
                        var cell_value = i[j+1];
                        $log.info(cell_value);
                        if (cell_value == "-") {
                            cell_value = ""
                        }
                        values[$scope.timeSeries[j]] = parseFloat(cell_value);
                    }
                    angular.forEach($scope.dataset['data']['table'], function (j) {
                        if(j['row'] == row + 1) {
                            j['values'] = values
                        }
                    });
                    row++;
                });
            };

            $scope.save = function () {
                preSave();
                Dataset.update($scope.dataset, function (value, responseHeaders) {
                    $location.path('/datasets/' + value.id);
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            };

        }
    ])

    .controller('DatasetStep1Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        'API_CONF',
        '$http',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, API_CONF, $http) {
            $scope.inputTable = creationService.data.inputTable;

            $scope.inputTable.settings.readOnly = false;
            $scope.inputTable.settings.afterInit = function () {
                $scope.inputInstance = this;
            };

            $scope.dropzone = {
                config: {
                    clickable: true,
                    url: API_CONF.DATASETS_MANAGER_URL + '/converter',
                    acceptedFiles: '.csv,.xls,.xlsx'
                },
                dropzone: {},
                handlers: {
                    // Callback for successful upload
                    success: function (file, response) {
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

            $scope.ckanImport = {
                isVisible: false,
                toggleVisibility: function () {
                    $scope.ckanImport.isVisible = !$scope.ckanImport.isVisible;
                    if ($scope.ckanImport.isVisible)
                        $scope.dropzone.isCollapsed = true;

                },
                loadData: function (dataset, resource, data) {
                    $scope.ckanImport.isVisible = false;
                    $scope.inputTable.items = data.result;
                    $scope.inputInstance.loadData(data.result);

                    creationService.data.dataset.title = (dataset.title && dataset.title.length > 0) ? dataset.title : dataset.notes;
                    creationService.data.dataset.description = (resource.name && resource.name.length > 0) ? resource.name : resource.description;
                }
            };


            $scope.eurostatImport = {
                isVisible: false,
                toggleVisibility: function () {
                    $scope.eurostatImport.isVisible = !$scope.eurostatImport.isVisible;
                    if ($scope.eurostatImport.isVisible)
                        $scope.dropzone.isCollapsed = true;

                },
                loadData: function (dataset, resource, data) {
                    $scope.inputTable.items = data.result;
                    $scope.inputInstance.loadData(data.result);
                }
            };


            $scope.clearGrid = function () {
                var dlg = dialogs.confirm("Are you sure?", "Do you really want to clear the Dataset Content?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    $scope.inputTable.items = [[]];
                    $scope.inputInstance.loadData($scope.inputTable.items);
                });
            };

            $scope.rotateData = function () {
                var data = $scope.inputTable.items;

                var maxCol = 0;
                var maxRow = 0;

                _.each(data, function (element, index) {
                    var rowFilled = false;
                    _.each(element, function (element, index) {
                        if(element !=  null) {
                            rowFilled = true;
                            if(index > maxCol) {
                                maxCol = index;
                            }
                        }
                    });
                    if(rowFilled) {
                        maxRow = index;
                    }
                });

                var newData = [];
                var i,j;
                for (i = 0; i <= maxRow; i++) {
                    for (j = 0; j <= maxCol; j++) {
                        if(i == 0){
                            newData[j] = [data[i][j]]
                        }else {
                            newData[j].push(data[i][j]);
                        }
                    }
                }

                $scope.inputTable.items = newData;
                $scope.inputInstance.loadData($scope.inputTable.items);
            };

            $scope.nextStep = function () {
                return true;
            }
        }
    ])

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
                var result = DatasetsControllerHelper.getTableSelection(startRow, startColumn, endRow, endColumn, $scope.inputTable.items);

                angular.forEach(result, function (r) {
                    if ((!_.contains($scope.individualSelection, r)) && r != null && r != '') {
                        $scope.individualSelection.push(r);
                        $scope.$apply();
                    }
                });
            };

            var init = function () {
                $scope.inputTable = creationService.data.inputTable;
                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;
                $scope.inputTable.settings.readOnly = true;

                if (creationService.data.individualSelection) {
                    $scope.individualSelection = creationService.data.individualSelection;
                } else {
                    $scope.individualSelection = [];
                }
                if (creationService.data.extraMetadata) {
                    $scope.extraMetadata = [];
                    angular.forEach(creationService.data.extraMetadata, function (em) {

                        $scope.extraMetadata.push({
                            classInput: angular.copy(em.classOutput),
                            classOutput: [],
                            indInput: angular.copy(em.indOutput),
                            indOutput: [],
                            sub: true,
                            class_id: em.classOutput[0]
                        });
                    })
                } else {
                    $scope.extraMetadata = [
                        {
                            classInput: [],
                            classOutput: [],
                            indInput: [],
                            indOutput: [],
                            sub: false,
                            class_id: null
                        }
                    ];
                }
                creationService.data.classSelection = [];
                $scope.selection = {
                    input: creationService.data.classPreSelection,
                    output: creationService.data.classSelection
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
                    indOutput: [],
                    sub: false,
                    class_id: null
                });
            };

            $scope.removeExtraMetadata = function (em) {
                $scope.extraMetadata = _.without($scope.extraMetadata, em)


            };

            $scope.$watch('extraMetadata', function (newValue) {

                angular.forEach($scope.extraMetadata, function (em) {
                    if (em.classOutput[0]) {
                        em.sub = true;
                        em.class_id = em.classOutput[0];
                    } else {
                        em.sub = false;
                        em.indOutput = [];
                    }

                });

            }, true);

            $scope.clearAll = function () {
                $scope.individualSelection = [];
            };

            $scope.nextStep = function () {
                if ($scope.selection.output.length == 0) {
                    dialogs.error('Validation Error', 'Please provide a Data Dimension Type.');
                    return false;
                }
                if ($scope.individualSelection.length == 0) {
                    dialogs.error('Validation Error', 'Please choose at least one Data Dimension.');
                    return false;
                }

                creationService.data.classPreSelection = $scope.selection.output;
                creationService.data.extraMetadata = $scope.extraMetadata;
                creationService.data.individualSelection = $scope.individualSelection;
            };

        }
    ])

    .controller('DatasetStep3Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService) {


            var getSelection = function (startRow, startColumn, endRow, endColumn) {
                var result = DatasetsControllerHelper.getTableSelection(startRow, startColumn, endRow, endColumn, $scope.inputTable.items);

                $scope.time.start = result[0];
                $scope.time.end = result[result.length - 1];
                $scope.$apply();
            };


            var init = function () {
                $scope.inputTable = creationService.data.inputTable;
                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;
                $scope.inputTable.settings.afterInit = function () {
                    $scope.inputInstance = this;
                };

                $scope.timeResolution = {
                    input: [
                        {
                            name: 'Day',
                            id: 'day',
                            placeholder: '2001-01-01'
                        }, {
                            name: 'Month',
                            id: 'month',
                            placeholder: '2001-01'
                        }, {
                            name: 'Year',
                            id: 'year',
                            placeholder: '2001'
                        }, {
                            name: 'Quarter',
                            id: 'quarter',
                            placeholder: '2001-Q1'
                        }
                    ],
                    output: []
                };

                if (creationService.data.timeResolution) {
                    angular.forEach($scope.timeResolution.input, function (t) {
                        if (t.id == creationService.data.timeResolution) {
                            t.ticked = true;
                        }
                    });
                }

                $scope.time = {
                    start: creationService.data.time.start,
                    end: creationService.data.time.end
                };

            };
            init();
            $scope.pickStart = function () {
                var selection = $scope.inputInstance.getSelected();
                if (selection != 'undefined' && selection[0] == selection[2] && selection[1] == selection[3]) {
                    $scope.time.start = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };
            $scope.pickEnd = function () {
                var selection = $scope.inputInstance.getSelected();
                if (selection != 'undefined' && selection[0] == selection[2] && selection[1] == selection[3]) {
                    $scope.time.end = $scope.inputTable.items[selection[0]][selection[1]];
                }
            };

            $scope.nextStep = function () {

                if ($scope.timeResolution.output[0] == null) {
                    dialogs.error('Validation Error', 'Please provide a Time Resolution.');
                    return false;
                }
                if ($scope.time.start == null || $scope.time.start == '') {
                    dialogs.error('Validation Error', 'Please provide a Start Date.');
                    return false;
                }

                if ($scope.time.end == null || $scope.time.end == '') {
                    dialogs.error('Validation Error', 'Please provide an End Date.');
                    return false;
                }

                if ($scope.timeResolution.output[0]) {
                    creationService.data.timeResolution = $scope.timeResolution.output[0].id;
                }
                creationService.data.time.start = $scope.time.start;
                creationService.data.time.end = $scope.time.end;
            };
        }
    ])

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

                var i, j;
                if ($scope.mode == 'row') {
                    var result = DatasetsControllerHelper.getTableSelection(startRow, startColumn, endRow, endColumn, $scope.inputTable.items);


                    var row = $scope.resultTable.items[$scope.selectionStep - 1];
                    //row = result;
                    var start;
                    for (i = 1; i < row.length; i++) {
                        if (row[i] == null || row[i] == '') {
                            start = i;
                            break;
                        }
                    }

                    var nextRow = false;
                    for (i = start; i < row.length; i++) {
                        if (!result[i - start]) {
                            break;
                        }
                        row[i] = result[i - start];
                        if (i == row.length - 1) {
                            nextRow = true;
                        }
                    }

                    $scope.resultTable.items[$scope.selectionStep - 1] = row;
                    if (nextRow) {
                        $scope.next();
                    }
                    $scope.$apply();
                }

                if ($scope.mode == 'all') {

                    for (i = startRow; i <= endRow; i++) {
                        if (typeof $scope.resultTable.items[i - startRow] == 'undefined') {
                            break;
                        }
                        for (j = startColumn; j <= endColumn; j++) {
                            //$log.info($scope.resultTable.items[i-startRow][j-startColumn+1]);
                            if (typeof $scope.resultTable.items[i - startRow][j - startColumn + 1] == 'undefined') {
                                break;
                            }
                            $scope.resultTable.items[i - startRow][j - startColumn + 1] = $scope.inputTable.items[i][j]
                        }


                    }

                    $scope.$apply();
                }

            };

            var init = function () {
                $scope.mode = 'row';
                $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(creationService.data.timeResolution, creationService.data.time.start, creationService.data.time.end);

                $scope.timeSeriesLength = $scope.timeSeries.length;
                creationService.data.timeSeries = $scope.timeSeries;


                $scope.inputTable = creationService.data.inputTable;
                $scope.resultTable = creationService.data.resultTable;
                $scope.resultTable.settings.afterInit = function () {
                    $scope.resultInstance = this;
                    $scope.resultInstance.selectCell(0, 0, 0, $scope.timeSeriesLength);
                };

                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;


                $scope.individualSelection = creationService.data.individualSelection;

                $scope.resultTable.settings.minCols = $scope.timeSeries.length + 1;
                //$scope.resultTable.settings.minRows = creationService.data.individualSelection.length + 1;
                $scope.resultTable.settings.colHeaders = [' '].concat($scope.timeSeries);

                $scope.selectionStep = 1;
                $scope.lastStep = $scope.individualSelection.length;
                if ($scope.resultTable.items.length == 0) {
                    angular.forEach(creationService.data.individualSelection, function (i) {
                        $scope.resultTable.items.push([i]);
                    });
                }

                if ($scope.resultTable.items[0].length > ($scope.timeSeries.length + 1)) {
                    $scope.resultTable.items = [];
                    angular.forEach(creationService.data.individualSelection, function (i) {
                        $scope.resultTable.items.push([i]);
                    });
                }
            };

            init();

            $scope.next = function () {
                $scope.resultInstance.selectCell($scope.selectionStep, 0, $scope.selectionStep, $scope.timeSeriesLength);
                $scope.selectionStep++;

            };

            $scope.prev = function () {
                $scope.selectionStep--;
                $scope.resultInstance.selectCell($scope.selectionStep - 1, 0, $scope.selectionStep - 1, $scope.timeSeriesLength);

            };

            $scope.reset = function () {
                $scope.resultTable.items = [];
                angular.forEach(creationService.data.individualSelection, function (i) {
                    $scope.resultTable.items.push([i]);
                });
                $scope.resultInstance.loadData($scope.resultTable.items);
                $scope.selectionStep = 1;
                $scope.resultInstance.selectCell($scope.selectionStep - 1, 0, $scope.selectionStep - 1, $scope.timeSeriesLength);
            };

            $scope.resetRow = function () {
                for (var i = 1; i < $scope.timeSeriesLength + 1; i++) {
                    $scope.resultTable.items[$scope.selectionStep - 1][i] = '';
                }
            };

            $scope.setNull = function () {
                var row = $scope.resultTable.items[$scope.selectionStep - 1];
                var start;
                for (var i = 1; i < row.length; i++) {
                    if (row[i] == null || row[i] == '') {
                        start = i;
                        break;
                    }
                }
                row[start] = "-";
                if (i == row.length - 1) {
                    $scope.next();
                }
            };

            $scope.toggleMode = function () {
                if ($scope.mode == 'row') {
                    $scope.mode = 'all';
                    $scope.resultInstance.selectCell(0, 0, $scope.individualSelection.length - 1, $scope.timeSeriesLength);

                } else {
                    $scope.mode = 'row';
                    $scope.resultInstance.selectCell($scope.selectionStep - 1, 0, $scope.selectionStep - 1, $scope.timeSeriesLength);
                }
            }

        }
    ])

    .controller('DatasetStep5Controller', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        'creationService',
        '$location',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, $location) {

            var init = function () {
                $scope.unitSelector = false;
                $scope.ListDatasetsFilter = creationService.data.indicator;
                $scope.unit = {
                    input: creationService.data.dataset.unit,
                    output: []
                };
                if ($scope.ListDatasetsFilter.length > 0) {
                    $scope.unitSelector = true;
                }
            };

            init();

            $scope.nextStep = function () {
                if ($scope.ListDatasetsFilter.length == 0) {
                    dialogs.error('Validation Error', 'Please provide an Indicator.');
                    return false;
                }

                if ($scope.unit.output.length == 0) {
                    dialogs.error('Validation Error', 'Please provide an Unit.');
                    return false;
                }

                creationService.data.indicator = $scope.ListDatasetsFilter;
                creationService.data.dataset.unit = $scope.unit.output;
            };

            $scope.indicatorSelected = function () {
                if ($scope.ListDatasetsFilter.length > 0) {
                    $scope.unitSelector = true;
                } else {
                    $scope.unitSelector = false;
                }
            };

        }
    ])

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
                $scope.resultTable = creationService.data.resultTable;
                $scope.resultTable.settings.readOnly = false;
                $scope.resultTable.settings.afterInit = function () {
                    $scope.resultInstance = this;
                    $scope.resultInstance.selectCell();
                };
            };

            init();
        }
    ])

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
        '$location',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, $filter, Dataset, $location) {

            var init = function () {
                $scope.dataset = creationService.data.dataset;
                $scope.spatial = {
                    input: creationService.data.dataset.spatial,
                    output: []
                };
                $scope.language = {
                    input: creationService.data.dataset.language,
                    output: []
                };
                $scope.policy_domains = {
                    input: creationService.data.dataset.policy_domains,
                    output: []
                };
                $scope.external_resource = {
                    input: creationService.data.dataset.external_resource,
                    output: []
                };

                $scope.custom = false;
            };

            init();

            $scope.prevStep = function () {
                creationService.data.dataset.spatial = $scope.spatial.output;
                creationService.data.dataset.language = $scope.language.output;
                creationService.data.dataset.policy_domains = $scope.policy_domains.output;
                creationService.data.dataset.external_resource = $scope.external_resource.output;
                //creationService.data.dataset =   $scope.dataset;
            };

            $scope.toogleResource = function () {
                $scope.custom = !$scope.custom;
            };

            var buildData = function () {
                var table = [];
                var individuals = creationService.data.individualSelection;

                var count_ind = 0;
                angular.forEach(individuals, function (i) {
                    var values = {};
                    for (var j = 0; j < creationService.data.timeSeries.length; j++) {
                        var cell_value = creationService.data.resultTable.items[count_ind][j + 1];
                        if (cell_value == "-") {
                            cell_value = ""
                        }
                        values[creationService.data.timeSeries[j]] = parseFloat(cell_value);
                    }
                    table.push({
                        row: count_ind + 1,
                        individual: i,
                        values: values
                    });
                    count_ind++;
                });

                return {
                    table: table
                };
            };


            var preSave = function () {
                var payload = {};

                payload.time = {
                    resolution: creationService.data.timeResolution,
                    start: creationService.data.time.start,
                    end: creationService.data.time.end
                };

                payload.resource = {};

                if (creationService.data.dataset.resource) {
                    if (creationService.data.dataset.resource.url)
                        payload.resource.url = creationService.data.dataset.resource.url;

                    if (creationService.data.dataset.resource.issued)
                        payload.resource.issued = $filter('date')(creationService.data.dataset.resource.issued, 'yyyy-MM-dd');

                    if (creationService.data.dataset.resource.custom)
                        payload.resource.custom = creationService.data.dataset.resource.custom;

                    if ($scope.external_resource.output[0])
                        payload.resource.external_resource = $scope.external_resource.output[0];
                }

                payload.policy_domains = $scope.policy_domains.output;
                payload.title = $scope.dataset.title;
                payload.acronym = $scope.dataset.acronym;
                payload.keywords = $scope.dataset.keywords;
                payload.license = $scope.dataset.license;
                payload.description = $scope.dataset.description;
                payload.spatial = $scope.spatial.output[0];
                payload.language_id = $scope.language.output[0];
                payload.indicator_id = creationService.data.indicator[0].id;
                payload.class_id = creationService.data.classPreSelection[0];
                payload.user_id = 1;
                payload.unit_id = $scope.dataset.unit[0];
                payload.data = buildData();
                return payload;
            };

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

            var saveFinish = function () {
                var payload = preSave();
                Dataset.save(payload, function (value, responseHeaders) {
                    creationService.reset();
                    $location.path('/datasets/' + value.id);
                }, saveErrorCallback);
            };

            var saveCopy = function () {
                var payload = preSave();
                Dataset.save(payload, function (value, responseHeaders) {
                    $location.path('/datasets/create');
                }, saveErrorCallback);
            };

            $scope.saveObject = {
                saveFinish: saveFinish,
                saveCopy: saveCopy
            };

        }
    ])

    .controller('DatasetDetailController', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        'ngProgress',
        '$routeParams',
        '$filter',
        'Dataset',
        'Individual',
        '$q',
        'Indicator',
        '$location',
        'Auth',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, $filter, Dataset, Individual, $q, Indicator, $location, Auth) {

            $scope.userState = Auth.state;

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
                    afterInit: function () {
                        $scope.table.instance = this;
                    }
                },
                items: [],
                instance: null
            };

            // ToDo This should be part of a directive
            var getDatasetSuccess = function (dataset) {

                var getHeight = function (rows) {
                    var default_height = 500;
                    var row_height = 24;
                    if (rows > 0) {
                        var height = row_height * rows + row_height + 5;
                        if (height > default_height) {
                            return default_height;
                        } else {
                            return height;
                        }
                    } else {
                        return row_height * 2 + 5;
                    }
                };


                var table = dataset.data.table;
                var promises = [];

                // Resolve all Individuals first
                angular.forEach(table, function (row) {
                    promises.push(Individual.getById(row.individual).$promise);
                });

                // All Promises have to be resolved
                $q.all(promises).then(function (individuals) {

                    // Build the rows
                    for (var i = 0; i < table.length; i++) {
                        var row = [individuals[i].title];
                        angular.forEach(table[i].values, function (v) {
                            row.push(v);
                        });
                        $scope.table.items.push(row);
                    }

                    // Set the Column Headers
                    $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(dataset.time.resolution, dataset.time.start, dataset.time.end);
                    $scope.table.settings.colHeaders = [' '].concat($scope.timeSeries);

                    $scope.table.settings.height = getHeight(table.length);
                    // Show the table
                    $scope.showTable = true;

                    $scope.indicator = Indicator.get({id: dataset.indicator_id});
                });

            };

            var getDatasetError = function (error) {
                $location.path('/datasets');
            };

            $scope.dataset = Dataset.get({id: $routeParams.datasetId}, getDatasetSuccess, getDatasetError);

            $scope.deleteDataset = function (dataset) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Dataset " + dataset.acronym + " permanently?");
                dlg.result.then(function () {
                    // Delete the dataset via the API
                    dataset.$delete({}, function () {
                        $location.path('/datasets');
                    });
                });
            };

        }
    ]);
