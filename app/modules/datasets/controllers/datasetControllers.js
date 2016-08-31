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
    'ngProgress',
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

                    $scope.table.settings.height = getHeight(table.length+1);
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

            $scope.dataset = Dataset.get({id: $routeParams.datasetId},function(dataset){
                $scope.canDraft = dataset.is_draft;
            }, getDatasetSuccess, getDatasetError);

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
                        if(response['result'] == 500){
                            ngProgress.complete();
                            dialogs.notify('Selected dataset cannot be displayed', 'Please choose another one.');
                        }
                        else{
                            $scope.inputTable.items = response['result'];
                            $scope.dropzone.isCollapsed = true;
                            $scope.inputInstance.loadData($scope.inputTable.items);
                        }

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

                    creationService.data.dataset.url = resource.access_url;
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
                loadData: function (datasetCode, resource, data, datasetName) {
                    $scope.inputTable.items = data.result;
                    $scope.inputInstance.loadData(data.result);

                    creationService.data.dataset.url = "http://appsso.eurostat.ec.europa.eu/nui/show.do?dataset=" + datasetCode+ "&lang=en";
                    creationService.data.dataset.title = datasetName;
                    creationService.data.dataset.description = datasetName;
                    ngProgress.complete();
                }
            };

            $scope.databaseSelection = {
                isVisible: false,
                toggleVisibility: function () {
                    $scope.databaseSelection.isVisible = !$scope.databaseSelection.isVisible;
                    if ($scope.databaseSelection.isVisible)
                        $scope.dropzone.isCollapsed = true;
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
        'Individual',
        '$http',
        'API_CONF',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, Individual, $http, API_CONF) {

            var getSelection = function (startRow, startColumn, endRow, endColumn) {
                var result = DatasetsControllerHelper.getTableSelection(startRow, startColumn, endRow, endColumn, $scope.inputTable.items);
                angular.forEach(result, function (r) {
                    if ((!_.contains($scope.individualSelection, r)) && r != null && r != '') {
                        searchForIndividuals(r);
                    }
                });
            };


            var searchForIndividuals = function(search_term){
                var individual_url = ""
                if($scope.selection.output.length > 0){
                    individual_url = API_CONF.REFERENCE_POOL_URL + "/individuals?class=" + $scope.selection.output +  "&q=" + search_term;
                }else{
                    individual_url = API_CONF.REFERENCE_POOL_URL + "/individuals?q=" + search_term;
                }
                $http.get(individual_url).
                success(function (data, status, headers, config) {
                    var suggestions = [];
                    suggestions.push({"name":search_term, "checked":false});
                    if(data.length > 0) {
                        angular.forEach(data, function (result) {
                            var alreadyExisting = false;
                            angular.forEach(suggestions, function(s){
                                if(s.name == result.title){
                                    alreadyExisting = true;
                                }
                            });
                            if(!alreadyExisting){
                                suggestions.push({"name": result.title, "checked":false});
                            }
                        });

                    }
                    if(suggestions.length == 1){
                        suggestions[0].checked = true;
                    }
                    if(suggestions.length > 1){
                        $scope.saveIndividual(search_term, suggestions, "");
                    }
                    else{
                        $scope.saveIndividual(search_term, suggestions, search_term);
                    }

                }).error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });


            }

            $scope.updateSelectedSuggestion = function(suggestionIndex, individual){
                angular.forEach(individual.suggestions, function(suggestion, index){
                    var resetSelected = false;
                    if(suggestionIndex != index){
                        suggestion.checked = false;
                    }
                    else{
                        suggestion.checked = !suggestion.checked;
                        if(suggestion.checked){
                            individual.selected = suggestion.name;
                        }else{
                            resetSelected = true;
                        }
                    }
                    if(resetSelected){
                        individual.selected = "";
                    }
                })
            }

            $scope.saveIndividual = function(key, suggestions, selectedSuggestion){
                var individualIndex = getIndexOfIndividual(key);
                var newIndividual = {"name": key, "suggestions":suggestions, "selected":selectedSuggestion};
                if(individualIndex >= 0){
                    $scope.individualSelection[individualIndex] = newIndividual;
                }else{
                    $scope.individualSelection.push(newIndividual);
                }
            }


            var getIndexOfIndividual = function(key){
                for(var i=0; i<$scope.individualSelection.length; i++){
                    if($scope.individualSelection[i].name == key){
                        return i;
                    }
                }
                return -1;
            }

            var sortIndividualSelection = function(){
                var individualList = [];
                for(var i=0; i<$scope.individualOrder.length; i++){
                    for(var j=0; j<$scope.individualSelection.length; j++){
                        if($scope.individualOrder[i] == $scope.individualSelection[j].name){
                            if($scope.individualSelection[j].selected.length > 0){
                                individualList.push({"name":$scope.individualSelection[j].name, "suggestions":$scope.individualSelection[j].suggestions, "selected":$scope.individualSelection[j].selected});
                            }

                            continue;
                        }
                    }
                }
                return individualList;
            }

            var restoreIndividuals = function(){
                var individuals = creationService.data.individualSelectionBackup;
                for(var i=1;i<$scope.inputTable.items.length;i++){
                    for(var j=0; j<individuals.length; j++){
                       if(individuals[j].selected == $scope.inputTable.items[i][0]){
                           $scope.inputTable.items[i][0] = individuals[j].name;
                           continue;
                       }
                    }
                }
            }

            var allIndividualsChecked = function(){
                var count = 0;
                angular.forEach($scope.individualSelection, function(i){
                    angular.forEach(i.suggestions, function(s){
                        if(s.checked == true){
                            count++;
                        }
                    });
                });
                if(count == $scope.individualSelection.length){
                    return true;
                }else{
                    return false;
                }
            }

            var renameIndividuals = function(){
                var individualsBackup = [];
                for(var i=1;i<$scope.inputTable.items.length;i++){
                    for(var j=0; j<$scope.individualSelection.length; j++){
                       if($scope.individualSelection[j].name == $scope.inputTable.items[i][0]){
                           $scope.inputTable.items[i][0] = $scope.individualSelection[j].selected;
                           individualsBackup.push({"name":$scope.individualSelection[j].name, "suggestions":$scope.individualSelection[j].suggestions, "selected":$scope.individualSelection[j].selected});
                           continue;
                       }
                    }
                }
                creationService.data.individualSelectionBackup = individualsBackup;
            }

            var init = function () {
                $scope.inputTable = creationService.data.inputTable;
                $scope.inputTable.items = creationService.data.inputTable.items;
                /*
                if(creationService.data.individualsOrder.length > 0){
                    $scope.individualOrder = creationService.data.individualsOrder;
                }
                else{
                    $scope.individualOrder = [];
                    for(var i=1;i<$scope.inputTable.items.length;i++){
                        $scope.individualOrder.push($scope.inputTable.items[i][0]);
                    }
                    creationService.data.individualsOrder = $scope.individualOrder;
                }

                if(creationService.data.individualSelectionBackup.length > 0){
                    restoreIndividuals();
                }
                */
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

            $scope.removeIndividual = function (key) {
                for(var i=0; i<$scope.individualSelection.length; i++){
                    if($scope.individualSelection[i].name == key){
                        $scope.individualSelection.splice(i, 1);
                    }
                }
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

                creationService.data.classPreSelection = $scope.selection.output;
                creationService.data.extraMetadata = $scope.extraMetadata;

                if(!allIndividualsChecked()){
                    dialogs.error('Validation Error', 'Please choose one option for each Dimension.');
                    return false;
                }
                //creationService.data.individualSelection = sortIndividualSelection();
                creationService.data.individualSelection = $scope.individualSelection;
                $scope.individualSelection = creationService.data.individualSelection;

                if (creationService.data.individualSelection.length == 0) {
                    dialogs.error('Validation Error', 'Please choose at least one Data Dimension.');
                    return false;
                }

                //renameIndividuals();
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
                $scope.individualSelection = [];
                for(var i=0; i<creationService.data.individualSelection.length; i++){
                    $scope.individualSelection.push(creationService.data.individualSelection[i].selected);
                }

                $scope.mode = 'row';
                $scope.timeSeries = DatasetsControllerHelper.generateTimeSeries(creationService.data.timeResolution, creationService.data.time.start, creationService.data.time.end);

                $scope.timeSeriesLength = $scope.timeSeries.length;
                creationService.data.timeSeries = $scope.timeSeries;


                $scope.inputTable = creationService.data.inputTable;
                $scope.resultTable = creationService.data.resultTable;
                $scope.resultTable.settings.afterInit = function () {
                    $scope.resultInstance = this;
                    $scope.resultInstance.selectCell(0, 0, 0, 0);
                };

                $scope.inputTable.settings.contextMenu = false;
                $scope.inputTable.settings.afterSelectionEnd = getSelection;

                $scope.resultTable.settings.minCols = $scope.timeSeries.length + 1;
                //$scope.resultTable.settings.minRows = creationService.data.individualSelection.length + 1;
                $scope.resultTable.settings.colHeaders = [' '].concat($scope.timeSeries);

                $scope.selectionStep = 1;
                $scope.lastStep = $scope.individualSelection.length;

                $scope.resultTable.items = [];

                if ($scope.resultTable.items.length == 0) {
                    angular.forEach(creationService.data.individualSelection, function (i) {
                        $scope.resultTable.items.push([i.selected]);
                    });
                }


                if ($scope.resultTable.items.length > ($scope.timeSeries.length + 1)) {
                    $scope.resultTable.items = [];
                    angular.forEach(creationService.data.individualSelection, function (i) {
                        $scope.resultTable.items.push([i.selected]);
                    });
                }

                $scope.resultTable.height = $scope.resultTable.items.length * 23 + 50;

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
                    $scope.resultTable.items.push([i].selected);
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
        'Individual',
        'ExternalResource',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, creationService, $filter, Dataset, $location, Individual, ExternalResource) {

            $scope.canDraft = true;

            $scope.checkExternalResources = function(){
                var externalsList = ExternalResource.query(null, function(){
                    externalsList.forEach(function(external){
                        if($scope.dataset.url.toLowerCase().includes(external.title.toLowerCase())){
                            $scope.external_resource.input = [external.id];
                        }
                    });
                });
            };

            var init = function () {
                $scope.selectedIndividuals = [];
                var individualsList = Individual.query(null, function(){
                    individualsList.forEach(function(individual){
                        creationService.data.individualSelection.forEach(function(selectedIndividual){
                            if(individual.title == selectedIndividual.selected){
                                $scope.selectedIndividuals.push(individual.id);
                            }
                        });
                    });
                });

                $scope.spatials = {
                    input: $scope.selectedIndividuals,
                    output: []
                };

                $scope.dataset = creationService.data.dataset;


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
                $scope.license = {
                    input: creationService.data.dataset.license,
                    output: []
                };

                if(typeof $scope.external_resource.input === 'undefined' && typeof $scope.dataset.url !== "undefined"){
                    $scope.checkExternalResources();
                }

                $scope.custom = false;

                $scope.dataset.is_draft = true;
            };

            init();

            $scope.prevStep = function () {
                creationService.data.dataset.spatials = $scope.spatials.output;
                creationService.data.dataset.language = $scope.language.output;
                creationService.data.dataset.policy_domains = $scope.policy_domains.output;
                creationService.data.dataset.external_resource = $scope.external_resource.output;
                creationService.data.dataset.license = $scope.license.output;
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
                        individual: i.selected,
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

                if(!payload.resource.url) payload.resource.url = creationService.data.dataset.url;
                payload.policy_domains = $scope.policy_domains.output;
                payload.title = $scope.dataset.title;
                payload.acronym = $scope.dataset.acronym;
                payload.keywords = $scope.dataset.keywords;
                if($scope.license.output) payload.license_id = $scope.license.output[0];
                payload.description = $scope.dataset.description;
                payload.spatials = $scope.spatials.output;
                payload.language_id = $scope.language.output[0];
                payload.indicator_id = creationService.data.indicator[0].id;
                payload.class_id = creationService.data.classPreSelection[0];
                payload.user_id = 1;
                payload.unit_id = $scope.dataset.unit[0];
                payload.data = buildData();
                payload.is_draft = $scope.dataset.is_draft;
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
        'VisualizationByDataset',
        function ($scope, DatasetsControllerHelper, $log, dialogs, ngProgress, $routeParams, $filter, Dataset, Individual, $q, Indicator, $location, Auth, VisualizationByDataset) {

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

                    $scope.table.settings.height = getHeight(table.length+1);
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
                if($scope.relatedVisualizationsString.length == 0){
                    // Open a confirmation dialog
                    var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Dataset " + dataset.acronym + " permanently?");
                    dlg.result.then(function () {
                        // Delete the dataset via the API
                        dataset.$delete({}, function () {
                            $location.path('/datasets');
                        });
                    });
                }
                else{
                    var dlg = dialogs.notify('Cannot delete this dataset', 'This dataset is being used by one or more visualizations. Please delete these visualizations first: ' +
                        $scope.relatedVisualizationsString);
                }

            };

            $scope.relatedVisualizations = [];
            $scope.relatedVisualizationsString = "";

            $scope.visualizationByDatasetList = VisualizationByDataset.get({id: $routeParams.datasetId},
                function(VisualizationByDatasetList){
                    for(i in VisualizationByDatasetList.results){
                        var Tmp = {
                            "id": VisualizationByDatasetList.results[i]['visualization'],
                            "title": VisualizationByDatasetList.results[i]['title']
                        }
                        $scope.relatedVisualizations.push(Tmp);
                        $scope.relatedVisualizationsString += '<br><a href= "/app/#!/visualizations' + '/' + VisualizationByDatasetList.results[i]['visualization'] + '" target="_blank"> '+ VisualizationByDatasetList.results[i]['title'] + '</a>';
                    }

                });
        }
    ]);
