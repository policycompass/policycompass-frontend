/**
 * Created by fki on 8/5/15.
 */
/**
 * Module for all Datasets Controllers
 */

angular.module('pcApp.datasets.controllers.dataset', [
    'pcApp.references.services.reference',
    'dialogs.main'
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

    .controller('DatasetCreateController', [
        '$scope',
        'DatasetsControllerHelper',
        '$log',
        'dialogs',
        function ($scope, DatasetsControllerHelper, $log, dialogs) {

            $scope.inputTable = {};
            $scope.inputTable.settings = {
                colHeaders: true,
                rowHeaders: true,
                minRows: 10,
                minCols: 10 ,
                contextMenu: true,
                stretchH: 'all',
                outsideClickDeselects: false,
                afterInit: function() {
                    $scope.inputTable.instance = this;
                }
            };
            $scope.inputTable.items = [[]];

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

            $scope.getSelection = function () {
                var selection = $scope.inputTable.instance.getSelected();
                $log.info(selection);
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


            //$scope.db.items = [
            //    {
            //        "id":1,
            //        "name":{
            //            "first":"John",
            //            "last":"Schmidt"
            //        },
            //        "address":"45024 France",
            //        "price":760.41,
            //        "isActive":"Yes",
            //        "product":{
            //            "description":"Fried Potatoes",
            //            "options":[
            //                {
            //                    "description":"Fried Potatoes",
            //                    "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
            //                    "Pick$":null
            //                },
            //                {
            //                    "description":"Fried Onions",
            //                    "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
            //                    "Pick$":null
            //                }
            //            ]
            //        }
            //    }
            //    //more items go here
            //];

    }]);