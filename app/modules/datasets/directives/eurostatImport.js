/**
 * Directive for importing Data from Eurostat
 */
angular.module('pcApp.datasets.directives.eurostatImport', []).directive('eurostatImport', [
    '$http', 'ngProgress', 'API_CONF', '$location','$anchorScroll',function ($http, ngProgress, API_CONF, $location, $anchorScroll) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/eurostat-import.html';
            },
            scope: {
                'loadData': '='
            },
            link: function (scope, element, attrs, ctrls) {
                scope.itemsPerPage = 9;
                scope.eurostatStart = 0;
                var firstVisit = true;
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
                    scope.eurostatStart = start;
                    handlePageResults(scope.eurostatTotalSearchResults);
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
                        if(response.data.result != 416 && response.data.result != 400){
                            scope.loadData(dataset, filters,response.data,scope.datasetName);
                            scope.moreFilters = false;
                            scope.wrongFilterValues = false;
                        }

                        if(response.data.result == 416){
                            if(!firstVisit) ngProgress.complete();
                            scope.moreFilters = true;
                        }
                        else{
                            scope.moreFilters = false;
                        }

                        if(response.data.result == 400){
                            scope.wrongFilterValues = true;
                            ngProgress.complete();
                        }
                        else{
                            scope.wrongFilterValues = false;
                        }

                        firstVisit = false;
                    });
                };

                scope.search = function (term) {
                    ngProgress.start();
                    scope.lastTerm = term;
                    scope.eurostatStart = 0;
                    scope.eurostatFilters = null;
                    scope.eurostatSearchResults = null;

                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/eurostat/search1',
                        params: {
                            q: term
                        }
                    }).then(function (response) {
                        resetFilters();
                        firstVisit = true;
                        scope.eurostatTotalSearchResults = response.data.result;
                        handlePageResults(response.data.result);
                    });
                };

                var handlePageResults = function(result){
                    scope.eurostatSearchResults = [];
                    var length = scope.eurostatStart + scope.itemsPerPage;

                    if(length > result.length){
                        length = result.length;
                    }

                    for(var i = scope.eurostatStart; i<length; i++){
                        scope.eurostatSearchResults[i-scope.eurostatStart] = result[i];
                    }
                    ngProgress.complete();
                }

                scope.searchForDataset = function (term) {
                    ngProgress.start();
                    if(term != null){
                        scope.lastTerm = term;
                    }

                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/eurostat/search2',
                        params: {
                            q: term
                        }
                    }).then(function (response) {
                        prepareFilters(response);
                    });
                };

                scope.saveDatasetName = function(dataset){
                    scope.datasetName = dataset[1];
                    scope.dataset = dataset;
                }

                var resetFilters = function(){
                    scope.selectedFilters = [];
                    scope.filterGeos = [];
                    scope.filterTimes = [];
                    scope.moreFilters = false;
                }

                resetFilters();

                var prepareFilters = function(response){
                    scope.eurostatFilters = response.data.result;
                    scope.eurostatKeys = [];
                    scope.eurostatValues = [];
                    for(var key in scope.eurostatFilters) {
                        scope.eurostatKeys.push(key);
                        var values = [];
                        for(var i = 0; i<scope.eurostatFilters[key].length; i++){
                            if(key === 'GEO'){
                                scope.filterGeos.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                            }
                            else if(key === 'time'){
                                scope.filterTimes.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                            }
                            else{
                                values.push({icon:"", name:scope.eurostatFilters[key][i][1], maker:scope.eurostatFilters[key][i][0], ticked:false});
                            }
                        }
                        if(key !== 'GEO' && key !== 'time')scope.eurostatValues.push([key,values]);
                    }

                    for(var i = 1980; i<2099 ; i++){
                        scope.filterTimes.push({icon:"", name: i.toString(), maker: i.toString(), ticked:false});
                    }
                    ngProgress.complete();
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
