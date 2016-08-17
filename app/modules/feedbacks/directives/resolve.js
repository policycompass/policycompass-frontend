angular.module('pcApp.feedbacks.directives.resolve', [
    'pcApp.feedbacks.services.feedbacksService'
])

    .directive('resolveFeedbackCategory', [
        '$log', 'FeedbackCategory', function ($log, FeedbackCategory) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.feedbackcategory = FeedbackCategory.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ feedbackcategory.title }}</span>'
            };
        }
    ]);
