/**
 * @description
 * This module sets all configuration
 *
 * policyCompassConfig is exposed as a global variable in order to use it in
 * the main app.js file. If there's a way to do the same with dependency
 * injection, this should be fixed.
 */


// Set to true to use the frontend stand-alone without installing the services
var useRemoteServices = false;

// Configuration for locally installed services
var policyCompassConfig = {
    'URL': '/api/v1',
    'DATASETS_MANAGER_URL': '/api/v1/datasetmanager',
    'METRICS_MANAGER_URL': '/api/v1/metricsmanager',
    'VISUALIZATIONS_MANAGER_URL': '/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': '/api/v1/eventsmanager',
    'REFERENCE_POOL_URL': '/api/v1/references',
    'INDICATOR_SERVICE_URL': '/api/v1/indicatorservice',
    'FCM_URL': '/api/v1/fcmmanager',
    'ELASTIC_URL' : 'localhost:9000',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    // FIXME: disabling adhocracy doesn't work due to use of
    // UserState controller in index.html
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'http://localhost:6541',
    'ADHOCRACY_FRONTEND_URL': 'http://localhost:6551'
};

// Configuration for remote services
var remotePolicyCompassConfig = {
    'URL': '/api/v1',
    'DATASETS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/datasetmanager',
    'METRICS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/metricsmanager',
    'VISUALIZATIONS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/eventsmanager',
    'REFERENCE_POOL_URL': 'https://services-dev.policycompass.eu/api/v1/references',
    'INDICATOR_SERVICE_URL': 'https://services-dev.policycompass.eu/api/v1/indicatorservice',
    'FCM_URL': 'https://alpha.policycompass.eu/api/v1/fcmmanager',
    'ELASTIC_URL' : 'https://search-dev.policycompass.eu/',
    'ELASTIC_INDEX_NAME' : 'policycompass_search',
    'ENABLE_ADHOCRACY': true,
    'ADHOCRACY_BACKEND_URL': 'https://adhocracy-backend-dev.policycompass.eu',
    'ADHOCRACY_FRONTEND_URL': 'https://adhocracy-frontend-dev.policycompass.eu'
};

if(useRemoteServices == false) {
    angular.module('pcApp.config', []).constant('API_CONF', policyCompassConfig);
} else {
    angular.module('pcApp.config', []).constant('API_CONF', remotePolicyCompassConfig);
}

