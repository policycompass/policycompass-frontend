/**
 * Entry point of the Story Manager module
 */

angular.module('pcApp.stories', [
    'pcApp.stories.controllers.storyController',
    'pcApp.stories.directives.storyDirectives',
    'pcApp.stories.services.storyServices',
    'pcApp.references.directives.forms'
])

    .config(function ($routeProvider) {
    $routeProvider
        .when('/stories', {
            redirectTo: '/browse/story'
        })
        .when('/stories/create', {
            controller: 'StoryCreateController',
            templateUrl: 'modules/stories/partials/create.html'
        })
        .when('/stories/search', {
            controller: 'StorySearchController',
            templateUrl: 'modules/stories/partials/search.html'
        })
        .when('/stories/:storyId/edit', {
            controller: 'StoryEditController',
            templateUrl: 'modules/stories/partials/create.html'
        })
        .when('/stories/:storyId', {
            controller: 'StoryDetailController',
            templateUrl: 'modules/stories/partials/detail.html'
        })
        .otherwise({redirectTo: '/'});
});
