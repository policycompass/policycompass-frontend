/**
 * Services for connecting to the Story Manager.
 * Those factories provide adapters for the RESTful API of the Story Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.stories.services.storyServices', [
    'ngResource',
    'ng',
    'pcApp.config'
])
    .factory('Story', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.STORY_MANAGER_URL + '/stories/:id';
            var Story = $resource(url, {
                id:'@id'
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Story;
         }
    ])

    .factory('Chapter', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.STORY_MANAGER_URL + '/chapters/:id';
            var Chapter = $resource(url, {
                id:'@id'
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Chapter;
         }
    ])

    .factory('Content', [
        '$resource', 'API_CONF', '$http', function ($resource, API_CONF, $http) {
            var url = API_CONF.STORY_MANAGER_URL + '/contents/:id';
            var Content = $resource(url, {
                id:"@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });

            /*
            Content.createContent = function(){
                return $http({method:"POST", url:url}).then(function(result){
                    return result.data;
                })
            }
            */
            return Content;
         }
    ])

    .service('storyServices', function () {
        var storyList = [];
        var isSet = false;

        var searchResults = [];

        var addStory = function (newObj) {
            storyList.push(newObj);
            isSet = true;
        };

        var removeStory = function () {
            storyList = [];
        };

        var getStory = function () {
            return storyList;
        };

        var setSearchResults = function(results){
            searchResults = results;
        }

        var getSearchResults = function(){
            return searchResults;
        }

        return {
            addStory: addStory,
            removeStory: removeStory,
            getStory: getStory,
            setSearchResults: setSearchResults,
            getSearchResults: getSearchResults
        };
    })


    .service('chapterServices', function () {
        var chapterList = [];
        var isSet = false;

        var searchResults = [];

        var addChapter = function (newObj) {
            chapterList.push(newObj);
            isSet = true;
        };

        var removeChapter = function () {
            chapterList = [];
        };

        var getChapter = function () {
            return chapterList;
        };

        var setSearchResults = function(results){
            searchResults = results;
        }

        var getSearchResults = function(){
            return searchResults;
        }

        return {
            addChapter: addChapter,
            removeChapter: removeChapter,
            getChapter: getChapter,
            setSearchResults: setSearchResults,
            getSearchResults: getSearchResults
        };
    })


    .service('contentServices', function () {
        var contentList = [];
        var isSet = false;

        var searchResults = [];

        var addContent = function (newObj) {
            contentList.push(newObj);
            isSet = true;
        };

        var removeContent = function () {
            contentList = [];
        };

        var getContent = function () {
            return contentList;
        };

        var setSearchResults = function(results){
            searchResults = results;
        }

        var getSearchResults = function(){
            return searchResults;
        }

        return {
            addContent: addContent,
            removeContent: removeContent,
            getContent: getContent,
            setSearchResults: setSearchResults,
            getSearchResults: getSearchResults
        };
    });
