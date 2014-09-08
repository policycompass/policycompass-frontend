/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.metrics.directives.ngDropzone', [])

.directive('ngDropzone', function () {
    return {
        restrict: 'AEC',
        template: '<div ng-transclude></div>',
        transclude: true,
        scope: {
            dropzone: '=',
            dropzoneConfig: '=',
            eventHandlers: '='
        },
        link: function(scope, element, attrs, ctrls) {
            try { Dropzone }
            catch (error) {
                throw new Error('Dropzone.js not loaded.');
            }

            var dropzone = new Dropzone(element[0], scope.dropzoneConfig);

            if (scope.eventHandlers) {
                Object.keys(scope.eventHandlers).forEach(function (eventName) {
                    dropzone.on(eventName, scope.eventHandlers[eventName]);
                });
            }

            scope.dropzone = dropzone;
        }
    };
});