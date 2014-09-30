/**
 * Main Controller for the Search Manager.
 * Provides a search function with input a search query.
 */
(function() {

  var searchmodule = angular.module('pcApp.search.controllers', ['pcApp.search.services.search', 'pcApp.config']);

  var searchMainController = function($scope, $location, searchclient, esFactory, API_CONF) {
	 //Init Selectable number of items per page
	$scope.itemsPerPageChoices = [
    { id: 10, name: '10'},
    { id: 20, name: '20'},
    { id: 30, name: '30'}
    ]; 
	 
	// Set Search Fire Event
	goSearch = function(){
      if ((typeof $scope.searchQuery == "undefined")||($scope.searchQuery =="")){
	    searchText = ""
	  }
	  else{
	  searchText = $scope.searchQuery
	  }
      $scope.search(searchText);
	} 
	
    //Define function that fires search when page changes
    $scope.pageChanged = function() {
         goSearch();
    };

    //Define function that fires search when Items Per Page selection box changes
     $scope.itemsPerPageChanged = function() {
		 $scope.itemsperPage = $scope.selectedItemPerPage.id;
		 goSearch();
    };
    
    //Define Main search function
    $scope.search = function(searchQuery) {

	if (typeof searchQuery == 'undefined') {searchQuery = ""};
 	//Get current result item offset depending on current page
	itemOffset = ($scope.currentPage -1) * $scope.itemsperPage
	//Build query
	if (searchQuery != "") {
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
    //Perform search through client and get a search Promise
      searchclient.search({
        index: API_CONF.ELASTIC_URL.replace("/", ""),
        type: 'metric',
      body: {
        size: $scope.itemsperPage,
        from: itemOffset,
        query: query
      }
      }).then(function(resp) {
		//If search is successfull return results in searchResults objects
        $scope.searchResults = resp.hits.hits;
        $scope.searchResultsCount = resp.hits.total;
        $scope.totalItems = $scope.searchResultsCount;
      }, function(err) {
        console.trace(err.message);
      });

    };
    
  $scope.init = function() {
    //Set Pagination defaults
 	//Default value for how many pages to show in the page navigation control
    $scope.paginationSize = 5;
    //Default values for how many items per page
    $scope.itemsperPage = 10
    //Default current page
    $scope.currentPage = 1;
    
    //Default search query
    searchQuery ="";
    
    //Search for first time
    $scope.search(searchQuery);


  };
  // runs once per controller instantiation
  $scope.init();
  };


  searchmodule.controller("searchMainController", searchMainController);

}());
