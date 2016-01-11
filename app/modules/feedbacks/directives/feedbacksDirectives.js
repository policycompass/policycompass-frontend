/**
 * Directives for Feedback Manager
 */

angular.module('pcApp.feedbacks.directives.feedbacksDirectives', [])

    .directive('openFeedbackModal', function($modal,$location){
        return{
            restrict: 'E',
            scope:false,
            link: function(scope){
                scope.open = function(){
                    $modalInstance = $modal.open({
                        templateUrl: 'feedback-modal',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope,CreateFeedbackControllerHelper, Feedback) {
                            $scope.createFeedbackControllerHelper = CreateFeedbackControllerHelper;
                            $scope.feedback = Feedback;
                            $scope.submit = function () {
                                $scope.submitted = true;
                                $scope.feedback.saveFeedback($scope.name_text, $scope.email_address, $scope.subject_text, $scope.message_text, $location.absUrl());
                            }
                        }
                    });
                }
            },
            templateUrl:'modules/feedbacks/partials/feedbackModal.html'
        };
    })
       .directive('cancelButton', function(){
        return {
            restrict: 'E',
            scope: false,
            link: function(scope){
                scope.cancel = function(){
                    $modalInstance.close();
                }

            },
            template:"<a type='button' class='btn btn-danger' ng-click='cancel()'>Cancel</a>"
        };
    });


