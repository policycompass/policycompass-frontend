/**
 * @description
 * This module sets all configuration
 *
 * policyCompassConfig is exposed as a global variable in order to use it in
 * the main app.js file. If there's a way to do the same with dependency
 * injection, this should be fixed.
 */

var policyCompassConfig = {
    'URL': '/api/v1',
    'METRICS_MANAGER_URL': '/api/v1/metricsmanager',
    'VISUALIZATIONS_MANAGER_URL': '/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': '/api/v1/eventsmanager',
    'REFERENCE_POOL_URL': '/api/v1/references',
    'FCM_URL': '/api/v1/fcmmanager',
    'ELASTIC_URL' : 'localhost:9000',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    'ENABLE_ADHOCRACY': false,
    'ADHOCRACY_URL': 'http://localhost:6551'
};

angular.module('pcApp.config', [])

.constant('API_CONF', policyCompassConfig);
