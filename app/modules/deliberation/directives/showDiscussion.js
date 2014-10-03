angular.module('pcApp.deliberation.directives.showDiscussion', [
    'pcApp.adhocracyEmbedder.services.adhocracy',
])

.directive('showDiscussion', ['Adhocracy', function (Adhocracy) {
    return {
        restrict: 'E',
        scope: {
            path: '@'
        },
        link: function(scope, element, attrs) {
            Adhocracy.then(function (adh) {
                element.append(adh.getIframe('comment-listing', {
                    path: scope.path
                }))
            });
        }
    };
}]);
