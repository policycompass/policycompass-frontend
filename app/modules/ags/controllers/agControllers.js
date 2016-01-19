angular.module('pcApp.ags.controllers.ag', [
    'pcApp.ags.services.ag',
    'pcApp.references.services.reference',
    'pcApp.config'
])
/**
 * Controller to list ags
 */
    .controller('AgsController', [
        '$scope', 'Ag', '$routeParams', function ($scope, Ag, $routeParams) {
            $scope.ags = Ag.query({page: $routeParams.page}, function (agList) {
            }, function (error) {
                throw {message: JSON.stringify(err.data)};
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
        function ($scope, $routeParams, $location, Ag, dialogs, $log, Auth) {

            $scope.userState = Auth.state;

            $scope.ag = Ag.get({id: $routeParams.agId}, function (ag) {
            }, function (error) {
                alert(error.data.message);
            });

            $scope.deleteAg = function (ag) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Ag '" + ag.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    ag.$delete({}, function () {
                        $location.path('/ags');
                    });
                });
            };


        }
    ])
/**
 * Controller to edit a metric
 */
    .controller('AgEditController', [
        '$scope',
        '$routeParams',
        'Ag',
        '$location',
        '$log',
        'Auth',
        function ($scope, $routeParams, Ag, $location, $log, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "edit";

            $scope.ag = Ag.get({id: $routeParams.agId}, function (ag) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            $scope.createAg = function () {
                $scope.ag.userID = 1;
                $scope.ag.viewsCount = 1;

                Ag.update($scope.ag, function (value, responseHeaders) {
                    $location.path('/ags/' + value.id);
                }, function (err) {
                    throw {message: err.data};
                });
            };
        }
    ])
/**
 * Controller to create a metric
 */
    .controller('AgCreateController', [
        '$scope',
        'Ag',
        '$location',
        '$log',
        'dialogs',
        'agservice',
        'Auth',
        function ($scope, Ag, $location, $log, dialogs, agservice, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "create";

            if (angular.toJson(agservice.getAg()) != "[]") {
                console.log(angular.toJson(agservice.getAg()));
                $scope.ag = {
                    title: angular.toJson(agservice.getAg()[0]['title']).replace(/\"/g, ""),
                    keywords: angular.toJson(agservice.getAg()[0]['title']).replace(/\"/g, ""),
                    detailsURL: angular.toJson(agservice.getAg()[0]['url']).replace(/\"/g, ""),
                    description: angular.toJson(agservice.getAg()[0]['description']).replace(/\"/g, ""),
                    startAgDate: angular.toJson(agservice.getAg()[0]['date']).replace(/\"/g, ""),
                    endAgDate: angular.toJson(agservice.getAg()[0]['date']).replace(/\"/g, "")
                }
                agservice.removeAg();
            }

            var compareDates = function(){
                if($scope.agForm.startAgDate.$modelValue > $scope.agForm.endAgDate.$modelValue){
                    dialogs.error('Validation Error', 'Please provide a Start Date which is smaller than the End Date.');
                    return false;
                }
                else return true;
            };


            $scope.createAg = function () {
                $scope.ag.userID = 1;
                if(compareDates()) {
                    $scope.ag.viewsCount = 1;

                    Ag.save($scope.ag, function (value, responseHeaders) {
                        $location.path('/ags/' + value.id);
                    }, function (err) {
                        throw {message: err.data};
                    });
                }
            };
        }
    ])

/**
 * Controller to search and import ags from external resources
 */
    .controller('AgsearchController', [
        '$scope',
        '$filter',
        'Ag',
        '$location',
        '$log',
        '$http',
        'API_CONF',
        'agservice',
        'Auth',
        function ($scope, $filter, Ag, $location, $log, $http, API_CONF, agservice, Auth) {

            $scope.userState = Auth.state;

            $scope.step = 'one';
            $scope.nextStep = function () {

            };

            $scope.prevStep = function () {
                $scope.step = 'one';
            };

            $scope.search = {};
            $scope.searchResults = [];
            $scope.availableExtractors = [];
            $scope.init = function () {
                $http.get(API_CONF.AGS_MANAGER_URL + '/getextractor').

                    success(function (data, status, headers, config) {
                        //console.log(angular.toJson(data));
                        $scope.availableExtractors = data;

                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            };
            $scope.init();
            $scope.selectedExtractors = [];
            $scope.isChecked = function (name) {
                var match = false;
                for (var i = 0; i < $scope.selectedExtractors.length; i++) {
                    if ($scope.selectedExtractors[i] == name) {
                        match = true;
                    }
                }
                return match;
            };

            $scope.sync = function (bool, item) {
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

            //Only for testing
            //$scope.search.title = "war";
            //$scope.search.startAgDate = "1947-05-05";
            //$scope.search.endAgDate = "2010-05-05";

            $scope.searchAg = function () {
                $http.get(API_CONF.AGS_MANAGER_URL + '/harvestags?keyword=' + $scope.search.title + '&extractors=' + $scope.selectedExtractors + '&start=' + $filter('date')($scope.search.startAgDate, "yyyy-MM-dd") + '&end=' + $filter('date')($scope.search.endAgDate, "yyyy-MM-dd")).

                    success(function (data, status, headers, config) {
                        //console.log(angular.toJson(data));
                        $scope.searchResults = data;
                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                try {
                    $scope.step = 'second';
                } catch (err) {
                    console.log(err);
                }
            };
            $scope.selectAg = function () {
                //console.log(angular.toJson($scope.searchResults[$scope.search.selectedAg[0]]));
                agservice.addAg($scope.searchResults[$scope.search.selectedAg[0]]);
                //console.log("addAg:" + angular.toJson(agservice.getAg()));
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
        function ($scope, $window, $route, $log, $http, API_CONF) {
            $scope.showContent = function ($fileContent) {
                $scope.content = $fileContent;
            };
            $scope.ex_added = function () {
                $window.alert("Script added!");
                $route.reload();
            };
            $scope.post = function () {
                //$log.info($scope.modul.name);
                //$log.info($scope.content);
                $http.post(API_CONF.AGS_MANAGER_URL + '/configextractor', {
                    name: $scope.modul.name,
                    script: $scope.content
                }).then(function (response) {
                    if (response) {
                        $scope.ex_added = function () {
                            $window.alert("Script added!");
                            $route.reload();
                        };
                    }
                    // this callback will be called asynchronously
                    // when the response is available
                }, function (response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }
    ])
/**
 * Directive to read files
 */
    .directive('onReadFile', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeAg) {
                    var reader = new FileReader();

                    reader.onload = function (onLoadAg) {
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadAg.target.result});
                        });
                    };

                    reader.readAsText((onChangeAg.srcElement || onChangeAg.target).files[0]);
                });
            }
        };
    });

