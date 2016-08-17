angular.module('pcApp.references.directives.resolve', [
    'pcApp.references.services.reference'
])

    .directive('resolveLanguage', [
        '$log', 'Language', function ($log, Language) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.language = Language.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ language.title }}</span>'
            };
        }
    ])

    .directive('resourceTitle', [
        '$log', '$injector', function ($log, $injector) {
            return {
                restrict: 'AEC',
                scope: {
                    id: '=',
                    resource: '@'
                },
                link: function (scope, element, attrs, ctrls) {
                    var service = $injector.get(scope.resource);
                    scope.model = service.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ model.title }}</span>'
            };
        }
    ])

    .directive('resolveUnit', [
        '$log', 'Unit', function ($log, Unit) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.unit = Unit.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ unit.title }}</span>'
            };
        }
    ])

    .directive('resolveIndividual', [
        '$log', 'Individual', function ($log, Individual) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.individual = Individual.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ individual.title }}</span>'
            };
        }
    ])

    .directive('resolvePolicydomain', [
        '$log', 'PolicyDomain', function ($log, PolicyDomain) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.policydomain = PolicyDomain.get({id: scope.id}, function () {
                    });
                },
                template: '<span>{{ policydomain.title }}</span>'
            };
        }
    ])

    .directive('resolveLicense', [
        '$log', 'License', function ($log, License) {
            return {
                scope: {
                    id: '='
                },
                link: function (scope, element, attrs, ctrls) {
                    scope.license = License.get({id: scope.id}, function () {
                    });
                },
                template: '<a href="{{license.url}}" target="_blank">{{ license.title }}</a>'
            };
        }
    ]);
