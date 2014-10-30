angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.references.services.reference'
])

    .controller('EventsController', ['$scope', 'Event', '$log', '$routeParams', function ($scope, Event, $log, $routeParams) {
        $scope.events = Event.query(
            {page: $routeParams.page},
            function(eventList) {
            },
            function(error) {
                throw { message: JSON.stringify(err.data)};
            }
        );

    }])

    .controller('EventDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Event',
        'LinkedEventVisualization',
        'dialogs',
        '$log',
        function ($scope, $routeParams, $location, Event, LinkedEventVisualization, dialogs, $log) {

            $scope.event = Event.get({id: $routeParams.eventId},
                function (event) {
                },
                function (error) {
                    alert(error.data.message);
                }
            );

            $scope.deleteEvent = function(event) {
                // Open a confirmation dialog
                var dlg = dialogs.confirm(
                    "Are you sure?",
                        "Do you want to delete the Event '" + event.title + "' permanently?");
                dlg.result.then(function () {
                    // Delete the metric via the API
                    event.$delete(
                        {},
                        function(){
                            $location.path('/events');
                        }
                    );
                });
            };


            $scope.linked_event_visualization = LinkedEventVisualization.get({id: $routeParams.eventId},
                function(linked_event_visualization) {
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }
            );
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
                function(event) {
                },
                function(err) {
                    throw { message: JSON.stringify(err.data)};
                }
            );

            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                Event.update($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    },
                    function (err) {
                        throw { message: err.data};
                    }
                );
            };
        }])

    .controller('EventCreateController', [
        '$scope',
        'Event',
        '$location',
        '$log',
        function ($scope, Event, $location, $log) {

            $scope.mode = "create";

            $scope.createEvent = function () {
                $scope.event.userID = 1;
                $scope.event.viewsCount = 1;

                Event.save($scope.event, function (value, responseHeaders) {
                        $location.path('/events/' + value.id);
                    },
                    function (err) {
                        throw { message: err.data};
                    }
                );
            };
        }]);
