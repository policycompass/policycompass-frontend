/*
angular.module('pcApp.common.directives.common', [

])
*/
angular.module('pcApp.common.directives.search', [

])



/***** How to use this directive
 Example:
 <div id="filterMetrics" class="selectorMetrics" metrics-list="ListMetricsFilter" number-Max-Metrics="2" functionformetric="rePlotGraph()"></div>
 Where:
 	class="selectorMetrics" -> Use the directive
 	metrics-list="ListMetricsFilter" -> paramenter with the array of metrics selected
 		example return value: [{"id":41,"title":"Unemployment in Germany 2002-2013","issued":"2014-11-18T06:55:39.597Z"}]
 	number-Max-Metrics="50"  -> max numbers user can select, if its null is 1
	functionformetric="rePlotGraph()" -> functioin that will be executed when user add/delete a mertric from the list. If it's null nothing is execute 	
*******/
//.directive('selectorMetrics', ['$log', 'SearchMetrics', function ($log, SearchMetrics) {
.directive('selectorMetrics', ['$log', 'searchclient', 'API_CONF', function ($log, searchclient, API_CONF) {
	
    return {
        restrict: 'C',
        scope: {
            metricsList: '=metricsList',
            numberMaxMetrics: '@numberMaxMetrics',
            functionformetric: "&functionformetric"
        }, 
		compile: function(element, attributes){ 
         return {
             pre: function(scope, element, attributes, controller, transcludeFn){

             },
             post: function(scope, element, attributes, controller, transcludeFn){

             }
         }
     	},             
        controller: function($scope, $element, $attrs, $location, dialogs){
        	
        	$scope.MetricSelectediId_ = [];
        	//to set the input metrics list as selected
        	
        	
			$scope.$watchCollection('metricsList', function(metricsList) {

				$scope.MetricSelectediId_ = [];
	        	if (isNaN($scope.numberMaxMetrics))
	        	{
	        		$scope.numberMaxMetrics=1;
	        	}
	        	
	        	if (!metricsList)
				{
					$scope.metricsList = [];
				}
				
                for (var k in $scope.metricsList)
				{
					$scope.MetricSelectediId_[$scope.metricsList[k].id]=$scope.metricsList[k].id;
				}
			
            });
            
        	/*
        	setTimeout(function () {
								
	        	if (isNaN($scope.numberMaxMetrics))
	        	{
	        		$scope.numberMaxMetrics=1;
	        	}
	        	
	        	if (!$scope.metricsList)
				{
					$scope.metricsList = [];
				}
				
                for (var k in $scope.metricsList)
				{
					$scope.MetricSelectediId_[$scope.metricsList[k].id]=$scope.metricsList[k].id;
				}
                
            }, 1000);
        	*/
        	
        	$scope.searchtext = '';
        	$scope.itemsperpagesize = 10;
        	$scope.itemssearchfrom = 0;
			$scope.pagToSearch = 1;
			
			$scope.clickMetric = function(idMetric, title, issued) {
				
				var addmetric = true;
				if (idMetric>0)
				{
					addmetric = true;	
				}
				else
				{
					addmetric = false;
				}
				
				if (!$scope.metricsList)
				{
					$scope.metricsList = [];
				}	
				
				for (var k=0; k < $scope.metricsList.length; k++) 
				//for (var k in $scope.metricsList)
				{
					//console.log("id="+$scope.metricsList[k].id);
					if ($scope.metricsList[k].id==idMetric)
					{
						addmetric = false;
						var dlg = dialogs.confirm(
            			"Are you sure?",
            			"Do you want to delete '"+title+"' from the list of metrics?");
        				dlg.result.then(function (k) {
        		            //console.log(k);
        		            
        		            //console.log("idMetric="+idMetric);
							$scope.metricsList.splice(k, 1);
							$scope.MetricSelectediId_[idMetric]='';
							$scope.functionformetric();
					            
        				});

					}
				}
				
				if (addmetric)
				{		
					var myObject = {
						'id':idMetric,
						'title':title,
						'issued': issued
					};					
					$scope.metricsList.push(myObject);					
					$scope.functionformetric();
				}
				
				for (var k in $scope.metricsList)
				{
					$scope.MetricSelectediId_[$scope.metricsList[k].id]=$scope.metricsList[k].id;
				}
				
			};
			
			$scope.findMetricsByFilter = function(pagIn) {
				
				if (pagIn=='next')
				{
					$scope.pagToSearch= $scope.pagToSearch+1;
				}
				else if (pagIn=='prev')
				{
					$scope.pagToSearch = $scope.pagToSearch-1;
				}
				else
				{
					$scope.pagToSearch = 1;				
				}
			
				$scope.itemssearchfrom = ($scope.pagToSearch-1)*$scope.itemsperpagesize;
							
				/*
				$scope.metricsFilter = SearchMetrics.query(
            	{
            		type: 'metric',
            		sort: 'title',
            		size: $scope.itemsperpagesize,
            		from: $scope.itemssearchfrom,
            		q: 'title:*'+$scope.searchtext+'*',
            	},
				function(metricList) {
				},
				function(error) {
	               	//throw { message: JSON.stringify(err.data)};
    	           	throw { message: JSON.stringify(error.data)};
				});
				*/
				//var sort =    ["title"];
				 //var sort =     [{"title" : {"order" : "asc"}}];
				 var sort = ["title.lower_case_sort"];
				 //var sort =     [{"id" : {"order" : "desc"}},"_score"];
				  
				//Build query
				if ($scope.searchtext)
				{
					var query = {
					  match: {
						_all: $scope.searchtext
					  }
					};	
				}
				else
				{
					var query = {
				  		match_all: {
				  		}
					}
				}
			
    			//Perform search through client and get a search Promise
      			searchclient.search({
        			index: API_CONF.ELASTIC_INDEX_NAME,
        			type: 'metric',
      				body: {
        				size: $scope.itemsperpagesize,
        				from: $scope.itemssearchfrom,
        				sort:  sort,
        				query: query
      				}
      			}).then(function(resp) {
				//If search is successfull return results in searchResults objects
			        $scope.metricsFilter=resp;
        
      			}, function(err) {
        			console.trace(err.message);
      			});				
				
			};
           
           	$scope.findMetricsByFilter(1);
        },

        template: '<div ng-show="metricsList.length<numberMaxMetrics">'+
        	'<label for="">Search metric by title</label> ' +
			'<input placeholder="--all metrics--" ng-model="searchtext" ng-change="findMetricsByFilter(\'1\')" type="text" id="filterMetricDirective" >' +
			'<div class="filterMetricsPaginationHeader" id="filterMetricsPaginationHeaderDirective">' +
				'<div>' +
					'<label ng-show="metricsFilter.hits.total>1" for="">{{metricsFilter.hits.total}} metrics found</label>'+ 
					'<label ng-show="metricsFilter.hits.total==1" for="">{{metricsFilter.hits.totalt}} metric found</label>'+
					'<label ng-show="metricsFilter.hits.total==0" for="">no metrics found</label>'+							
				'</div>' +
			'</div>' +
			'<div class="filterMetricsPaginationBody createvisualization" id="filterMetricsPaginationBodyDirective">' +
				'<ul class="metrics-list">' +
        			'<li ng-class="{\'metrics-list active\':MetricSelectediId_[metric._source.id]>0,\'metrics-list\':MetricSelectediId_[metric.id]}" name="designer-metrics-num-{{metric.id}}" ng-repeat="metric in metricsFilter.hits.hits track by $index" ><a href="" x-ng-click="clickMetric(metric._source.id, metric._source.title, metric._source.issued);"  title="{{ !MetricSelectediId_[metric._source.id]>0 && \'Add \' || \'Delete \' }} \'{{metric._source.title}}\'">{{metric._source.title}} - {{ metric._source.issued | date:\'longDate\' }}</a></li>' +
        		'</ul>' +        		
				'<div class="filterMetricsPagination" id="filterMetricsPaginationDirective">' +
					'<button ng-show="metricsFilter.hits.total>1" ng-disabled="pagToSearch==1"  class="btn btn-warning" ng-click="findMetricsByFilter(\'prev\')">' +
						'<span class="glyphicon glyphicon-chevron-left"></span>  Previous' +
					'</button>' +
					'<button ng-show="metricsFilter.hits.total>1" ng-disabled="metricsFilter.hits.total<=pagToSearch*itemsperpagesize" class="btn btn-warning pull-right" ng-click="findMetricsByFilter(\'next\')">' +	
						'Next <span class="glyphicon glyphicon-chevron-right"></span>' +
					'</button>' +
				'</div>' +		
			'</div>' +
        '</div>' +
        '</div>' +
        '<div class="createvisualization" ng-show="metricsList.length>=numberMaxMetrics">' +        
        	'<ul class="metrics-list">' +
        		'<li class="metrics-list active" ng-repeat="metric in metricsList track by $index" ><a href="" x-ng-click="clickMetric(metric.id, metric.title, metric.issued);" title="Delete \'{{metric.title}}\'">{{metric.title}} - {{ metric.issued | date:\'longDate\' }}</a></li>' +
        	'</ul>' +
        '</div>' +
        '<div><hr></div>'
        
    };
}])


;