/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.datasets.directives.eurostatImport', []).directive('eurostatImport', [
    '$http', 'ngProgress', 'API_CONF', function ($http, ngProgress, API_CONF) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/eurostat-import.html';
            },
            scope: {
                'loadData': '='
            },
            link: function (scope, element, attrs, ctrls) {
                scope.itemsPerPage = 10;
                scope.selectedFilters = [];
                scope.filterGeos = [];
                scope.filterTimes = [];
                scope.byNumResourcesGtZero = function (result) {
                    return result.num_resources > 0;
                };

                scope.byResourceTypeIn = function (types) {
                    return function (resource) {
                        for (var i in types) {
                            var type = types[i];
                            if (resource.format.toLowerCase() == type)
                                return true;
                        }
                        return false;
                    }
                };

                scope.onPageChange = function () {
                    var start = (scope.currentPage - 1) * scope.itemsPerPage;
                    scope.search(scope.lastTerm, start);
                };


                scope.loadResource = function (dataset, filters) {
                    ngProgress.start();
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/eurostat/download',
                        params: {
                            dataset: dataset,
                            filters: filters,
                            convert: true
                        }
                    }).then(function (response) {
                        scope.loadData(dataset, filters,response.data);
                        ngProgress.complete();
                    });
                };

                scope.search = function (term, start) {
                    ngProgress.start();
                    scope.lastTerm = term;

                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/eurostat/search',
                        params: {
                            api: attrs.apiBase,
                            start: start,
                            q: term
                        }
                    }).then(function (response) {
                        ngProgress.complete();
                        prepareFilters(response);
                    });
                };

                var prepareFilters = function(response){
                    scope.eurostatFilters = response.data.result;
                    scope.eurostatKeys = [];
                    scope.eurostatValues = [];
                    for(var key in scope.eurostatFilters) {
                        if (scope.eurostatFilters.hasOwnProperty(key) && key !== 'label') {
                            scope.eurostatKeys.push(key);
                            var values = [];
                            for(var i = 0; i<scope.eurostatFilters[key].length; i++){
                                if(key === 'geo'){
                                    scope.filterGeos.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                                }
                                else if(key === 'time'){
                                    scope.filterTimes.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                                }
                                else{
                                    values.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                                }
                            }
                            if(key !== 'geo' && key !== 'time')scope.eurostatValues.push([key,values]);
                        }
                        else if(scope.eurostatFilters.hasOwnProperty(key) && key == 'label'){
                            scope.eurostatLabel = scope.eurostatFilters[key];
                        }
                    }
                }

                scope.updateFilters = function(){
                    scope.loadResource(scope.lastTerm,{'result': scope.selectedFilters});
                }

                scope.saveFilter = function(key, output){
                    var items = [];
                    for(var i=0; i<output.length; i++){
                        items.push(output[i].maker);
                    }

                    for(var j=0; j<scope.selectedFilters.length ;j++){
                        if(key == scope.selectedFilters[j][0]){
                            scope.selectedFilters.splice(j,1);
                        }
                    }

                    if(items.length > 0){
                       scope.selectedFilters.push([key,items]);
                    }
                }

            }
        }
    }
]);
