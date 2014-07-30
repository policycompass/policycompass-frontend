angular.module('pcApp.events.controllers.event', [
    'pcApp.events.services.event',
    'pcApp.references.services.reference'
])

    .controller('EventsController', ['$scope', 'Event', '$log', function ($scope, Event, $log) {
        $scope.events = Event.query(
            null,
            function (eventList) {
            },
            function (error) {
                alert(error.data.message);
            }
        );

    }])

    .controller('EventDetailController', [
        '$scope',
        '$routeParams',
        '$location',
        'Event',
        '$log',
        function ($scope, $routeParams, $location, Event, $log) {

            $scope.event = Event.get({id: $routeParams.eventId},
                function (event) {
                },
                function (error) {
                    alert(error.data.message);
                }
            );

            $scope.deleteEvent = function (event) {
                event.$delete(
                    {},
                    function () {
                        $location.path('/events');
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
