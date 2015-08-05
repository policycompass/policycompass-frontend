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
        function ($scope, DatasetsControllerHelper, $log) {

            $scope.db = {};

            $scope.db.items = [
                {
                    "id":1,
                    "name":{
                        "first":"John",
                        "last":"Schmidt"
                    },
                    "address":"45024 France",
                    "price":760.41,
                    "isActive":"Yes",
                    "product":{
                        "description":"Fried Potatoes",
                        "options":[
                            {
                                "description":"Fried Potatoes",
                                "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
                                "Pick$":null
                            },
                            {
                                "description":"Fried Onions",
                                "image":"//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png",
                                "Pick$":null
                            }
                        ]
                    }
                }
                //more items go here
            ];

    }]);