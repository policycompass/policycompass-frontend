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

    }).directive('openWikipediaModal', function($modal,$location, $http, API_CONF, ngProgress, eventService){
        return{
            restrict: 'E',
            scope:false,
            link: function(scope){
                scope.openWikipedia = function(){
                    $modalInstance = $modal.open({
                        templateUrl: 'wikipedia',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope) {
                            $scope.wikipedia_searchForWikiTitles = function(search_term){
                                $http.get(
                                    "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + search_term
                                ).success(function (data, status, headers, config) {
                                    $scope.wikipedia_title_results = data[1];
                                }).error(function (data, status, headers, config) {

                                });
                            };

                            $scope.apply = function(_title){
                                scope.search_title = _title
                                scope.saveParameters();
                                scope.searchEvent();
                                $modalInstance.close();
                            }

                            $scope.close = function(){
                                $modalInstance.close();
                            }

                        }
                    });
                }
            },
            templateUrl:'modules/events/partials/wikipedia.html'
        };
    });


