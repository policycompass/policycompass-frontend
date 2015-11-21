/**
 * Services for connecting to the Rating Manager.
 * Those factories provide adapters for the RESTful API of the Rating Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.ratings.services.ratingsService', [
    'ngResource',
    'ng',
    'pcApp.config'
])

/**
 * Factory for getting a Resource, which connects to the unit endpoint
 */
    .factory('RatingsService', [
        '$resource', '$cacheFactory', '$timeout', 'API_CONF', function ($resource, $cacheFactory, $timeout, API_CONF) {
            var myCache = $cacheFactory('RatingsService');
            var myResource = $resource(API_CONF.RATINGS_MANAGER_URL + "/ratings/:id", {
                id: "@id"
            }, {
                'update': {
                    method: 'POST'
                }
            });

            return {
                retrieve: function (data, success, error) {
                    var cacheKey = data.id;
                    var cached = myCache.get(cacheKey);

                    if (!cached) {
                        myResource.get(data, function (response) {
                            $timeout(function () {
                                myCache.put(cacheKey, response);
                            }, 0);
                            success(response);
                        }, error);
                    } else {
                        success(cached);
                    }
                },
                rate: function (data, success, error) {
                    var cacheKey = data.id;
                    myResource.update(data, function (response) {
                        $timeout(function () {
                            myCache.put(cacheKey, response);
                        }, 0);
                        success(response);
                    }, error);
                }
            };
        }
    ]);
