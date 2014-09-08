'use strict';
/**
 * Unittests for the metric controllers
 */

describe('Metrics Controller Spec', function() {

    // Static test data
    var respond = {
        "self": "/api/v1/metricsmanager/metrics/1",
        "spatial": "Germany, Spain",
        "resource_url": "http://epp.eurostat.ec.europa.eu/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=tec00001&language=en",
        "unit": {
            "id": 10,
            "title": "Million Euro",
            "unit_category": {
                "id": 4,
                "title": "Currency"
            },
            "description": "Million Euro"
        },
        "language": {
            "code": "en",
            "title": "English",
            "id": 1
        },
        "external_resource":{
            "url": "http://epp.eurostat.ec.europa.eu/",
            "id": 1,
            "api_url": "http://epp.eurostat.ec.europa.eu/portal/page/portal/sdmx_web_services/getting_started/rest_sdmx_2.1",
            "title": "Eurostat"
        },
        "resource_issued": "2014-05-28",
        "issued": "2014-07-05T16:27:07.168Z",
        "modified": "2014-08-27T15:53:00.517Z",
        "policy_domains": [
            {
                "description": "Education",
                "title": "Education",
                "id": 1
            }
        ],
        "data": {
            "ranges": {
                "Country": [
                    "Germany",
                    "Spain"
                ]
            },
            "table": [
                {
                    "row": 1,
                    "from": "2003-01-01",
                    "to": "2003-12-31",
                    "value": "23900.0",
                    "Country": "Germany"
                },
                {
                    "row": 12,
                    "from": "2003-01-01",
                    "to": "2003-12-31",
                    "value": "20900.0",
                    "Country": "Spain"
                }
            ],
            "extra_columns": [
                "Country"
            ]
        },
        "id": 1,
        "title": "Gross Domestic Product at Market Prices for Germany and Spain",
        "acronym": "GDP (GER, SPA)",
        "description": "description",
        "keywords": "GDP, Market Price",
        "publisher": "Eurostat",
        "license": "",
        "user_id": 1,
        "version": 5,
        "formula": "1"
    };

    var respond_list = {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
            respond,
            respond
        ]
    };

    var input = {
        spatial: "Germany, Spain",
        unit: 1,
        language: 2,
        policy_domains: [1],
        data: {
            table: [
                {
                    from: "2003-01-01",
                    to: "2003-12-31",
                    value: "23900.0",
                    Country: "Germany"
                },
                {
                    from: "2004-01-01",
                    to: "2004-12-31",
                    value: "25000.0",
                    Country: "Germany"
                }
            ],
            extra_columns: [
                "Country"
            ]
        },
        resource_issued: "2014-09-04T15:33:56Z",
        title: "Gross Domestic Product at Market Prices for Germany and Spain",
        acronym: "GDP (GER, SPA)",
        description: "hallo",
        keywords: "GDP, Market Price"
    };

    beforeEach(module('ngRoute'));
    beforeEach(module('pcApp.metrics'));

    describe('MetricDetailController', function(){
        var scope, metDetCtrl, httpBackend, location;

        beforeEach(inject(function($rootScope, $routeParams, $controller, $httpBackend, $location){
            location = $location;
            httpBackend = $httpBackend;
            // Mock the API response
            httpBackend.when('GET', '/api/v1/metricsmanager/metrics/1').respond(respond);
            $routeParams.metricId = 1;
            scope = $rootScope.$new();
            metDetCtrl = $controller('MetricDetailController',{
                $scope: scope
            });
        }));

        it('should have a metric',function(){
            httpBackend.flush();
            expect(scope.metric.spatial).toBe('Germany, Spain');
        });

        it('should have several control variables', function(){
            httpBackend.flush();
            expect(scope.gridvisible).toBeDefined();
            expect(scope.gridloaded).toBeDefined();
            expect(scope.grid.data).toBeDefined();
            expect(scope.grid.instance).toBeDefined();
        });

        it('extra legend should have correct values', function(){
            httpBackend.flush();
            expect(scope.extralegend).toEqual([
                {column: 'D', value: 'Country'}
            ]);

        });

        it('show data should be possible', function () {
            httpBackend.flush();
            scope.gridvisible = false;
            scope.showData();
            expect(scope.gridvisible).toEqual(true);
        });

        it('There should be a delete function', function () {
            httpBackend.flush();
            expect(scope.deleteMetric).toBeDefined();
        })

    });

    describe('MetricController', function(){
        var scope, metCtrl, httpBackend;

        beforeEach(inject(function($rootScope, $controller, $httpBackend){
            httpBackend = $httpBackend;
            // Mock the API response
            httpBackend.when('GET', '/api/v1/metricsmanager/metrics').respond(respond_list);
            scope = $rootScope.$new();
            metCtrl = $controller('MetricsController',{
                $scope: scope
            });
        }));

        it('should have list of metrics',function(){
            httpBackend.flush();
            expect(scope.metrics.count).toBe(2);
            expect(scope.metrics.results[0].spatial).toBe('Germany, Spain');
        });

    });

    describe('MetricCreateController', function(){
        var scope, metCtrl, httpBackend, location;

        beforeEach(inject(function($rootScope, $controller, $httpBackend, $location){
            location = $location;
            httpBackend = $httpBackend;
            // Mock the API response
            httpBackend.when('POST', '/api/v1/metricsmanager/metrics').respond({id: 1});
            scope = $rootScope.$new();
            metCtrl = $controller('MetricCreateController',{
                $scope: scope
            });
        }));

        it('should have several variables',function(){
            expect(scope.mode).toEqual('create');
            expect(scope.gridvisible).toEqual(true);
            expect(scope.metric).toEqual({});
            expect(scope.columns).toEqual({from: 0, to: 1, value: 2});
            expect(scope.step).toEqual('one');
            expect(scope.columnselection).toBeDefined();
            expect(scope.extracolumns).toEqual([]);
            expect(scope.tabsel).toEqual({grid: true, file: false});
            expect(scope.grid).toEqual({data: [[]], instance: {}});
            expect(scope.nextStep).toBeDefined();
            expect(scope.prevStep).toBeDefined();
        });

        it('should be possible to add and remove extra columns', function () {
            scope.addExtraColumn();
            expect(scope.extracolumns).toEqual([{i: 1, column: null, value: null}]);
            scope.removeExtraColumn(1);
            expect(scope.extracolumns).toEqual([]);
        });

        it('should validate and go to next step', function () {
            spyOn(scope, 'validation');
            scope.nextStep();
            expect(scope.validation).toHaveBeenCalled();
            expect(scope.step).toEqual('second');
            scope.prevStep();
            expect(scope.step).toEqual('one');
        });

        it('should not validate', function () {
            scope.columns.from = 0;
            scope.columns.to = 1;
            scope.columns.value = 2;
            scope.extracolumns = [{i: 1, column: 1, value: "bla"}];
            expect(function(){ scope.validation(); }).toThrow();
        });

        it('should convert input correctly', function () {
            scope.extracolumns = [{i: 1, column: 3, value: "Country"}];
            scope.grid.data = [
                ["2003-01-01", "2003-01-01", "100.0", "Spain"],
                ["2004-01-01", "2004-01-01", "200.0", "Spain"]
            ];
            scope.createMetric();

            expect(scope.metric.data).toEqual({
                table: [
                    {
                        from: "2003-01-01",
                        to: "2003-01-01",
                        value: "100.0",
                        Country: "Spain"
                    },
                    {
                        from: "2004-01-01",
                        to: "2004-01-01",
                        value: "200.0",
                        Country: "Spain"
                    }
                ],
                extra_columns: [
                    "Country"
                ]});
        });

        it('should create a metric',function(){
            scope.metric = input;
            spyOn(location, 'path');
            scope.createMetric();
            httpBackend.flush();
            expect(scope.metric.resource_issued).toEqual('2014-09-04');
            expect(location.path).toHaveBeenCalledWith('/metrics/1');
        });
    });


    describe('MetricEditController', function(){
        var scope, metCtrl, httpBackend, location, routeParams;

        beforeEach(inject(function($rootScope, $controller, $httpBackend, $location){
            location = $location;
            httpBackend = $httpBackend;
            // Mock the API responses
            httpBackend.when('PUT', '/api/v1/metricsmanager/metrics').respond({id: 1});
            httpBackend.when('GET', '/api/v1/metricsmanager/metrics/1').respond(respond);
            scope = $rootScope.$new();
            routeParams = {
                metricId: 1
            };
            metCtrl = $controller('MetricEditController',{
                $scope: scope,
                $routeParams: routeParams
            });
        }));

        it('should have the metric in the right format',function(){
            httpBackend.flush();
            expect(scope.mode).toEqual('edit');
            expect(scope.gridvisible).toEqual(true);
            expect(scope.metric.unit).toEqual(10);
            expect(scope.metric.language).toEqual(1);
            expect(scope.metric.external_resource).toEqual(1);
            expect(scope.metric.policy_domains).toEqual(['1']);
            expect(scope.extracolumns).toEqual([{i: 1, column: 3, value: "Country"}]);
            expect(scope.grid.data).toEqual([
                ["2003-01-01", "2003-12-31", "23900.0", "Germany"],
                ["2003-01-01", "2003-12-31", "20900.0", "Spain"]
            ]);
        });

        it('should have several variables',function(){
            expect(scope.mode).toEqual('edit');
            expect(scope.columns).toEqual({from: 0, to: 1, value: 2});
            expect(scope.step).toEqual('one');
            expect(scope.columnselection).toBeDefined();
            expect(scope.tabsel).toEqual({grid: true, file: false});
            expect(scope.grid.instance).toEqual({});
            expect(scope.nextStep).toBeDefined();
            expect(scope.prevStep).toBeDefined();
        });

        it('should update a metric',function(){
            spyOn(location, 'path');
            scope.createMetric();
            httpBackend.flush();
            expect(location.path).toHaveBeenCalledWith('/metrics/1');
        });

    });
});