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

