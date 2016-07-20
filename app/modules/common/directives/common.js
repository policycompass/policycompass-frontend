angular.module('pcApp.common.directives.common', [])

	.directive('itemlayout', [
	        '$http', function ($http) {
	            return {
	                restrict: 'C',
	                scope: {
	                    item: '=item',
	                    type: '=type'
	                },	                
	                controller: function ($scope) {
	                	$scope.itemToPlot = [];
	                	$scope.$watchCollection('item', function (newVal, oldVal) {
	                		if (newVal) {
								if (newVal['id']) {
									$scope.itemToPlot['id'] = newVal['id'];	
								}
								if (newVal['description']) {
									$scope.itemToPlot['description'] = newVal['description'];
								}
								if (newVal['keywords']) {
									$scope.itemToPlot['keywords'] = newVal['keywords'];	
								}
															
								$scope.itemToPlot['policy_domains'] = newVal['policy_domains'];
								$scope.itemToPlot['creator_path'] = newVal['creator_path'];
								$scope.itemToPlot['version'] = newVal['version'];							
								$scope.itemToPlot['unit_category'] = newVal['unit_category'];
								
								if (newVal['created_at']) {
									$scope.itemToPlot['created_at'] = newVal['created_at'];
								}
								else if (newVal['issued']) {
									$scope.itemToPlot['created_at'] = newVal['issued'];
								}
								else if (newVal['dateAddedToPC']) {
									$scope.itemToPlot['created_at'] = newVal['dateAddedToPC'];
								}
								else if (newVal['date_created']) {
									$scope.itemToPlot['created_at'] = newVal['date_created'];
								}
	
								$scope.itemToPlot['dateIssuedByExternalResource'] = newVal['dateIssuedByExternalResource'];
								
								if (newVal['updated_at']) {
									$scope.itemToPlot['updated_at'] = newVal['updated_at'];
								}
								else if (newVal['issued']) {
									$scope.itemToPlot['updated_at'] = newVal['modified'];
								}
								else if (newVal['dateAddedToPC']) {
									$scope.itemToPlot['updated_at'] = newVal['dateModified'];
								}
								
								if (newVal['language_id']) {
									$scope.itemToPlot['language_id'] = newVal['language_id'];
								}
								else if (newVal['languageID']) {
									$scope.itemToPlot['language_id'] = newVal['languageID'];
								}
								else if (newVal['language']) {
									$scope.itemToPlot['language_id'] = newVal['language'];
								}
								
								if (newVal['location']) {
									$scope.itemToPlot['location'] = newVal['location'];
								}
								else if (newVal['spatials']) {
									$scope.itemToPlot['spatials'] = newVal['spatials'];
								}
							}
							
						 });
						
	                },
	                templateUrl: 'modules/common/partials/itemLayout.html',
	            };
	        }
		])

    .directive("scroll", function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 1) {
                    scope.CreateMenu = true;
                } else {
                    scope.CreateMenu = false;
                }
                scope.$apply();
            });
        };
    })

    .directive('editButtons', [
        'Auth', function (Auth) {
            return {
                restrict: 'E',
                rep1ace: true,
                scope: {
                    userpath: '@',
                    editurl: '@',
                    deletefunction: '='
                },
                template: '\
        <div class="button-group">\
        <a type="button" ng-if="allowEdit()" class="btn btn-primary btn-create" href="{{editurl}}">Edit</a>\
        <a type="button" ng-if="allowEdit()" class="btn btn-danger" ng-click="deletefunction();">Delete</a></div>\
        </div>',
                link: function (scope) {

                    var isOwner = function () {
                        return Auth.state.userPath === scope.userpath;
                    };

                    var isAdmin = function () {
                        if (Auth.state.isAdmin) {
                            return true;
                        } else {
                            return false;
                        }
                    };

                    scope.allowEdit = function () {
                        return (isAdmin() || isOwner());
                    };
                }
            };
        }
    ])

    .directive('username', [
        '$http', function ($http) {
            return {
                restrict: 'E',
                scope: {
                    userpath: '@'
                },
                template: '{{ username }}',
                link: function (scope) {
                    var url = scope.userpath;
                    $http({
                            url: url,
                            method: 'get'
                        }).then(function (response) {
                            if(response.data && response.data.content_type == "adhocracy_core.resources.principal.IUser") {
                                scope.username = response.data.data["adhocracy_core.sheets.principal.IUserBasic"].name;
                            } else {
                                scope.username = "Unknown User";
                            }
                        }, function (response) {
                            scope.username = "Deleted User";
                    });
                }
            };
        }
    ])

    .directive('customTabs', function () {
        return {
            restrict: 'A',
            rep1ace: true,
            require: '?ngModel',
            scope: {
                ngModel: '=',
                tabeHeight: "=height"
            },
            template: '\
            <ul class="nav nav-tabs nav-justified">\
                <li ng-class="{active: item.active}" ng-repeat="item in ngModel"><a href="#{{contentBaseId}}-{{$index}}" data-toggle="tab">{{item.title}}</a></li>\
            </ul>\
            <div class="tab-content" style="height:{{tabeHeight}}px;overflow: auto">\
              <div class="tab-pane" ng-class="{active: item.active}" id="{{contentBaseId}}-{{$index}}" ng-repeat="item in ngModel">{{item.content}}</div>\
            </div>',
            link: function (scope, $elem, el, attrs) {
                scope.contentBaseId = attrs.tabsBaseId;
            }
        };
    })

    .directive('fixedHeader', [
        '$timeout', function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    tableHeight: "&height"
                },
                link: function ($scope, $elem, $attrs, $ctrl) {
                    // wait for content to load into table
                    $scope.$watch(function () {
                        return $elem.find("tbody").is(':visible');
                    }, function (newValue, oldValue) {
                        if (newValue === true) {
                            // reset display styles so column widths are correct when measured below
                            $elem.find('thead, tbody').css('display', '');

                            // wrap in $timeout to give table a chance to finish rendering
                            $timeout(function () {
                                // set widths of columns
                                $elem.find('th').each(function (i, th) {
                                    th = $(th);
                                    var tdElems = $elem.find('tbody tr:first td:nth-child(' + (i + 1) + ')');

                                    var columnWidth = tdElems.width();
                                    th.width(columnWidth);
                                    tdElems.width(columnWidth);
                                });

                                // set css styles on thead and tbody
                                $elem.find('thead').css({
                                    'display': 'block'
                                });

                                $elem.find('tbody').css({
                                    'display': 'block',
                                    'height': $scope.tableHeight,
                                    'overflow': 'auto'
                                });

                                // reduce width of last column by width of scrollbar
                                var scrollBarWidth = $elem.find('thead').width() - $elem.find('tbody')[0].clientWidth;
                                if (scrollBarWidth > 0) {
                                    // for some reason trimming the width by 2px lines everything up better
                                    scrollBarWidth -= 2;
                                    $elem.find('tbody tr:first td:last-child').each(function (i, elem) {
                                        $(elem).width($(elem).width() - scrollBarWidth);
                                    });
                                }
                            });
                        }
                    });
                }
            };
        }
    ]);
