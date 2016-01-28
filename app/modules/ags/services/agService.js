angular.module('pcApp.ags.services.ag', [
        'ngResource', 'pcApp.config'
    ])
    /**
     * Factory for the Resource of ags
     */
    .factory('Ag', [
        '$resource', 'API_CONF',
        function($resource, API_CONF) {
            var url = API_CONF.AG_MANAGER_URL + "/ags/:id";
            var Ag = $resource(url, {
                id: "@id"
            }, {
                'update': {
                    method: 'PUT'
                },
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Ag;
        }
    ])

.service('agService', function() {
    var agList = [];
    var isSet = false;

    var addAg = function(newObj) {
        agList.push(newObj);
        isSet = true;
    };

    var removeAg = function() {
        agList = [];
    };

    var getAg = function() {
        return agList;
        //isSet = false;
    };

    return {
        addAg: addAg,
        removeAg: removeAg,
        getAg: getAg
    };

});
