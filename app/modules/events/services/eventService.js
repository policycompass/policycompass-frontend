angular.module('pcApp.events.services.event', [
    'ngResource', 'pcApp.config'
])
/**
 * Factory for the Resource of events
 */
    .factory('Event', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.EVENTS_MANAGER_URL + "/events/:id";
            var Event = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Event;


        }
    ])

    .factory('LinkedEventVisualization', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByEvent?historical_event_id=:id";
            var LinkedEventVisualization = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return LinkedEventVisualization;
        }
    ])

    .factory('Languages', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.REFERENCE_POOL_URL + "/languages/:id";
            var Language = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Language;
        }
    ])

    /*    .factroy('searchEvent', function($resource){
     return $resource(API_CONF.EVENTS_MANAGER_URL + '/harvestevents',{
     keyword: '@keyword',
     extractors: '@extractors', isArray:true,
     start: '@start',
     end: '@end'
     });
     })*/

    .service('eventService', function () {
        var eventList = [];
        var isSet = false;

        var addEvent = function (newObj) {
            eventList.push(newObj);
            isSet = true;
        };

        var removeEvent = function () {
            eventList = [];
        };

        var getEvent = function () {
            return eventList;
            //isSet = false;
        };

        return {
            addEvent: addEvent,
            removeEvent: removeEvent,
            getEvent: getEvent
        };

    });
