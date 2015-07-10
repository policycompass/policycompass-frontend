angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.references.services.reference',
    'pcApp.config'
])

    .controller('EventsController', ['$scope', 'Event', '$log', '$routeParams', function ($scope, Event, $log, $routeParams) {
        $scope.events = Event.query(
            {page: $routeParams.page},
            function (eventList) {
            },
            function (error) {
                throw {message: JSON.stringify(err.data)};
            }
        );
    }])

    .controller('EventDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Event',
        'LinkedEventVisualization',
        'Languages',
        'dialogs',
        '$log',
        function ($scope, $routeParams, $location, Event, LinkedEventVisualization, Languages, dialogs, $log) {

            $scope.event = Event.get({id: $routeParams.eventId},
                function (event) {
                },
                function (error) {
                    alert(error.data.message);
                }
            );

            $scope.deleteEvent = function (event) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm(
                    "Are you sure?",
                    "Do you want to delete the Event '" + event.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    event.$delete(
                        {},
                        function () {
                            $location.path('/events');
                        }
                    );
                });
            };


            $scope.linked_event_visualization = LinkedEventVisualization.get({id: $routeParams.eventId},
                function (linked_event_visualization) {
                },
                function (err) {
                    throw {message: JSON.stringify(err.data)};
                }
            );

            $scope.event.$promise.then(function (event) {
                $scope.language = Languages.get({id: event.languageID},
                    function (language) {
                    },
                    function (err) {
                        throw {message: JSON.stringify(err.data)};
                    }
                );
            });

        }])

    .controller('EventEditController', [
        '$scope',
        '$routeParams',
        'Event',
        '$location',
        '$log',
        function ($scope, $routeParams, Event, $location, $log) {

            $scope.mode = "edit";

            $scope.event = Event.get({id: $routeParams.eventId},
                function (event) {
                },
                function (err) {
                    throw {message: JSON.stringify(err.data)};
                }
            );

            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                Event.update($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    },
                    function (err) {
                        throw {message: err.data};
                    }
                );
            };
        }])

    .controller('EventCreateController', [
        '$scope',
        'Event',
        '$location',
        '$log',
        'eventService',
        function ($scope, Event, $location, $log, eventService) {

            $scope.mode = "create";

            if (angular.toJson(eventService.getEvent()) != "[]") {
                console.log(angular.toJson(eventService.getEvent()));
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

            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                Event.save($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    },
                    function (err) {
                        throw {message: err.data};
                    }
                );
            };
        }])

    .controller('EventSearchController', [
        '$scope',
        '$filter',
        'Event',
        '$location',
        '$log',
        '$http',
        'API_CONF',
        'eventService',
        function ($scope, $filter, Event, $location, $log, $http, API_CONF, eventService) {

            $scope.step = 'one';
            $scope.nextStep = function () {

            };

            $scope.prevStep = function () {
                $scope.step = 'one';
            };

            $scope.search = {};
            $scope.searchResults = [];
            $scope.searchEvent = function () {
                $http.get(API_CONF.EVENTS_MANAGER_URL + '/harvestevents?keyword=' + $scope.search.title + '&start=' +
                    $filter('date')($scope.search.startEventDate, "yyyy-MM-dd") + '&end=' +
                    $filter('date')($scope.search.endEventDate, "yyyy-MM-dd")).

                    success(function (data, status, headers, config) {
                        //console.log(angular.toJson(data));
                        $scope.searchResults = data;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                try {
                    $scope.step = 'second';
                }
                catch (err) {
                    console.log(err);
                }
            };
            $scope.selectEvent = function () {
                //console.log(angular.toJson($scope.searchResults[$scope.search.selectedEvent[0]]));
                eventService.addEvent($scope.searchResults[$scope.search.selectedEvent[0]]);
                //console.log("addEvent:" + angular.toJson(eventService.getEvent()));
                $location.path('/events/create');
            };
        }]);
