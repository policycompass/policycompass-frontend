/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.datasets.directives.ckanImport', []).directive('ckanImport', [
    '$http', 'ngProgress', 'API_CONF', 'dialogs', '$location', '$anchorScroll', '$routeParams', function ($http, ngProgress, API_CONF, dialogs, $location, $anchorScroll, $routeParams) {
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
                scope.start = 0;
                scope.currentPage = 1;
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

                scope.init = function(){
                    if(typeof $routeParams.term !== 'undefined'){
                        scope.search($routeParams.term, $routeParams.start);
                    }
                    if(typeof $routeParams.page !== 'undefined'){
                        scope.currentPage = $routeParams.page;
                    }
                }

                scope.goToTop = function(){
                    var old = $location.hash();
                    $location.hash('top');
                    $anchorScroll();
                    $location.hash(old);
                };

                scope.onPageChange = function () {
                    scope.start = ((scope.currentPage - 1) * scope.itemsPerPage) + 1
                    scope.search(scope.lastTerm, scope.start);
                    scope.goToTop();
                };

                scope.saveParameters = function(){
                    $location.search('term', scope.searchTerm);
                    $location.search('page', scope.currentPage);
                    $location.search('start', scope.start);
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
                            //scope.saveParameters();
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
                        scope.ckanSearchResults = response.data.result.results;
                    });
                };

                scope.init();
            }
        }
    }
]);
