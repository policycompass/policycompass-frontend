/**
 * Controllers for common purposes
 */

angular.module('pcApp.common.controllers', [

])

/****
Used to search metrics using ekasticsearch api
******/
/*
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

.factory('Progress', function (ngProgress, $http) {
    var timer;
    return {    	
        start: function () {
        	ngProgress.color('#f6921e');
            var me = this;
            // reset the status of the progress bar
            me.reset();
            // if the `complete` method is not called
            // complete the progress of the bar after 5 seconds
            timer = setTimeout(function () {
                me.complete();
            }, 5000);
            
            $http({method: 'GET', url: '/app'})
      		.success(function(data, status, headers, config) {
          		me.complete();
       		});
            
        },
        complete: function () {
            ngProgress.complete();
            if (timer) {
                // remove the 5 second timer
                clearTimeout(timer);
                timer = null;
            }
        },
        reset: function () {             
            if (timer) {
                // remove the 5 second timer
                clearTimeout(timer);
                // reset the progress bar
                ngProgress.reset();
            }
            // start the progress bar
            ngProgress.start();
        }
    };
})
     

.controller('CommonController', ['$scope', '$location', function($scope, $location) {
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
    $(document).on('click',function(e) {
        var link= e.target.id;
        if((link!=="createLink") && ($scope.isCollapsed == false)){
            $scope.isCollapsed = true;
        }
    });
    /* Functions for login Button to call a route.*/
    $scope.go = function ( path ) {
        $location.path( path );
    };
}])

.controller('StaticController', ['$scope', '$modal', function($scope, $modal) {


}])

.controller('CreateDataset2Controller', ['$scope', '$modal', function($scope, $modal) {
	console.log("CreateDataset2Controller");

$scope.classtypedata = [
    { icon: "",   name: "Country",    maker: "",        ticked: false  },
    { icon: "",   name: "Age Class",  maker: "",        ticked: false },
    { icon: "",   name: "Gender",     maker: "",    	ticked: false  }
]; 
$scope.classtypedata2 = [
    { icon: "",   name: "Country",    maker: "",        ticked: false  },
    { icon: "",   name: "Age Class",  maker: "",        ticked: false },
    { icon: "",   name: "Gender",     maker: "",    	ticked: false  }
]; 

$scope.gendermultiselect = [
    { icon: "",   name: "Male",    maker: "",        ticked: false  },
    { icon: "",   name: "Female",  maker: "",        ticked: false },
    { icon: "",   name: "Death Rate",     maker: "",    	ticked: false  }
];


}])	

.controller('CreateFormulaController', ['$scope', '$modal', function($scope, $modal) {
	console.log("CreateFormulaController");

$scope.classtypedata = [
    { icon: "",   name: "Child Mortality",    maker: "",        ticked: true  },
    { icon: "",   name: "Drug Consumption",  maker: "",        ticked: false },
    { icon: "",   name: "Life Expectancy",     maker: "",    	ticked: true  },
    { icon: "",   name: "Unemployment",     maker: "",    	ticked: false  },
    { icon: "",   name: "CO2 Emissions",     maker: "",    	ticked: false  },
    { icon: "",   name: "Traffic Deatchs",     maker: "",    	ticked: false  }
    
]; 
$scope.classtypedata2 = [
    { icon: "",   name: " ~ GDP",    maker: "",        ticked: true  },
    { icon: "",   name: " ~ Happy Planet Index",  maker: "",        ticked: false },
    { icon: "",   name: "~ Social Progress Index",     maker: "",    	ticked: false  },
    { icon: "",   name: "~ Better life Index",     maker: "",    	ticked: false  },
    { icon: "",   name: "u my_happyness_index",     maker: "",    	ticked: false  },
    { icon: "",   name: "u my_health_metric",     maker: "",    	ticked: false  }
]; 




}])

.controller('CreateFormula2Controller', ['$scope', '$modal', function($scope, $modal) {
	console.log("CreateFormula2Controller");

$scope.classtypedata = [
    { icon: "",   name: "Education",    maker: "",        ticked: false  },
    { icon: "",   name: "Economy",  maker: "",        ticked: false },
    { icon: "",   name: "Justice",     maker: "",    	ticked: false  }
    
]; 

$scope.classtypedata2 = [
    { icon: "",   name: "Education",    maker: "",        ticked: false  },
    { icon: "",   name: "Economy",  maker: "",        ticked: false },
    { icon: "",   name: "Justice",     maker: "",    	ticked: false  }
    
]; 




}])	
.controller('CreateFormula3Controller', ['$scope', '$modal', function($scope, $modal) {
	console.log("CreateFormula3Controller");

$scope.classtypedata = [
    { icon: "",   name: "2002",    maker: "",        ticked: true  },
    { icon: "",   name: "2003",  maker: "",        ticked: false },
    { icon: "",   name: "2004",     maker: "",    	ticked: false  }
    
]; 

$scope.classtypedata2 = [
    { icon: "",   name: "United Kindom",    maker: "",        ticked: true },
    { icon: "",   name: "Hungary",  maker: "",        ticked: false },
    { icon: "",   name: "Brussels",     maker: "",    	ticked: false  }
    
]; 
$scope.classtypedata3 = [
    { icon: "",   name: "Age group",    maker: "",        ticked: true },
    { icon: "",   name: "Economy",  maker: "",        ticked: false },
    { icon: "",   name: "Justice",     maker: "",    	ticked: false  }
    
]; 




}])	

/**
 * Controller for setting the UI Bootstrap date selection.
 * ToDo: Should be a directive.
 */
.controller('DateController',  ['$scope', function ($scope) {

    $scope.maxDate = new Date();
    $scope.minDate = new Date('1900-01-01');
    $scope.format = "yyyy-MM-dd";
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

}]);
