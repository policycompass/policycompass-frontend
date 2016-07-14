/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.datasets.directives.ckanImport', []).directive('ckanImport', [
    '$http', 'ngProgress', 'API_CONF', 'dialogs', function ($http, ngProgress, API_CONF, dialogs) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/ckan-import.html';
            },
            scope: {
                'loadData': '='
            },
            link: function (scope, element, attrs, ctrls) {
                scope.itemsPerPage = 10;
                scope.ckanStart = 0;
                scope.byNumResourcesGtZero = function (result) {
                    if(result){
                        return result.num_resources > 0;
                    }
                    else if(scope.ckan){
                        return scope.ckan.num_resources > 0;
                    }

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
                    scope.ckanStart = start;
                    handlePageResults(scope.ckan);
                };

                var handlePageResults = function(result){
                    scope.ckanSearchResults = [];
                    var length = scope.ckanStart + scope.itemsPerPage;

                    if(length > result.results.length){
                        length = result.results.length;
                    }

                    for(var i = scope.ckanStart; i<length; i++){
                        scope.ckanSearchResults[i-scope.ckanStart] = result.results[i];
                    }
                }

                scope.loadResource = function (dataset, resource) {
                    ngProgress.start();
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/ckan/download',
                        params: {
                            api: attrs.apiBase,
                            id: resource.id,
                            convert: true
                        }
                    }).then(function (response) {
                        if(response.data.result == 500){
                            ngProgress.complete();
                            dialogs.notify('Selected dataset cannot be displayed', 'Please choose another one.');
                        }
                        else{
                            scope.loadData(dataset, resource, response.data);
                            ngProgress.complete();
                        }
                    });
                };

                scope.search = function (term, start) {
                    ngProgress.start();
                    scope.lastTerm = term;
                    scope.eurostatStart = 0;
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/ckan/search',
                        params: {
                            api: attrs.apiBase,
                            q: term,
                            start: start
                        }
                    }).then(function (response) {
                        ngProgress.complete();
                        scope.ckan = response.data.result;
                        handlePageResults(response.data.result);
                    });
                };
            }
        }
    }
]);
