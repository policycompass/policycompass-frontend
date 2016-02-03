angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.references.services.reference',
    'pcApp.config'
])
/**
 * Controller to list events
 */
    .controller('EventsController', [
        '$scope', 'Event', '$routeParams', function ($scope, Event, $routeParams) {
            $scope.events = Event.query({page: $routeParams.page}, function (eventList) {
            }, function (error) {
                throw {message: JSON.stringify(err.data)};
            });
        }
    ])
/**
 * Controller to list details of an event
 */
    .controller('EventDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Event',
        'LinkedEventVisualization',
        'Languages',
        'dialogs',
        '$log',
        'Auth',
        function ($scope, $routeParams, $location, Event, LinkedEventVisualization, Languages, dialogs, $log, Auth) {

            $scope.userState = Auth.state;

            $scope.event = Event.get({id: $routeParams.eventId}, function (event) {
            }, function (error) {
                alert(error.data.message);
            });

            $scope.deleteEvent = function (event) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm("Are you sure?", "Do you want to delete the Event '" + event.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    event.$delete({}, function () {
                        $location.path('/events');
                    });
                });
            };


            $scope.linked_event_visualization = LinkedEventVisualization.get({id: $routeParams.eventId}, function (linked_event_visualization) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            $scope.event.$promise.then(function (event) {
                $scope.language = Languages.get({id: event.languageID}, function (language) {
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            });

        }
    ])
/**
 * Controller to edit a metric
 */
    .controller('EventEditController', [
        '$scope',
        '$routeParams',
        'Event',
        '$location',
        '$log',
        'Auth',
        function ($scope, $routeParams, Event, $location, $log, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "edit";

            $scope.event = Event.get({id: $routeParams.eventId}, function (event) {
            }, function (err) {
                throw {message: JSON.stringify(err.data)};
            });

            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                Event.update($scope.event, function (value, responseHeaders) {
                    $location.path('/events/' + value.id);
                }, function (err) {
                    throw {message: err.data};
                });
            };

            $scope.backToSearch() = function (){
                window.history.back();
            }
        }
    ])
/**
 * Controller to create a metric
 */
    .controller('EventCreateController', [
        '$scope',
        'Event',
        '$location',
        '$log',
        'dialogs',
        'eventService',
        'Auth',
        function ($scope, Event, $location, $log, dialogs, eventService, Auth) {

            $scope.userState = Auth.state;

            $scope.mode = "create";

            if (angular.toJson(eventService.getEvent()) != "[]") {
                //console.log(angular.toJson(eventService.getEvent()));
                $scope.event = {
                    title: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    keywords: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    detailsURL: angular.toJson(eventService.getEvent()[0]['url']).replace(/\"/g, ""),
                    description: angular.toJson(eventService.getEvent()[0]['description']).replace(/\"/g, ""),
                    startEventDate: angular.toJson(eventService.getEvent()[0]['date']).replace(/\"/g, ""),
                    endEventDate: angular.toJson(eventService.getEvent()[0]['date']).replace(/\"/g, ""),
                    languageID: "38"
                }
                eventService.removeEvent();
            }

            var compareDates = function(){
                if($scope.eventForm.startEventDate.$modelValue > $scope.eventForm.endEventDate.$modelValue){
                    dialogs.error('Validation Error', 'Please provide a Start Date which is smaller than the End Date.');
                    return false;
                }
                else return true;
            };


            $scope.createEvent = function () {
                $scope.event.userID = 1;
                if(compareDates()) {
                    $scope.event.viewsCount = 1;

                    Event.save($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    }, function (err) {
                        throw {message: err.data};
                    });
                }
            };

            $scope.backToSearch = function (){
                window.history.back();
            }
        }
    ])

/**
 * Controller to search and import events from external resources
 */
    .controller('EventSearchController', [
        '$scope',
        '$filter',
        'Event',
        '$location',
        '$log',
        '$http',
        'API_CONF',
        'eventService',
        'Auth',
        'dialogs',
        '$routeParams',
        function ($scope, $filter, Event, $location, $log, $http, API_CONF, eventService, Auth, dialogs, $routeParams) {

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
                //Set Pagination defaults
                //Default value for how many pages to show in the page navigation control
                $scope.paginationSize = 5;
                //Default values for how many items per page
                $scope.itemsperPage = 10;

                //Default search query
                $scope.search.title =  $routeParams.q || "";
                $scope.search.startRange = $routeParams.start || "";
                $scope.search.endRange = $routeParams.end || "";

                $scope.selectedExtractors = [];
                if($routeParams.extractors instanceof Array){
                    $scope.selectedExtractors = $routeParams.extractors;
                }
                else if(typeof $routeParams.extractors !== "undefined"){
                    $scope.selectedExtractors.push($routeParams.extractors);
                }

                //Default sort
                $scope.sortByItem = 'Relevance';
                //Default current page
                $scope.currentPage = $routeParams.page || 1;

                $http.get(API_CONF.EVENTS_MANAGER_URL + '/getextractor').

                    success(function (data, status, headers, config) {
                        data[1].valid=true;
                        //console.log(angular.toJson(data));
                        $scope.availableExtractors = data;


                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                $scope.searchEvent();

            };

            /*
            $scope.$on('$routeUpdate', function(){
                $scope.init();
            });

*/
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
                $location.search('extractors' , $scope.selectedExtractors);
            };


            $scope.saveParameters = function(){
                if(!$scope.search.startRange){
                    $scope.search.startRange = "0001-01-01";
                }
                if(!$scope.search.endRange){
                    $scope.search.endRange = "2099-12-31";
                }

                $scope.search.startRange = $filter('date')(new Date($scope.search.startRange), 'yyyy-MM-dd');
                $scope.search.endRange = $filter('date')(new Date($scope.search.endRange), 'yyyy-MM-dd');

                console.log("end " + $scope.search.endRange);
                $location.search('q', $scope.search.title);
                $location.search('start', $scope.search.startRange);
                $location.search('end', $scope.search.endRange);
            }

            //Only for testing
            //$scope.search.title = "war";
            //$scope.search.startEventDate = "1947-05-05";
            //$scope.search.endEventDate = "2010-05-05";

            // Set Search Fire Event
            goSearch = function () {
                if ((typeof $scope.search.title == "undefined") || ($scope.search.title == "")) {
                    searchText = ""
                } else {
                    searchText = $scope.search.title;
                }
                $scope.searchEvent();
            };


            //Define function that fires search when page changes
            $scope.pageChanged = function () {
                if (typeof $scope.totalItems === "undefined") {
                    if ($routeParams.hasOwnProperty("page") && $scope.currentPage != $routeParams.page)
                        $scope.currentPage = $routeParams.page;
                    return;
                }
                $location.search('page', $scope.currentPage);
                goSearch();
            };

            //Define function that fires search when Items Per Page selection box changes
            $scope.itemsPerPageChanged = function () {
                $scope.itemsperPage = $scope.selectedItemPerPage.id;
                $location.search('show', $scope.itemsperPage);
                goSearch();
            };


            //Define function that fires search when Sort By selection box changes
            $scope.sortItemsChanged = function () {
                $scope.sortByItem = $scope.selectedSortItem.id;
                $location.sort('sort', $scope.sortByItem);
                goSearch();
            };

            //Init Sort Options
            $scope.sortOptions = [
                {
                    id: 'relevance',
                    name: 'Relevance'
                }, {
                    id: 'title',
                    name: 'Title'
                }, {
                    id: 'date',
                    name: 'Date'
                }
            ];

            //Init Selectable number of items per page
            $scope.itemsPerPageChoices = [
                {
                    id: 10,
                    name: '10'
                }, {
                    id: 20,
                    name: '20'
                }, {
                    id: 30,
                    name: '30'
                }
            ];


            $scope.searchEvent = function () {
                $http.get(
                    API_CONF.EVENTS_MANAGER_URL +
                    '/harvestevents?keyword=' +
                    $scope.search.title +
                    '&extractors=' +
                    $scope.selectedExtractors +
                    '&start=' +
                    $filter('date')($scope.search.startRange, "yyyy-MM-dd") +
                    '&end=' +
                    $filter('date')($scope.search.endRange, "yyyy-MM-dd")).

                    success(function (data, status, headers, config) {
                        //console.log(angular.toJson(data));
                        $scope.searchResults = data;
                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

            };

            $scope.selectEvent = function () {
                //console.log(angular.toJson($scope.search.selectedEvent));
                eventService.addEvent($scope.search.selectedEvent);
                //console.log("addEvent:" + angular.toJson(eventService.getEvent()));
                $location.path('/events/create');
            };

            $scope.init();
        }
    ])
/**
 * Controller to add and edit a datasource
 */
    .controller('EventConfigController', [
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
                $http.post(API_CONF.EVENTS_MANAGER_URL + '/configextractor', {
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

                element.on('change', function (onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    });

