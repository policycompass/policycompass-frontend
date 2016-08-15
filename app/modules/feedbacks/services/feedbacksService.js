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

            Feedback.saveFeedback = function(name, email, subject, message, link, category_id){
                return this.save({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    link: link,
                    category_id: category_id
                })
            };
            return Feedback;
         }
    ])
    .factory('FeedbackCategory', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.FEEDBACK_MANAGER_URL + "/categories/:id";
            var Language = $resource(url, {
                id: "@id"
            }, {
                get: {
                    method: 'GET',
                    cache: true
                },
                query: {
                    method: 'GET',
                    cache: true,
                    isArray: true
                }
            });
            return Language;
        }
    ])
