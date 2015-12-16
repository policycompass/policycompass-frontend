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
