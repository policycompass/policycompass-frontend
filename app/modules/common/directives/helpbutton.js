angular.module('pcApp.common.directives.helpbutton', [])//exemple of use:
//<span class="helpbutton"></span>

    .directive('helpbutton', [
        '$log', 'API_CONF', function ($log, API_CONF) {

            return {
                restrict: 'C',
                scope: {},
                controller: function ($scope, $element, $attrs, $location, dialogs) {

                    $scope.showhelp = function () {
                        $('body').chardinJs('start');
                    }
                },

                template: '' + '<button type="button" ng-click="showhelp()" class="chardinhelpbutton btn btn-default" >View help</button>'
            };
        }
    ])


;
