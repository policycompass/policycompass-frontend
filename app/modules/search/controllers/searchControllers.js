(function() {

    var searchmodule = angular.module('pcApp.search.controllers',['pcApp.search.services.search']);

    var searchMainController = function($scope,  $location,searchclient,esFactory) {
                 //TODO-Search takes input, index,type variables
		 $scope.search = function(searchQuery) {
			searchclient.search({
			  index: 'policycompass_search',
			  type: 'metric'	
			}).then(function (resp) {
			    var hits = resp.hits.hits;
                            $scope.hits = hits
			}, function (err) {
			    console.trace(err.message);
			});

			//Call to Search Service here

			$scope.searchResults = "Search Results will be placed here";
		};
    };

    searchmodule.controller("searchMainController", searchMainController);

}());
