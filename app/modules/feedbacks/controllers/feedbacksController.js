/**
 * Module for all Feedbacks Controllers
 */

angular.module('pcApp.feedbacks.controllers.feedback', ['pcApp.feedbacks.services.feedbacksService'])

    .factory('CreateFeedbackControllerHelper', function(){
        return {
            sendFeedback: function(feedback){
                return true;
            }
        };
    })

    .controller('CreateFeedbackController',function($scope, CreateFeedbackControllerHelper, Feedback){
        $scope.createFeedbackControllerHelper = CreateFeedbackControllerHelper;
        $scope.feedback = Feedback;

        $scope.submit = function(){
            $scope.submitted = true;
            $scope.feedback.saveFeedback($scope.name_text, $scope.email_address, $scope.subject_text, $scope.message_text);
        }

    })

    .controller('OpenFeedbackModal', function($scope, $modal){
        $scope.open = function() {
            $modalInstance = $modal.open({
                templateUrl: 'feedback-modal.html',
                backdrop: true,
                windowClass: 'modal',
                controller: function ($scope, CreateFeedbackControllerHelper, Feedback) {
                    $scope.createFeedbackControllerHelper = CreateFeedbackControllerHelper;
                    $scope.feedback = Feedback;

                    $scope.submit = function () {
                        $scope.submitted = true;
                        $scope.feedback.saveFeedback($scope.name_text, $scope.email_address, $scope.subject_text, $scope.message_text);
                    }
                },
            });
        }

        $scope.cancel = function(){
            $modalInstance.close();
        };
    });

