/**
 * Entry point of the Feedback Manager module
 */

angular.module('pcApp.feedbacks', [
    'pcApp.feedbacks.directives.feedbacksDirectives',
    //'pcApp.feedbacks.services.feedbacksServices',
    'pcApp.feedbacks.controllers.feedback'
])

/**
 * The routes are configured and connected with the respective controller here
 */

    .config(function($routeProvider){
        $routeProvider
            .when('/feedbacks',{
                //template: "HALLO"
            })
            .when('/feedbacks/create', {
                controller: 'CreateFeedbackController',
                templateUrl: 'modules/feedbacks/partials/create.html'
            })

            .otherwise({redirectTo: '/'});
    });
