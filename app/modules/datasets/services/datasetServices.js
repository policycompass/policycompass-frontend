
angular.module('pcApp.datasets.services.dataset',[
    'ngResource',
    'pcApp.config'
])

.factory('creationService', ['$log', function ($log) {
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
                    outsideClickDeselects: false,
                    afterInit: function() {
                        data.inputTable.instance = this;
                    }
                },
                items: [[]]
            },
            classPreSelection: [],
            individualSelection: []
        };
        return data;
    }]);