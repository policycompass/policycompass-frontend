/**
 * Main Controller for the Search Manager.
 * Provides a search function with input a search query.
 */
(function() {

  var searchmodule = angular.module('pcApp.search.controllers', ['pcApp.search.services.search', 'pcApp.config']);

  var searchMainController = function($scope, $location, searchclient, esFactory, API_CONF) {


    //Define search function to be exposed in html
    $scope.search = function(searchQuery) {
	//Build query
	if (typeof searchQuery != 'undefined') {
			var query = {
				  match: {
					_all: searchQuery
				  }
				};
			}
			else {
			var query = {
				  match_all: {
				  }
				}
				};
    //Perform search
      searchclient.search({
        index: API_CONF.ELASTIC_URL.replace("/", ""),
        type: 'metric',
      body: {
        size: 50,
        query: query
      }
      }).then(function(resp) {
		  //If search is successfull return results in searchResults objects
        $scope.searchResults = resp.hits.hits;
      }, function(err) {
        console.trace(err.message);
      });

    };
    
  $scope.init = function() {
    $scope.search(undefined);
  };
  // runs once per controller instantiation
  $scope.init();
  };


  searchmodule.controller("searchMainController", searchMainController);

}());
