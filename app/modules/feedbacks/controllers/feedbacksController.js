/**
 * Module for all Feedbacks Controllers
 */

angular.module('pcApp.feedbacks.controllers.feedback', [])

    .factory('CreateFeedbackControllerHelper', function(){
        return {
            sendFeedback: function(feedback){
                return true;
            }
        };
    })

    .controller('CreateFeedbackController', function($scope, CreateFeedbackControllerHelper, $http, $window){
        $scope.createFeedbackControllerHelper = CreateFeedbackControllerHelper;
        $scope.submit = function(){
            var feedback_data = { subject: $scope.subject_text,
                                message: $scope.message_text};
            $http.post('')

        }
    })
