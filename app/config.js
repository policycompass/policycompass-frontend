/**
 * @description
 * This module sets all configuration
 *
 * policyCompassConfig is exposed as a global variable in order to use it in
 * the main app.js file. If there's a way to do the same with dependency
 * injection, this should be fixed.
 */

var djangoServicesBaseUrl = 'http://localhost:8000/api/v1/';

var policyCompassConfig = {
    'URL': '/api/v1',
    'METRICS_MANAGER_URL': djangoServicesBaseUrl + 'metricsmanager',
    'VISUALIZATIONS_MANAGER_URL': djangoServicesBaseUrl + 'visualizationsmanager',
    'EVENTS_MANAGER_URL': djangoServicesBaseUrl + 'eventsmanager',
    'REFERENCE_POOL_URL': djangoServicesBaseUrl + 'references',
    'FCM_URL': 'http://localhost:8080/api/v1/fcmmanager',
    'ELASTIC_URL' : 'http://localhost:9200/policycompass_search',
    'ENABLE_ADHOCRACY': false,
    'ADHOCRACY_URL': 'http://localhost:6551'
};

angular.module('pcApp.config', [])

.constant('API_CONF', policyCompassConfig);
