angular.module('pcApp.common.directives.common', [])

	.directive('itemlayout', [
	        '$http', function ($http) {
	            return {
	                restrict: 'C',
	                scope: {
	                    item: '=item',
	                    type: '=type'
	                },
	                template: '' +	                
					'<div class="form-group-desc form-group form-group-description" ng-if="itemToPlot.description">' +
						'<div class="field-label">Description</div>' +
               			'<div class="field-content">{{itemToPlot.description}}</div>' +
           			'</div>' +
					'<div class="form-group form-group-keywords" ng-if="itemToPlot.keywords">' +
						'<div class="field-label">Keywords</div>' +
						'<div class="field-content">{{itemToPlot.keywords}}</div>' +
					'</div>' +
					'<div class="form-group form-group-keywords" >' +
						'<div class="field-label">Policy domains</div>' +
						'<div class="field-content">' +						
							'<div ng-repeat="policydomain in itemToPlot.policy_domains">' +
								'<span ng-if="policydomain.title">{{policydomain.title}}</span>'+
								'<span ng-if="policydomain" resolve-policydomain id="policydomain"></span>' +
							'</div>' +
						'</div>' +						
						'<div class="form-item" ng-if="itemToPlot.unit_category">' +
                    		'<div class="field-label">Unit Category</div>' +
                    		'<div class="field-content">' +
                        		'<span resource-title id="itemToPlot.unit_category" resource="UnitCategory"></span>' +
                    		'</div>' +
                		'</div>' +
					'</div>' +
					'<div class="form-group form-group-modified">' +
						'<div class="form-item" ng-if="itemToPlot.creator_path">' +
							'<div class="field-label">Added by</div>' +
							'<div class="field-content">' +
								'<username userpath="{{itemToPlot.creator_path}}"></username>' +
							'</div>' +
						'</div>' +
						'<div class="form-item" ng-if="itemToPlot.created_at">' +
							'<div class="field-label">Added</div>' +
							'<div class="field-content">{{ itemToPlot.created_at | date:"longDate" }}</div>' +
						'</div>'+
						'<div class="form-item" ng-if="itemToPlot.dateIssuedByExternalResource">' +
							'<div class="field-label">Issued</div>' +
							'<div class="field-content">{{ item.dateIssuedByExternalResource | date:"longDate" }}</div>' +
						'</div>'+
						'<div class="form-item" ng-if="itemToPlot.updated_at">' +
							'<div class="field-label">Modified</div>' +
							'<div class="field-content">{{ itemToPlot.updated_at | date:"longDate" }}</div>' +
						'</div>'+
					'</div>'+
					'<div class="form-group form-group-location" ng-if="itemToPlot.language_id">' +
						'<div class="form-item">'+
							'<div class="field-label">Language</div>' +
							'<div class="field-content">' +
								'<span ng-if="itemToPlot.language_id" resolve-language id="itemToPlot.language_id"></span>' +
							'</div>' +
						'</div>' +
						'<div class="form-item" ng-if="itemToPlot.location || itemToPlot.spatials">' +
							'<div class="field-label">Location</div>' +
							'<div class="field-content">'+
								'<span ng-if="item.location" resolve-individual id="itemToPlot.location"></span>' +
								'<div ng-repeat="spatial in itemToPlot.spatials"> ' +
                                	'<span ng-if="spatial" resolve-individual id="spatial"></span>' +
                                '</div>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="form-group form-group-rating">' +
						'<div class="form-item">' +
							'<div class="field-label">Rating</div>' +
							'<div class="field-content">' +
								'<pc-rating ng-if="itemToPlot.id" rating-id="{{type}}_{{itemToPlot.id}}"></pc-rating>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="form-group form-group-lg" ng-if="itemToPlot.version">' +
						'<div class="form-item">' +
							'<div class="field-label">Version</div>' +
							'<div class="field-content">{{ itemToPlot.version }}</div>' +
						'</div>' +
					'</div>'
					,
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
						
	                }                
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
