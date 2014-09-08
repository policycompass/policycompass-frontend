/**
 * Collection of directives to make the data of the Reference Pool available as HTML select boxes.
 */

angular.module('pcApp.references.directives.forms', [
    'pcApp.references.services.reference'
])

/**
 * Returns HTML option tags for the selection of the unit
 */
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

/**
 * Returns HTML option tags for the selection of the policy domain
 */
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
                    //$log.info($scope.domains);
                }
            );
        },
        template: '<option value="{{ d.id }}" ng-repeat="d in domains" ng-selected="d.id == model" >{{ d.title }}</option>'
    };
}])

/**
 * Returns HTML option tags for the selection of the language
 */
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
}])

/**
 * Returns HTML option tags for the selection of external resource
 */
.directive('externalResourceOptions', ['$log', 'ExternalResource', function ($log, ExternalResource) {
    return {
        restrict: 'C',
        scope: {
            model: '=model'
        },
        controller: function($scope){
            $scope.externalResources = ExternalResource.query(
                null,
                function() {
                    //$log.info($scope.units);
                }
            );
        },
        // External Resource can be None, so there is an extra option for that case
        template: '<option value="0"  ng-selected="model == 0">None</option>' +
            '<option value="{{ e.id }}" ng-repeat="e in externalResources" ng-selected="e.id == model">{{ e.title }}</option>'
    };
}]);