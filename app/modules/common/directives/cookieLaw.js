/**
 * Directives for Cookie Law
 */

angular.module('pcApp.common.directives.cookieLaw', ['ngCookies'])

    .directive('cookieLaw', ['$cookies', function($cookies){
        return{
            restrict: 'A',
            templateUrl:'modules/common/partials/cookieLaw.html',
            link: function(scope){
                if(!$cookies.closedCookieLaw){
                    scope.hideCookieLaw  = false;
                }
                else{
                    scope.hideCookieLaw  = true;
                }

                scope.closeCookieLaw = function(){
                    scope.hideCookieLaw  = true;
                    $cookies.closedCookieLaw = 'true';
                    console.log("$cookies.closedCookieLaw " + $cookies.closedCookieLaw);
                }
            },

        };
    }]);


