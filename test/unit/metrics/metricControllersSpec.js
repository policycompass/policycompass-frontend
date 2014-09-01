'use strict';

describe('Metrics Controller Spec', function() {

    var respond = {
        "self": "/api/v1/metricsmanager/metrics/1",
        "spatial": "Germany, Spain",
        "resource_url": "http://epp.eurostat.ec.europa.eu/tgm/refreshTableAction.do?tab=table&plugin=1&pcode=tec00001&language=en",
        "unit": {
            "detail": "Not found"
        },
        "language": {
            "code": "en",
            "title": "English",
            "id": 1
        },
        "external_resource": {
            "detail": "Not found"
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
                    "row": 2,
                    "from": "2004-01-01",
                    "to": "2004-12-31",
                    "value": "25000.0",
                    "Country": "Germany"
                },
                {
                    "row": 3,
                    "from": "2005-01-01",
                    "to": "2005-12-31",
                    "value": "26000.0",
                    "Country": "Germany"
                },
                {
                    "row": 4,
                    "from": "2006-01-01",
                    "to": "2006-12-31",
                    "value": "27300.0",
                    "Country": "Germany"
                },
                {
                    "row": 5,
                    "from": "2007-01-01",
                    "to": "2007-12-31",
                    "value": "28800.0",
                    "Country": "Germany"
                },
                {
                    "row": 6,
                    "from": "2008-01-01",
                    "to": "2008-12-31",
                    "value": "29000.0",
                    "Country": "Germany"
                },
                {
                    "row": 7,
                    "from": "2009-01-01",
                    "to": "2009-12-31",
                    "value": "26900.0",
                    "Country": "Germany"
                },
                {
                    "row": 8,
                    "from": "2010-01-01",
                    "to": "2010-12-31",
                    "value": "29200.0",
                    "Country": "Germany"
                },
                {
                    "row": 9,
                    "from": "2011-01-01",
                    "to": "2011-12-31",
                    "value": "30800.0",
                    "Country": "Germany"
                },
                {
                    "row": 10,
                    "from": "2012-01-01",
                    "to": "2012-12-31",
                    "value": "31500.0",
                    "Country": "Germany"
                },
                {
                    "row": 11,
                    "from": "2013-01-01",
                    "to": "2013-12-31",
                    "value": "32000.0",
                    "Country": "Germany"
                },
                {
                    "row": 12,
                    "from": "2003-01-01",
                    "to": "2003-12-31",
                    "value": "20900.0",
                    "Country": "Spain"
                },
                {
                    "row": 13,
                    "from": "2004-01-01",
                    "to": "2004-12-31",
                    "value": "21900.0",
                    "Country": "Spain"
                },
                {
                    "row": 14,
                    "from": "2005-01-01",
                    "to": "2005-12-31",
                    "value": "22900.0",
                    "Country": "Spain"
                },
                {
                    "row": 15,
                    "from": "2006-01-01",
                    "to": "2006-12-31",
                    "value": "24800.0",
                    "Country": "Spain"
                },
                {
                    "row": 16,
                    "from": "2007-01-01",
                    "to": "2007-12-31",
                    "value": "26200.0",
                    "Country": "Spain"
                },
                {
                    "row": 17,
                    "from": "2008-01-01",
                    "to": "2008-12-31",
                    "value": "25900.0",
                    "Country": "Spain"
                },
                {
                    "row": 18,
                    "from": "2009-01-01",
                    "to": "2009-12-31",
                    "value": "24200.0",
                    "Country": "Spain"
                },
                {
                    "row": 19,
                    "from": "2010-01-01",
                    "to": "2010-12-31",
                    "value": "24200.0",
                    "Country": "Spain"
                },
                {
                    "row": 20,
                    "from": "2011-01-01",
                    "to": "2011-12-31",
                    "value": "24300.0",
                    "Country": "Spain"
                },
                {
                    "row": 21,
                    "from": "2012-01-01",
                    "to": "2012-12-31",
                    "value": "24400.0",
                    "Country": "Spain"
                },
                {
                    "row": 22,
                    "from": "2013-01-01",
                    "to": "2013-12-31",
                    "value": "24500.0",
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
        "description": "GDP (gross domestic product) is an indicator for a nation´s economic situation. It reflects the total value of all goods and services produced less the value of goods and services used for intermediate consumption in their production. Expressing GDP in PPS (purchasing power standards) eliminates differences in price levels between countries, and calculations on a per head basis allows for the comparison of economies significantly different in absolute size. (Source: Eurostat)",
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

    beforeEach(module('ngRoute'));
    beforeEach(module('pcApp.metrics'));

    describe('MetricDetailController', function(){
        var scope, metDetCtrl, httpBackend;

        beforeEach(inject(function($rootScope, $routeParams, $controller, $httpBackend){
            httpBackend = $httpBackend;
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

    });

    describe('MetricController', function(){
        var scope, metCtrl, httpBackend;

        beforeEach(inject(function($rootScope, $controller, $httpBackend){
            httpBackend = $httpBackend;
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

});