/**
 * @description
 * This module sets all configuration
 * 
 */
angular.module('pcApp.config',[])

.constant('API_CONF', {
	'URL': '/api/v1',
    'METRICS_MANAGER_URL': '/api/v1/metricsmanager',
    'EVENTS_MANAGER_URL': '/api/v1/eventsmanager',
    'REFERENCE_POOL_URL': '/api/v1/references'
});