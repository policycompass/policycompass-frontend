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
    'dialogs.main',
    'dialogs.default-translations',
    'angularSpectrumColorpicker',
    'skrollrDirectives'
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

/**
 * Setting the Token always to 1
 * Just for development!
 */
.run(function($http, $rootScope, $location, $translate) {
    $http.defaults.headers.common.Authorization = 'Token 1';
    $rootScope.location = $location;
});
