
angular.module('pcApp.datasets.services.dataset',[
    'ngResource',
    'pcApp.config',
    'ngStorage'
])

.factory('creationService', ['$log', '$sessionStorage', function ($log, storage) {

        if(storage.newdataset) {
            var data = storage.newdataset;
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
                },
                indicator: [],
                timeSeries: null,
                dataset: {}
            };
            storage.newdataset = data;
        }
        return data;
    }]);