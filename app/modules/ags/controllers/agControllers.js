angular.module('pcApp.ags.controllers.ag', [
        'pcApp.ags.services.ag',
        'pcApp.references.services.reference',
        'pcApp.config'
    ])
    /**
     * Controller to list ags
     */
    .controller('AgsController', [
        '$scope', 'Ag', '$routeParams',
        function($scope, Ag, $routeParams) {
            $scope.ags = Ag.query({
                page: $routeParams.page
            }, function(agList) {}, function(error) {
                throw {
                    message: JSON.stringify(err.data)
                };
            });
        }
    ])
    /**
     * Controller to list details of an ag
     */
    .controller('AgDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Ag',
        'dialogs',
        '$log',
        'Auth',
        function($scope, $routeParams, $location, Ag, dialogs, $log, Auth) {

            $scope.userState = Auth.state;

            Ag.get({
                id: $routeParams.agId
            }, function(ag) {
                $scope.ag = ag;
                console.log('hey', ag);



            }, function(error) {
                alert(error.data.message);
            });

            $scope.deleteAg = function(ag) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Ag '" + ag.title + "' permanently?");
                dlg.result.then(function() {
                    // Delete the ag via the API
                    ag.$delete({}, function() {
                        $location.path('/ags');
                    });
                });
            };


        }
    ])
    /**
     * Controller to edit a ag
     */
    .controller('AgEditController', [
        '$scope',
        '$routeParams',
        'Ag',
        '$location',
        '$log',
        'Auth',
        function($scope, $routeParams, Ag, $location, $log, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "edit";

            $scope.ag = Ag.get({
                id: $routeParams.agId
            }, function(ag) {}, function(err) {
                throw {
                    message: JSON.stringify(err.data)
                };
            });

            $scope.createAg = function() {
                $scope.ag.data = $scope.editor.graphToYAML();

                Ag.update($scope.ag, function(value, responseHeaders) {
                    $location.path('/ags/' + value.id);
                }, function(err) {
                    throw {
                        message: JSON.stringify(err.data)
                    };
                });
            };
        }
    ])
    /**
     * Controller to create an ag
     */
    .controller('AgCreateController', [
        '$scope',
        'Ag',
        '$location',
        '$log',
        'dialogs',
        'agService',
        'Auth',
        function($scope, Ag, $location, $log, dialogs, agservice, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "create";

            if (angular.toJson(agservice.getAg()) != "[]") {
                $scope.ag = agservice.getAg()[0];
                agservice.removeAg();
            }

            $scope.createAg = function() {
                //FIXME
                $scope.ag.userID = 1;
                $scope.ag.data = $scope.editor.graphToYAML();

                Ag.save($scope.ag, function(value, responseHeaders) {
                    $location.path('/ags/' + value.id);
                }, function(err) {
                    throw {
                        message: JSON.stringify(err.data)
                    };
                });
            };
        }
    ])

/**
 * Controller to search and import ags from external resources
 */
.controller('AgSearchController', [
        '$scope',
        '$filter',
        'Ag',
        '$location',
        '$log',
        '$http',
        'API_CONF',
        'agService',
        'Auth',
        function($scope, $filter, Ag, $location, $log, $http, API_CONF, agservice, Auth) {

            $scope.userState = Auth.state;

            $scope.step = 'one';
            $scope.nextStep = function() {

            };

            $scope.prevStep = function() {
                $scope.step = 'one';
            };

            $scope.search = {};
            $scope.searchResults = [];
            $scope.availableExtractors = [];
            $scope.init = function() {
                $http.get(API_CONF.AGS_MANAGER_URL + '/getextractor').

                success(function(data, status, headers, config) {
                    $scope.availableExtractors = data;

                }).error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };
            $scope.init();
            $scope.selectedExtractors = [];
            $scope.isChecked = function(name) {
                var match = false;
                for (var i = 0; i < $scope.selectedExtractors.length; i++) {
                    if ($scope.selectedExtractors[i] == name) {
                        match = true;
                    }
                }
                return match;
            };

            $scope.sync = function(bool, item) {
                if (bool) {
                    // add item
                    $scope.selectedExtractors.push(item);
                } else {
                    // remove item
                    for (var i = 0; i < $scope.selectedExtractors.length; i++) {
                        if ($scope.selectedExtractors[i] == item) {
                            $scope.selectedExtractors.splice(i, 1);
                        }
                    }
                }
            };

            $scope.searchAg = function() {
                // FIXME
                $http.get(API_CONF.AGS_MANAGER_URL + '/harvestags?keyword=' + $scope.search.title + '&extractors=' + $scope.selectedExtractors + '&start=' + $filter('date')($scope.search.startAgDate, "yyyy-MM-dd") + '&end=' + $filter('date')($scope.search.endAgDate, "yyyy-MM-dd")).

                success(function(data, status, headers, config) {
                    $scope.searchResults = data;
                }).error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                try {
                    $scope.step = 'second';
                } catch (err) {
                    console.log(err);
                }
            };
            $scope.selectAg = function() {
                agservice.addAg($scope.searchResults[$scope.search.selectedAg[0]]);
                $location.path('/ags/create');
            };
        }
    ])
    /**
     * Controller to add and edit a datasource
     */
    .controller('AgConfigController', [
        '$scope',
        '$window',
        '$route',
        '$log',
        '$http',
        'API_CONF',
        function($scope, $window, $route, $log, $http, API_CONF) {
            $scope.showContent = function($fileContent) {
                $scope.content = $fileContent;
            };
            $scope.ex_added = function() {
                $window.alert("Script added!");
                $route.reload();
            };
            $scope.post = function() {
                //$log.info($scope.modul.name);
                //$log.info($scope.content);
                $http.post(API_CONF.AGS_MANAGER_URL + '/configextractor', {
                    name: $scope.modul.name,
                    script: $scope.content
                }).then(function(response) {
                    if (response) {
                        $scope.ex_added = function() {
                            $window.alert("Script added!");
                            $route.reload();
                        };
                    }
                    // this callback will be called asynchronously
                    // when the response is available
                }, function(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    ])
    /**
     * Directive to read files
     */
    .directive('onReadFile', function($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function(onChangeAg) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadAg) {
                        scope.$apply(function() {
                            fn(scope, {
                                $fileContent: onLoadAg.target.result
                            });
                        });
                    };

                    reader.readAsText((onChangeAg.srcElement || onChangeAg.target).files[0]);
                });
            }
        };
    });
