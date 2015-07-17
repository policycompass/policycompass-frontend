angular.module('pcApp.common.directives.loadpcimage', [

])
//exemple of use:
//<div class="loadpcimage" id="visualization.id" imgtype="'visualization'" imgalt="visualization.title" imgtitle="visualization.title"></div>

.directive('loadpcimage', ['$log', 'API_CONF', function ($log,  API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
        	id: '=id',
        	imgtype: '=imgtype',
        	imgalt: '=imgalt',
        	imgtitle: '=imgtitle'
        }, 
        controller: function($scope, $element, $attrs, $location, dialogs){
        },

        template: ''+        
        '<center>' +
        '<img height="80px" ng-src="{{ \'/media/\'+imgtype+\'_\'+id+\'.png\' || \'media/no-image.png\' }}" alt="{{imgalt}}" title="{{imgtitle}}"/>' +
		'</center>'
    };
}])