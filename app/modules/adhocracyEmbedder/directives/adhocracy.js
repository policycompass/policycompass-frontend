angular.module('pcApp.adhocracyEmbedder.directives.adhocracy', [])

    .directive('adhCrossWindowChannel', [
        'AdhocracyCrossWindowChannel', function (AdhocracyCrossWindowChannel) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    AdhocracyCrossWindowChannel.then(function(iframe) {
                        element.append(iframe);
                    });
                }
            };
        }
    ]);
