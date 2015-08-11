
angular.module('pcApp.datasets.services.dataset',[
    'ngResource',
    'pcApp.config',
    'ngStorage'
])

.factory('creationService', ['$log', '$localStorage', function ($log, $localStorage) {

        if($localStorage.newdataset) {
            var data = $localStorage.newdataset;
        } else {
            var data = {
                step: null,
                inputTable: {
                    instance: null,
                    settings: {
                        colHeaders: true,
                        rowHeaders: true,
                        minRows: 20,
                        minCols: 10 ,
                        contextMenu: true,
                        stretchH: 'all',
                        outsideClickDeselects: false
                    },
                    items: [[]]
                },
                resultTable: {
                    instance: null,
                    settings: {
                        autoColumnSize: true,
                        contextMenu: true,
                        stretchH: 'all',
                        outsideClickDeselects: false
                    },
                    items: []
                },
                classPreSelection: [],
                individualSelection: [],
                timeResolution: null,
                time: {
                    start: null,
                    end: null
                }
            };
            $localStorage.newdataset = data;
        }
        return data;
    }]);