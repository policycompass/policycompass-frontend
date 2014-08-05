angular.module('pcApp.common.directives.common', [

])


.directive('customTabs', function () {
    return {
        restrict: 'A',
        rep1ace: true,
        require: '?ngModel',
        scope:{
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
        link: function(scope,$elem, el, attrs){
            scope.contentBaseId = attrs.tabsBaseId;
        }
    };
})

.directive('fixedHeader', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope:{
            tableHeight: "&height"
        },
        link: function ($scope, $elem, $attrs, $ctrl) {
            // wait for content to load into table
            $scope.$watch(function () { return $elem.find("tbody").is(':visible'); },
                function (newValue, oldValue) {
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
}]);