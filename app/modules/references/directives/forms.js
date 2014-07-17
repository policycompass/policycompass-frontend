angular.module('pcApp.references.directives.forms', [
    'pcApp.references.services.reference'
])

.directive('unitOptions', ['$log', 'Unit', function ($log, Unit) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        controller: function($scope){
            $scope.units = Unit.query(
                null,
                function() {
                    //$log.info($scope.units);
                }
            );
        },
        template: '<option value="{{ u.id }}" ng-repeat="u in units" ng-selected="u.id == model">{{ u.title }}</option>'
    };
}])

.directive('policydomainOptions', ['$log', 'PolicyDomain', function ($log, PolicyDomain) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        controller: function($scope){
            $scope.domains = PolicyDomain.query(
                null,
                function() {
                    $log.info($scope.domains);
                }
            );
        },
        template: '<option value="{{ d.id }}" ng-repeat="d in domains" ng-selected="d.id == model" >{{ d.title }}</option>'
    };
}])

.directive('languageOptions', ['$log', 'Language', function ($log, Language) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        controller: function($scope){
            $scope.languages = Language.query(
                null,
                function() {
                    //$log.info($scope.units);
                }
            );
        },
        template: '<option value="{{ l.id }}" ng-repeat="l in languages" ng-selected="l.id == model">{{ l.title }}</option>'
    };
}]);