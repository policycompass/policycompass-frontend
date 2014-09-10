(function() {

    var searchmodule = angular.module('pcApp.search');

    var searchMainController = function($scope,  $location) {

		 $scope.search = function(searchQuery) {
			//Call to Search Service here
			$scope.searchResults = "Search Results will be placed here";
			alert(searchQuery);
		};
    };

    searchmodule.controller("searchMainController", searchMainController);

}());
