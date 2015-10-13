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
    'SEARCH_MANAGER_URL': 'http://localhost:8000/api/v1/searchmanager',
    'DATASETS_MANAGER_URL': 'http://localhost:8000/api/v1/datasetmanager',
    'VISUALIZATIONS_MANAGER_URL': 'http://localhost:8000/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'http://localhost:8000/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'http://localhost:8000/api/v1/metricsmanager',
    'SEARCH_MANAGER_URL': 'http://localhost:8000/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'http://localhost:8000/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'http://localhost:8000/api/v1/metricsmanager/normalizers',
    'REFERENCE_POOL_URL': 'http://localhost:8000/api/v1/references',
    'INDICATOR_SERVICE_URL': 'http://localhost:8000/api/v1/indicatorservice',
    'FCM_URL': 'http://localhost:8080/api/v1/fcmmanager',
    'ELASTIC_URL' : 'http://localhost:9200/',
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
    'SEARCH_MANAGER_URL': 'http://localhost:8000/api/v1/searchmanager',
    'DATASETS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/datasetmanager',
    'VISUALIZATIONS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/visualizationsmanager',
    'EVENTS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/eventsmanager',
    'METRICS_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/metricsmanager',
    'SEARCH_MANAGER_URL': 'https://services-dev.policycompass.eu/api/v1/searchmanager',
    'FORMULA_VALIDATION_URL' : 'https://services-dev.policycompass.eu/api/v1/metricsmanager/formulas/validate',
    'NORMALIZERS_URL': 'https://services-dev.policycompass.eu/api/v1/metricsmanager/normalizers',
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
