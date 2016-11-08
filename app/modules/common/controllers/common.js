/**
 * Controllers for common purposes
 */

angular.module('pcApp.common.controllers', [])

/****
 Used to search metrics using elasticsearch api
 ******//*
 .factory('SearchMetrics',  ['$resource', 'API_CONF', function($resource, API_CONF) {
 var url = "/"+API_CONF.ELASTIC_INDEX_NAME+'/:type/_search';
 //var url = 'http://'+API_CONF.ELASTIC_URL + "/" + API_CONF.ELASTIC_INDEX_NAME + '/:type/_search';
 //console.log("url");
 //console.log(url);

 var SearchMetrics = $resource(url,
 {
 search: "@search",
 type: "@type"
 },
 {
 'update': { method:'PUT' },
 'post': { method:'POST', isArray:false },
 'query': { method: 'GET', isArray:false}
 //'query': { method: 'POST', isArray:false}
 }
 );
 return SearchMetrics;
 }])
 */

    .controller('CommonController', [
        '$scope', '$location', function ($scope, $location) {
            $scope.hideLoader = true;

            $scope.isActive = function (viewLocation) {
                return viewLocation === $location.path();
            };
            $scope.isCollapsed = true;
            $scope.navCollapsed = true;
            $scope.toggleCreateMenu = function () {
                $scope.isCollapsed = !$scope.isCollapsed
            }
            $scope.collapseCreateMenu = function () {
                $scope.isCollapsed = true;
            }
            $scope.expandCreateMenu = function () {
                $scope.isCollapsed = false;
            }
            /* Functions for Submenu Collapse.*/
            $(document).on('click', function (e) {
                var link = e.target.id;
                if ((link !== "createLink") && ($scope.isCollapsed == false)) {
                    $scope.isCollapsed = true;
                }
            });
            /* Functions for login Button to call a route.*/
            $scope.go = function (path) {
                $location.path(path);
            };
        }
    ])

    .controller('StaticController', [
        '$scope', '$modal', function ($scope, $modal) {


        }
    ])

    .controller('ControllerScroller', [
        '$scope', '$document', function ($scope, $document) {

            $scope.toTheTop = function() {
                $document.scrollTopAnimated(0, 2000).then(function() {
                });
            }

            $scope.toSection = function(sectionId) {
                var sectionToScroll = angular.element(document.getElementById(sectionId));
                $document.scrollToElementAnimated(sectionToScroll, 0, 2000);
            }

        }
    ])

    .controller('wanttoController', [
        '$scope', '$rootScope', '$modal', function ($scope, $rootScope, $modal) {
            $rootScope.wizard_help = false;
        }
    ])

    .controller('CreateDataset2Controller', [
        '$scope', '$modal', function ($scope, $modal) {
            console.log("CreateDataset2Controller");

            $scope.classtypedata = [
                {
                    icon: "",
                    name: "Country",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Age Class",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Gender",
                    maker: "",
                    ticked: false
                }
            ];
            $scope.classtypedata2 = [
                {
                    icon: "",
                    name: "Country",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Age Class",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Gender",
                    maker: "",
                    ticked: false
                }
            ];

            $scope.gendermultiselect = [
                {
                    icon: "",
                    name: "Male",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Female",
                    maker: "",
                    ticked: false
                }, {
                    icon: "",
                    name: "Death Rate",
                    maker: "",
                    ticked: false
                }
            ];


        }
    ])

/**
 * Controller for setting the UI Bootstrap date selection.
 * ToDo: Should be a directive.
 */
    .controller('DateController', [
        '$scope', function ($scope) {

            $scope.maxDate = new Date();
            //$scope.minDate = new Date('1900-01-01');
            $scope.format = "yyyy-MM-dd";
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

        }
    ])


    .controller('LearnController', [
        '$scope', '$compile', function ($scope, $compile) {

            $scope.selectedTextIndex = 0;
            $scope.learningTexts = [{title:"Registration", directive:"learn-1"},
                {title:"Importing Datasets", directive:"learn-2"},
                {title:"Events", directive:"learn-3"},
                {title:"Causal Models", directive:"learn-4"},
                {title:"Argumentation Graphs", directive:"learn-5"},
                {title:"Browsing", directive:"learn-6"},
                {title:"Promotional Video", directive:"learn-8"},
            ];

            $scope.selectText = function(index){
                $scope.selectedTextIndex = index;
                $scope.insertText();
            }

            $scope.insertText = function(){

                if($scope.selectedTextIndex >= 0){
                    directive_name = $scope.learningTexts[$scope.selectedTextIndex].directive;
                }else{
                    directive_name = "learn-7";
                }
                angular.element(document.getElementById('directive_div')).remove();
                angular.element(document.getElementById('text_content')).append($compile
                ("<div " + directive_name + " id='directive_div'></div>")($scope));
            }

            $scope.insertText();

        }
    ]);
