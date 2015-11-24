/**
 * Initializes all need modules
 *
 */
var pcAppDependencies = [
    'ngRoute',
    'ui.bootstrap',
    'pcApp.metrics',
    'pcApp.visualization',
    'pcApp.events',
    'pcApp.common',
    'pcApp.fcm',
    'pcApp.developer',
    'pcApp.search',
    'pcApp.ratings',
    'pcApp.indicators',
    'pcApp.datasets',
    'pcApp.references.directives.resolve',
    'dialogs.main',
    'dialogs.default-translations',
    'ngSpectrum',
    'skrollrDirectives',
    'ngProgress',
    'isteven-multi-select',
    'rzModule',
    'checklist-model'
    //'nvd3ChartDirectives'
];

if (policyCompassConfig.ENABLE_ADHOCRACY) {
    pcAppDependencies.push.apply(pcAppDependencies, [
        'pcApp.adhocracyEmbedder',
        'pcApp.auth',
        'pcApp.deliberation'
    ]);
}

var pcApp = angular.module('pcApp', pcAppDependencies)

    .run(function ($rootScope, $location) {
        $rootScope.location = $location;
    })

/**
 * Very simple central error handling
 */
    .factory('$exceptionHandler', [
        '$injector', '$log', function ($injector, $log) {
            return function (exception, cause) {
                // Use the dialogs module to display error messages
                var dialogs = $injector.get("dialogs");
                dialogs.notify("Error", String(exception.message));
                $log.error(cause);
                $log.error(exception);
            };
        }
    ])


    .controller('loadController', function ($scope) {
        $scope.loadPage = function () {
            $('.loadingHome').animate({'opacity': 0}, 250, function () {
                $('.loadingHome').remove();
            });
        }
    })

    .config([
        '$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
        }
    ]);
