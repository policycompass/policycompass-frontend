/**
 * Services for connecting to the Feedback Manager.
 * Those factories provide adapters for the RESTful API of the Feedback Manager.
 * They are built on top of AngularJS' Resource module.
 */

angular.module('pcApp.feedbacks.services.feedbacksService', [
    'ngResource',
    'ng',
    'pcApp.config'
])
    .factory('Feedback', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.FEEDBACK_MANAGER_URL + '/feedbacks/:id';
            var Feedback = $resource(url, {
                id:'@id'
            }, {
                save: {
                    method: 'POST'
                }
            });

            Feedback.saveFeedback = function(name, email, subject, message){
                return this.save({name:name, email:email,subject:subject,message:message})
            };
            return Feedback;
         }
    ])
