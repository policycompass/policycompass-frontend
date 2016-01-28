/**
 * Main Controller for the Search Manager.
 * Provides a search function with input a search query.
 */
(function() {

    var searchmodule = angular.module('pcApp.search.controllers', [
        'pcApp.search.services.search', 'pcApp.config', 'pcApp.references.services.reference'
    ]);

    var searchMainController = function($scope, $location, searchclient, esFactory, API_CONF, Language, PolicyDomain, Individual, $routeParams, $timeout) {
        //Init Selectable number of items per page
        $scope.itemsPerPageChoices = [{
            id: 10,
            name: '10'
        }, {
            id: 20,
            name: '20'
        }, {
            id: 30,
            name: '30'
        }];

        //Init Sort Options
        $scope.sortOptions = [{
            id: 'Relevance',
            name: 'Relevance'
        }, {
            id: 'Title',
            name: 'Title'
        }, {
            id: 'Date',
            name: 'Date Created'
        }, {
            id: 'CommentsDesc',
            name: 'Comments Desc.'
        }, {
            id: 'CommentsAsc',
            name: 'Comments Asc.'
        }];

        var filters = {};
        var requestAggs = {};
        var facetsSelected = {};
        var aggregationData = {};
        $scope.facetCategories = [];

        var aggregations = {
            lang: {
                label: 'Language',
                field: ["language.id", "languageID"],
                order: 1,
                resolveLabel: function() {
                    var that = this;
                    Language.get({
                        id: this.value
                    }, function(response) {
                        that.label = response.title;
                    });
                },
                disable: true
            },
            policyDomains: {
                label: 'Policy Domains',
                field: ["policy_domains"],
                order: 1,
                resolveLabel: function() {
                    var that = this;
                    PolicyDomain.get({
                        id: this.value
                    }, function(response) {
                        that.label = response.title;
                    });
                }
            },
            location: {
                label: 'Location',
                field: ["spatial", "location"],
                order: 1,
                resolveLabel: function() {
                    var that = this;
                    Individual.get({
                        id: this.value
                    }, function(response) {
                        that.label = response.title;
                    });
                }
            },
            type: {
                label: 'Content type',
                field: ["_type"],
                order: 0,
                resolveLabel: function() {
                    switch (this.value) {
                        case "metric":
                            this.label = "Metrics";
                            break;
                        case "event":
                            this.label = "Events";
                            break;
                        case "indicator":
                            this.label = "Indicators";
                            break;
                        case "dataset":
                            this.label = "Datasets";
                            break;
                        case "fuzzymap":
                            this.label = "Causal Models";
                            break;
                        case "visualization":
                            this.label = "Visualizations";
                            break;
                        case "ag":
                            this.label = "Argument graph";
                            break;
                        default:
                            this.label = this.value;
                            break;
                    }
                }
            },
            keyword: {
                label: 'Keyword',
                field: ["keywords"],
                size: 200,
                disable: true
            }
        };

        normalizeAggregationFilter = function() {
            var filters = [];
            angular.forEach(facetsSelected, function (values, facetCategory) {
                var terms = [];
                angular.forEach(values, function (val) {
                    var field = aggregations[facetCategory].field;
                    if (angular.isArray(field)) {
                        angular.forEach(field, function (fld) {
                            var term = {};
                            term[fld] = val;
                            terms.push({"term": term});
                        });
                    } else {
                        var term = {};
                        term[field] = bucket.value;
                        terms.push({"term": term});
                    }
                });
                if (terms.length > 0) {
                    filters.push({
                        "bool": {
                            "should": terms
                        }
                    });
                }
            });
            if (filters.length > 0)
                return {
                    "bool": {
                        "must": filters
                    }
                };
            return {};
        };
        $scope.facetCategoryResults = function(name) {
            return 1;
            if ($scope.aggregationData[name])
                return $scope.aggregationData[name].length;
            return 0;
        };
        prepareAggregations = function () {
            if ($scope.facetCategories.length > 0)
                return;
            var request = {};
            angular.forEach(aggregations, function(aggregation, name) {
                if (aggregation.disable) return;
                $scope.facetCategories.push({
                    name: name,
                    label: aggregation.label,
                    order: aggregation.order,
                    results: 0,
                    buckets: {}
                });
                aggregations[name].index = $scope.facetCategories.length - 1;

                if (!angular.isArray(aggregation.field))
                    aggregations[name].field = [aggregation.field];

                var i = 0;
                angular.forEach(aggregation.field, function(fld) {
                    var obj = {};
                    obj.field = fld;
                    if (aggregation.size)
                        obj.size = aggregation.size;
                    var index = (aggregation.field.length > 1) ? name + '$' + (i++) : name;
                    request[index] = {
                        "terms": obj
                    };
                });
            });
            requestAggs = request;
        };

        normalizeAggregationResults = function(aggs) {
            //console.log(aggs);
            var buckets = {};
            angular.forEach(aggs, function(aggregation, key) {
                var resetCounters = true;
                if (_match = key.match(/(.*)\$(\d+)/i)) {
                    key = _match[1];
                    resetCounters = (_match[2] == 1);
                }
                if (!aggregations[key]) {
                    console.log(key + " was unexpected");
                    return;
                }
                var facetCategory = $scope.facetCategories[aggregations[key].index];
                if (resetCounters) {
                    facetCategory.results = 0;
                    facetCategory.buckets = {};
                }

                angular.forEach(aggregation.buckets, function(bucket) {
                    if (!facetCategory.buckets[bucket.key]) {
                        facetCategory.buckets[bucket.key] = {
                            value: bucket.key,
                            facetCategory: key,
                            label: '',
                            selected: false,
                            results: 0
                        };
                        if (angular.isFunction(aggregations[key].resolveLabel))
                            aggregations[key].resolveLabel.apply(facetCategory.buckets[bucket.key]);
                        else
                            facetCategory.buckets[bucket.key].label = facetCategory.buckets[bucket.key].value;

                    }
                    if (facetsSelected[key] && (facetsSelected[key].indexOf(bucket.key) != -1 || facetsSelected[key].indexOf(""+bucket.key) != -1))
                        facetCategory.buckets[bucket.key].selected = true;
                    if (resetCounters)
                        facetCategory.buckets[bucket.key].results = 0;
                    facetCategory.buckets[bucket.key].results += bucket.doc_count;
                    facetCategory.results += bucket.doc_count;

                });
            });
            //console.log($scope.facetCategories);
        };

        $scope.facetChanged = function() {
            var bucket = this.bucket;
            if (!facetsSelected.hasOwnProperty(bucket.facetCategory))
                facetsSelected[bucket.facetCategory] = [];
            var idx = facetsSelected[bucket.facetCategory].indexOf(bucket.value);
            if (idx == -1)
                idx = facetsSelected[bucket.facetCategory].indexOf(""+bucket.value);
            if (idx != -1 && !bucket.selected)
                facetsSelected[bucket.facetCategory].splice(idx, 1);
            if (idx == -1 && bucket.selected)
                facetsSelected[bucket.facetCategory].push(bucket.value);
            $location.search("_"+bucket.facetCategory, facetsSelected[bucket.facetCategory]);
            goSearch();
        };

        // Set Search Fire Event
        goSearch = function () {
            if ((typeof $scope.searchQuery === "undefined") || ($scope.searchQuery === "")) {
                searchText = "";
            } else {
                searchText = $scope.searchQuery;
            }
            //$scope.search(searchText);
        };

        //Define function that fires search when page changes
        $scope.pageChanged = function () {
            if (typeof $scope.totalItems === "undefined") {
                if ($routeParams.hasOwnProperty("page") && $scope.currentPage != $routeParams.page)
                    $scope.currentPage = $routeParams.page;
                return;
            }
            $location.search('page', $scope.currentPage);
            goSearch();
        };

        //Define function that fires search when Items Per Page selection box changes
        $scope.itemsPerPageChanged = function() {
            $scope.itemsperPage = $scope.selectedItemPerPage.id;
            $location.search('show', $scope.itemsperPage);
            goSearch();
        };

        //Define function that fires search when Sort By selection box changes
        $scope.sortItemsChanged = function() {
            $scope.sortByItem = $scope.selectedSortItem.id;
            $location.search('sort', $scope.sortByItem);
            goSearch();
        };


        //Define function that fires when Item Type is filtered (Metrics,Visualization, Events of Fuzzy Maps)
        $scope.filterSearchType = function(searchItemType) {
            $scope.searchItemType = searchItemType;
            switch (searchItemType) {
                case 'metric,visualization,event,fuzzymap,ag':
                    $scope.searchItemTypeInfo = 'Search for metrics, visualizations, causal models, events, datasets, indicators, argument graphs';
                    $scope.searchItemTypeInfoDropDown = 'All';
                    break;
                case 'metric':
                    $scope.searchItemTypeInfo = 'Search for metrics';
                    $scope.searchItemTypeInfoDropDown = 'Metrics';
                    break;
                case 'visualization':
                    $scope.searchItemTypeInfo = 'Search for visualizations';
                    $scope.searchItemTypeInfoDropDown = 'Visualizations';
                    break;
                case 'event':
                    $scope.searchItemTypeInfo = 'Search for events';
                    $scope.searchItemTypeInfoDropDown = 'Events';
                    break;
                case 'fuzzymap':
                    $scope.searchItemTypeInfo = 'Search for causal models';
                    $scope.searchItemTypeInfoDropDown = 'Causal Models';
                    break;
                case 'dataset':
                    $scope.searchItemTypeInfo = 'Search for datasets';
                    $scope.searchItemTypeInfoDropDown = 'Datasets';
                    break;
                case 'indicator':
                    $scope.searchItemTypeInfo = 'Search for indicators';
                    $scope.searchItemTypeInfoDropDown = 'Indicators';
                    break;
                case 'ag':
                    $scope.searchItemTypeInfo = 'Search for argument graphs';
                    $scope.searchItemTypeInfoDropDown = 'Argument graphs';
                    break;

                default:
                    $scope.searchItemTypeInfo = 'Search for metrics, visualizations, causal models, events, datasets, indicators, argument graphs';
            }
            //Perform search based on new Item Type
            //goSearch();
        };

        //Define Main search function
        $scope.search = function(searchQuery) {

            if (typeof searchQuery == 'undefined') {
                searchQuery = "";
            }
            $location.search('q', (searchQuery==="")?null:searchQuery);
            //Get current result item offset depending on current page
            itemOffset = ($scope.currentPage - 1) * $scope.itemsperPage;
            //Build Sort
            if ($scope.sortByItem == 'Relevance') {
                var sort = ["_score"];
            } else if ($scope.sortByItem == 'Title') {
                var sort = ["title.lower_case_sort"];
            } else if ($scope.sortByItem == 'CommentsDesc') {
                var sort = [{
                    "commentsCount": {
                        "order": "desc"
                    }
                }];
            } else if ($scope.sortByItem == 'CommentsAsc') {
                var sort = [{
                    "commentsCount": {
                        "order": "asc"
                    }
                }];
            } else {
                var sort = [{
                    "id": {
                        "order": "desc"
                    }
                }, "_score"];
            }
            //Build query
            if (searchQuery != "") {
                var query = {
                    match: {
                        _all: searchQuery
                    }
                };
            } else {
                var query = {
                    match_all: {}
                };
            }
            var request = {
                index: API_CONF.ELASTIC_INDEX_NAME,
                type: $scope.searchItemType,
                body: {
                    size: $scope.itemsperPage,
                    from: itemOffset,
                    sort: sort,
                    query: query,
                    aggs: requestAggs
                }
            };
            var filters = normalizeAggregationFilter();
            if (!angular.equals({}, filters)) {
                //request.body.post_filter = filters;
                request.body.query = {
                    filtered: {
                        query: query,
                        filter: filters
                    }
                }
            }
            //Perform search through client and get a search Promise
            searchclient.search(request).then(function(resp) {
                //If search is successfull return results in searchResults objects
                $scope.searchResults = resp.hits.hits;
                $scope.searchResultsCount = resp.hits.total;
                $scope.totalItems = $scope.searchResultsCount;
                normalizeAggregationResults(resp.aggregations);
            }, function(err) {
                console.trace(err.message);
            });

        };

        $scope.init = function() {
            //Set Pagination defaults
            //Default value for how many pages to show in the page navigation control
            $scope.paginationSize = 5;
            //Default values for how many items per page
            $scope.itemsperPage = 10;
            //Default sort
            $scope.sortByItem = 'Relevance';
            //Default current page
            $scope.currentPage = $routeParams.page || 1;

            prepareAggregations();

            var type = $routeParams.type;
            if (type) {
                $scope.filterSearchType(type);
            } else {
                //Default search item type
                $scope.searchItemType = 'metric,visualization,event,fuzzymap,dataset,indicator,ag';
                $scope.searchItemTypeInfo = 'Search for metrics, visualizations, causal models, events, datasets, indicators, argument graphs';
                $scope.searchItemTypeInfoDropDown = 'All';
            }

            //Default search query
            $scope.searchQuery = $routeParams.q || "";

            var sortBy = $routeParams.sort;
            angular.forEach($scope.sortOptions, function(option) {
                if (option.id === sortBy){
                    $scope.sortByItem = sortBy;
                    $scope.selectedSortItem = option;
                }
            });

            var showPerPage = $routeParams.show-0;
            angular.forEach($scope.itemsPerPageChoices, function(option) {
                if (option.id === showPerPage){
                    $scope.itemsperPage = showPerPage;
                    $scope.selectedItemPerPage = option;
                }
            });

            facetsSelected = {};
            angular.forEach(aggregations, function (aggregation, name) {
                var queryParam = "_"+name;
                if ($routeParams.hasOwnProperty(queryParam)) {
                    if (angular.isArray($routeParams[queryParam])) {
                        facetsSelected[name] = $routeParams[queryParam];
                    } else {
                        facetsSelected[name] = [];
                        facetsSelected[name].push($routeParams[queryParam]);
                    }
                }
            });


            //Search for first time
            $scope.search($scope.searchQuery);
        };
        $scope.$on('$routeUpdate', function(){
            $scope.init();
        });
        // runs once per controller instantiation
        $scope.init();
    };


    searchmodule.controller("searchMainController", searchMainController);

}());
