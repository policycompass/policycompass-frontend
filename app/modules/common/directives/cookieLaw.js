/**
 * Directives for Cookie Law
 */

angular.module('pcApp.common.directives.cookieLaw', ['ngStorage'])

    .directive('cookieLaw', ['$localStorage', function($localStorage){
        return{
            restrict: 'A',
            templateUrl:'modules/common/partials/cookieLaw.html',
            link: function(scope){
                if(!$localStorage.closedCookieLaw){
                    scope.hideCookieLaw  = false;
                }
                else{
                    scope.hideCookieLaw  = true;
                }

                scope.closeCookieLaw = function(){
                    scope.hideCookieLaw  = true;
                    $localStorage.closedCookieLaw = 'true';
                }
            },

        };
    }]);


