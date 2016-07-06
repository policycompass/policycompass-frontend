angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.events.directives.eventDirectives',
    'pcApp.references.services.reference',
    'pcApp.config'
])
/**
 * Controller to list events
 */
    .controller('EventsController', [
        '$scope', 'Event', '$routeParams', function ($scope, Event, $routeParams) {
            $scope.events = Event.query({page: $routeParams.page}, function (eventList) {
            }, function (err) {
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
        'PolicyDomain',
        'Individual',
        function ($scope, $routeParams, $location, Event, LinkedEventVisualization, Languages, dialogs, $log, Auth, PolicyDomain, Individual) {

            $scope.userState = Auth.state;

            $scope.event = Event.get({id: $routeParams.eventId}, function (event) {
                var domains = [];
                var individuals = [];
                event.policy_domains.forEach(function (p) {
                    domains.push(PolicyDomain.getById(p))
                });
                event.policy_domains = domains;

                event.spatials.forEach(function(i){
                    individuals.push(Individual.getById(i))
                });
            }, function (error) {
                $location.path('/browse');
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
                $scope.spatials = {
                    input: $scope.event.spatials,
                    output: []
                };
            }, function (err) {
                $location.path('/browse');
            });



            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                $scope.event.spatials = $scope.spatials.output;

                Event.update($scope.event, function (value, responseHeaders) {
                    $location.path('/events/' + value.id);
                }, function (err) {
                    throw {message: JSON.stringify(err.data)};
                });
            };

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
        '$filter',
        '$routeParams',
        function ($scope, Event, $location, $log, dialogs, eventService, Auth, $filter, $routeParams) {

            $scope.userState = Auth.state;

            $scope.mode = "create";

            $scope.init = function () {
                //Default search query
                if(typeof $scope.event === 'undefined'){
                    $scope.event = {};
                    $scope.event.title =  $routeParams.title || "";
                    $scope.event.keywords = $routeParams.keywords || "";
                    $scope.event.spatials = $routeParams.spatials || "";
                    $scope.event.detailsURL = $routeParams.detailsURL || "";
                    $scope.event.description = $routeParams.description || "";
                    $scope.event.startEventDate = $routeParams.start || "";
                    $scope.event.endEventDate = $routeParams.end || "";
                    $scope.event.languageID = $routeParams.language || "";
                }
            }



            if (angular.toJson(eventService.getEvent()) != "[]") {
                //console.log(angular.toJson(eventService.getEvent()));
                var endDate = '';
                if(typeof eventService.getEvent()[0]['endDate'] === "undefined"){
                    endDate = '2099-01-01';
                }
                else{
                    endDate = eventService.getEvent()[0]['endDate'];
                }
                $scope.event = {
                    title: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    keywords: angular.toJson(eventService.getEvent()[0]['title']).replace(/\"/g, ""),
                    detailsURL: angular.toJson(eventService.getEvent()[0]['url']).replace(/\"/g, ""),
                    description: angular.toJson(eventService.getEvent()[0]['description']).replace(/\"/g, ""),
                    startEventDate: angular.toJson(eventService.getEvent()[0]['date']).replace(/\"/g, ""),
                    endEventDate: angular.toJson(endDate).replace(/\"/g, ""),
                    //spatials: $scope.spatials.output,
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
                    $scope.event.spatials = $scope.spatials.output;
                    Event.save($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    }, function (err) {
                        throw {message: JSON.stringify(err.data)};
                    });
                }
            };

            $scope.saveParameters = function(){
                $location.search('title', $scope.event.title);
                $location.search('keywords', $scope.event.keywords);
                $location.search('detailsURL', $scope.event.detailsURL);
                $location.search('description', $scope.event.descritption);
                $location.search('spatials', $scope.event.spatials);
                $location.search('start', $scope.event.startEventDate);
                $location.search('end', $scope.event.endEventDate);
                $location.search('language', $scope.event.languageID)
            }


            $scope.init();
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
        '$anchorScroll',
        'ngProgress',
        function ($scope, $filter, Event, $location, $log, $http, API_CONF, eventService, Auth, dialogs, $routeParams, $anchorScroll, ngProgress) {

            $scope.userState = Auth.state;

            $scope.step = 'one';
            $scope.nextStep = function () {

            };

            $scope.prevStep = function () {
                $scope.step = 'one';
            };

            $scope.search = {};
            $scope.availableExtractors = [];


            var showPerPage;


            $scope.init = function () {
                $activeTab = 0;
                $scope.searched = false;
                //Set Pagination defaults
                //Default value for how many pages to show in the page navigation control
                $scope.paginationSize = 5;
                //Default values for how many items per page
                $scope.itemsperPage = 10;

                //showPerPage = $routeParams.show-0 || 10;

                //Default search query
                $scope.search_title =  $routeParams.q || "";
                $scope.search.startRange = $routeParams.start || "";
                $scope.search.endRange = $routeParams.end || "";
                //$scope.wikiTitle = $routeParams.wikiTitle || "";

                $scope.selectedExtractors = [];

                $scope.searchResults = eventService.getSearchResults();
                $scope.wikiSearchResults = eventService.getWikiSearchResults();


                //Default sort
                $scope.sortByItem = 'Relevance';
                //Default current page
                $scope.currentPage = $routeParams.page || 1;


                var sortBy = $routeParams.sort;
                angular.forEach($scope.sortOptions, function(option) {
                    if (option.id === sortBy){
                        $scope.sortByItem = sortBy;
                        $scope.selectedSortItem = option;
                    }
                });


                var showPerPage = $routeParams.show-0 || 10;

                angular.forEach($scope.itemsPerPageChoices, function(option) {
                    if (option.id === showPerPage){
                        $scope.itemsperPage = showPerPage;
                        $scope.selectedItemPerPage = option;
                    }
                });


                $http.get(API_CONF.EVENTS_MANAGER_URL + '/getextractor').

                    success(function (data, status, headers, config) {
                        data[1].valid=true;
                        //console.log(angular.toJson(data));
                        $scope.availableExtractors = data;

                        $scope.availableExtractors.forEach(function (extractor){
                            $scope.selectedExtractors.push(extractor.name);
                        });

                        if($routeParams.extractors instanceof Array){
                            $scope.selectedExtractors = $routeParams.extractors;
                        }
                        else if(typeof $routeParams.extractors !== "undefined"){
                            $scope.selectedExtractors.push($routeParams.extractors);
                        }

                        $scope.searchEvent();

                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            };

            $scope.saveParameters = function() {

                if ($scope.search.startRange) {
                    $scope.search.startRange = $filter('date')(new Date($scope.search.startRange), 'yyyy-MM-dd');
                }

                if($scope.search.endRange){
                    $scope.search.endRange = $filter('date')(new Date($scope.search.endRange), 'yyyy-MM-dd');
                }

                $location.search('extractors' , $scope.selectedExtractors);

                if($routeParams.q !== $scope.search_title){
                    $location.search('page', 1);
                }
                else{
                    $location.search('page', $scope.currentPage);
                }

                $location.search('q', $scope.search_title);

                $location.search('start', $scope.search.startRange);
                $location.search('end', $scope.search.endRange);

                $location.search('show', $scope.itemsperPage);

                $location.search('sort', $scope.sortByItem);

                $location.search('wikiTitle' , $scope.wikiTitle);
            }

            //Define function that fires search when page changes
            $scope.pageChanged = function () {
                if (typeof $scope.totalItems === "undefined") {
                    if ($routeParams.hasOwnProperty("page") && $scope.currentPage != $routeParams.page)
                        $scope.currentPage = $routeParams.page;
                    return;
                }

                $scope.itemOffset = ($scope.currentPage - 1 ) * $scope.itemsperPage;

                switch($scope.activeTab){
                    case 0: {
                        $scope.fillSearchResults($scope.searchResultsTotal);
                        $scope.totalItems = $scope.searchResultsTotal.length;
                    }
                        break;
                    case 1: {
                        //$scope.totalItems = $scope.wikipedia_title_results;
                    }
                        break;
                    case 2: {
                        $scope.fillWikiSearchResults($scope.wikiSearchResultsTotal);
                        $scope.totalItems = $scope.wikiSearchResultsTotal.length;
                    }
                        break;
                }

                $scope.goToTop();
            };


            //Define function that fires search when Items Per Page selection box changes
            $scope.itemsPerPageChanged = function () {
                $scope.itemsperPage = $scope.selectedItemPerPage.id;
                $location.search('show', $scope.itemsperPage);
                $scope.searchEvent();
            };


            //Define function that fires search when Sort By selection box changes
            $scope.sortItemsChanged = function () {
                $scope.sortByItem = $scope.selectedSortItem.id;
                $location.search('sort', $scope.sortByItem);
                $scope.searchEvent();
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

            //Sort the Search Results by Selected Sort Item
            var sortByKey = function(array,key){
                return array.sort(function(a,b){
                    var x = a[key];
                    var y = b[key];
                    return((x<y)? -1 : ((x>y) ? 1 : 0));
                })
            }

            $scope.fillSearchResults = function(data){

                $scope.searchResultsTotal = data;
                $scope.searchResultsTotal = sortByKey($scope.searchResultsTotal, $scope.sortByItem);

                var searchResults = [];

                var length = $scope.itemOffset+$scope.itemsperPage;

                if(length > $scope.searchResultsTotal.length){
                    length = $scope.searchResultsTotal.length;
                }

                for(var i = $scope.itemOffset; i < length; i++){
                    searchResults[i-$scope.itemOffset] = $scope.searchResultsTotal[i];
                }
                eventService.setSearchResults(searchResults);
                $scope.searchResults = searchResults;
            }

            $scope.fillWikiSearchResults = function(data){

                $scope.wikiSearchResultsTotal = data;
                $scope.wikiSearchResultsTotal = sortByKey($scope.wikiSearchResultsTotal, $scope.sortByItem);

                var wikiSearchResults = [];

                var length = $scope.itemOffset+$scope.itemsperPage;


                if(length > $scope.wikiSearchResultsTotal.length){
                    length = $scope.wikiSearchResultsTotal.length;
                }

                for(var i = $scope.itemOffset; i < length; i++){
                    wikiSearchResults[i-$scope.itemOffset] = $scope.wikiSearchResultsTotal[i];
                }

                eventService.setWikiSearchResults(wikiSearchResults);
                $scope.wikiSearchResults = wikiSearchResults;
            }


            $scope.searchEvent = function () {
                if($scope.search_title.length > 0) {
                    ngProgress.start();
                    var startRange, endRange;

                    if (!$scope.search.startRange) {
                        startRange = "0001-01-01";
                    }
                    else {
                        startRange = $scope.search.startRange;
                    }
                    if (!$scope.search.endRange) {
                        endRange = "2099-12-31";
                    }
                    else {
                        endRange = $scope.search.endRange;
                    }

                    $scope.itemOffset = ($scope.currentPage - 1 ) * $scope.itemsperPage;

                    var selectedExtractors = selectedExtractorsWithoutWiki();

                    $http.get(
                        API_CONF.EVENTS_MANAGER_URL +
                        '/harvestevents?keyword=' +
                        $scope.search_title +
                        '&extractors=' +
                        selectedExtractors +
                        '&start=' +
                        $filter('date')(startRange, "yyyy-MM-dd") +
                        '&end=' +
                        $filter('date')(endRange, "yyyy-MM-dd")).

                    success(function (data, status, headers, config) {
                        //console.log("data " + angular.toJson(data));
                        $scope.wikiSearchResults = [];
                        $scope.fillSearchResults(data);
                        $scope.totalItems = $scope.searchResultsTotal.length;
                        $scope.searched = true;
                        $scope.wikipedia_event_active = false;
                        ngProgress.complete();

                    }).error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                    $http.get(
                        "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + $scope.search_title
                    ).success(function (data, status, headers, config) {
                        $scope.searched = true;
                        $scope.wikipedia_title_results = data[1];
                    }).error(function (data, status, headers, config) {
                        ngProgress.complete();
                    });

                }
                else{
                    $scope.searchResults = [];
                }

            };

            $scope.searchForWikipediaEvents = function(wiki_title){
                ngProgress.start();
                $scope.wikiTitle = wiki_title;
                $scope.wikiSearchResults = [];
                var startRange, endRange;

                if (!$scope.search.startRange) {
                    startRange = "0001-01-01";
                }
                else {
                    startRange = $scope.search.startRange;
                }
                if (!$scope.search.endRange) {
                    endRange = "2099-12-31";
                }
                else {
                    endRange = $scope.search.endRange;
                }

                $scope.itemOffset = ($scope.currentPage - 1 ) * $scope.itemsperPage;


                $http.get(
                    API_CONF.EVENTS_MANAGER_URL +
                    '/harvestevents?keyword=' +
                    wiki_title +
                    '&extractors=' +
                    'Wikipedia' +
                    '&start=' +
                    $filter('date')(startRange, "yyyy-MM-dd") +
                    '&end=' +
                    $filter('date')(endRange, "yyyy-MM-dd")).

                success(function (data, status, headers, config) {
                    //console.log("data " + angular.toJson(data));
                    $scope.fillWikiSearchResults(data);
                    $scope.wikiTotalItems = $scope.wikiSearchResultsTotal.length;
                    $scope.totalItems = $scope.wikiSearchResultsTotal.length;
                    $scope.searched = true;
                    $scope.wikipedia_event_active = true;
                    if(data.length == 0){
                        dialogs.notify('Events from selected Wikipedia article cannot be extracted', 'Please choose another article.');
                    }
                    ngProgress.complete();

                }).error(function (data, status, headers, config) {
                    ngProgress.complete();
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

            };

            var selectedExtractorsWithoutWiki = function(){
                var _extractors = [];
                $scope.selectedExtractors.forEach(function (selectedExtractor) {
                    if(selectedExtractor != 'Wikipedia'){
                        _extractors.push(selectedExtractor);
                    }
                });

                return _extractors;
            }


            $scope.selectEvent = function () {
                eventService.addEvent($scope.search.selectedEvent);
                $scope.saveParameters();
                $location.path('/events/create');
            };

            $scope.goToTop = function(){
                var old = $location.hash();
                $location.hash('top');
                $anchorScroll();
                $location.hash(old);
            };


            $scope.$on('$routeUpdate', function(){
                $scope.init();
            });

            $scope.setActiveTab = function(_active){
                $scope.currentPage = 1;
                $scope.activeTab = _active;
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
