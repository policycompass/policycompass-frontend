/**
 * Directives for Event Manager
 */

angular.module('pcApp.events.directives.eventDirectives', [])

    .directive('openConfigurationsModal', function($modal,$location){
        return{
            restrict: 'E',
            scope:false,
            link: function(scope){
                scope.open = function(){
                    $modalInstance = $modal.open({
                        templateUrl: 'configurations',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope) {
                            $scope.availableExtractors = scope.availableExtractors;
                            var selectedExtractorsReset = [];

                            scope.selectedExtractors.forEach(function(extractor){
                                selectedExtractorsReset.push(extractor);
                            });


                            $scope.sync = function (bool, item) {
                                if (bool) {
                                    // add item
                                    scope.selectedExtractors.push(item);
                                } else {
                                    // remove item
                                    for (var i = 0; i < scope.selectedExtractors.length; i++) {
                                        if (scope.selectedExtractors[i] == item) {
                                            scope.selectedExtractors.splice(i, 1);
                                        }
                                    }
                                }
                            };

                            $scope.isChecked = function (name) {
                                var match = false;
                                for (var i = 0; i < scope.selectedExtractors.length; i++) {
                                    if (scope.selectedExtractors[i] == name) {
                                        match = true;
                                    }
                                }
                                return match;
                            };

                            $scope.apply = function(){
                                $modalInstance.close();
                            }


                            $scope.close = function(){
                                scope.selectedExtractors = [];
                                selectedExtractorsReset.forEach(function(extractor){
                                    scope.selectedExtractors.push(extractor);
                                });
                                $modalInstance.close();
                            }
                        }
                    });
                }
            },
            templateUrl:'modules/events/partials/configurations.html'
        };

    }).directive('openEventminerModal', function($modal,$location, $http, API_CONF, ngProgress, eventService){
        return{
            restrict: 'E',
            scope:false,
            link: function(scope){
                scope.openEventminer = function(){
                    $modalInstance = $modal.open({
                        templateUrl: 'eventminer',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope) {
                            $scope.eventminer_searchForWikiTitles = function(search_term){
                                $http.get(
                                        API_CONF.EVENTMINER_URL + 'search?term=' + search_term
                                ).success(function (data, status, headers, config) {
                                    $scope.eventminer_title_results = data.search_result;
                                }).error(function (data, status, headers, config) {

                                });
                            };

                            $scope.eventminer_searchForEvents = function(wiki_title){
                                ngProgress.start();
                                $http.get(
                                        API_CONF.EVENTMINER_URL + 'extraction?title=' + wiki_title
                                ).success(function (data, status, headers, config) {
                                    addToSearchResults(data.extraction_result);
                                    ngProgress.complete();
                                    $scope.close();
                                }).error(function (data, status, headers, config) {

                                });
                            };

                            var addToSearchResults = function(result){
                                ngProgress.start();
                                scope.eventTitle = scope.search_title;
                                scope.searchResults = [];
                                for(var i = 0; i<result.length; i++){
                                    var date = calculateDate(result[i])
                                    scope.searchResults[i] = {"title": result[i].event, "description": result[i].event, "url": "https://en.wikipedia.org/wiki/"+scope.eventTitle, "date":date[0], "endDate":date[1]};
                                }
                                scope.itemOffset = (scope.currentPage - 1 ) * scope.itemsperPage;
                                scope.totalItems = scope.searchResults.length;
                                scope.fillSearchResults(scope.searchResults);
                                ngProgress.complete();
                            };

                            var calculateDate = function(result){
                                var startDate = "";
                                var endDate = "";
                                if(result.start_day){
                                    startDate = startDate + result.start_day + "-";
                                }
                                else{
                                    startDate = startDate + "01-";
                                }
                                if(result.start_month){
                                    startDate = startDate + result.start_month + "-";
                                }
                                else{
                                    startDate = startDate + "01-";
                                }
                                startDate = startDate + result.start_year;

                                if(result.end_year){
                                    if(result.end_day){
                                        endDate = endDate + result.end_day + "-";
                                    }
                                    else{
                                        endDate = endDate + "01-";
                                    }
                                    if(result.end_month){
                                        endDate = endDate + result.end_month + "-";
                                    }
                                    else{
                                        endDate = endDate + "01-";
                                    }
                                    endDate = endDate + result.end_year;
                                }

                                return [startDate, endDate];
                            }

                            $scope.apply = function(){
                                $modalInstance.close();
                            }

                            $scope.close = function(){
                                $modalInstance.close();
                            }

                            $scope.eventminer_searchForWikiTitles(scope.search_title)
                        }
                    });
                }
            },
            templateUrl:'modules/events/partials/eventminer.html'
        };
    });


