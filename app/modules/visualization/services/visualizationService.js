angular.module('pcApp.visualization.services.visualization', [
    'ngResource', 'pcApp.config'
])

    .factory('Dataset', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            // Get the base URL from the configuration
            var url = API_CONF.DATASETS_MANAGER_URL + "/datasets/:id?time_resolution=:time_resolution";
            var Dataset = $resource(url, {
                id: "@id",
                time_resolution: "@time_resolution"
            }, {
                // Add support for update
                'update': {method: 'PUT'}, // Array is false due to additional pagination data
                'query': {
                    method: 'GET',
                    isArray: false
                }

            });

            return Dataset;
        }
    ])

    .factory('Visualization', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/visualizations/:id";
            var Visualization = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return Visualization;
        }
    ])

    .factory('VisualizationByDataset', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByDataset?dataset_id=:id&page_size=100";
            var VisualizationByDataset = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return VisualizationByDataset;
        }
    ])

    .factory('VisualizationByEvent', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.VISUALIZATIONS_MANAGER_URL + "/linkedVisualizationsByEvent?historical_event_id=:id&page_size=100";            
            var VisualizationByEvent = $resource(url, {
                id: "@id"
            }, {
                'update': {method: 'PUT'},
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
            return VisualizationByEvent;
        }
    ])

    .factory('FCMByIndividualSelected', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.FCM_URL + "/individuals/:id";
            var FCMByIndividualSelected = $resource(url, {
                id: "@id"
            }, {
                'query': {
                    method: 'GET',
                    isArray: true
                }
            });
            return FCMByIndividualSelected;
        }
    ])

    .factory('FCMByDatasetSelected', [
        '$resource', 'API_CONF', function ($resource, API_CONF) {
            var url = API_CONF.FCM_URL + "/datasets/:id";
            var FCMByDatasetSelected = $resource(url, {
                id: "@id"
            }, {
                'query': {
                    method: 'GET',
                    isArray: true
                }
            });
            return FCMByDatasetSelected;
        }
    ]);