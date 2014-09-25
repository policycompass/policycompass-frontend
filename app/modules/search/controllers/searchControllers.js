/**
 * Main Controller for the Search Manager.
 * Provides a search function with input a search query.
 */
(function() {

  var searchmodule = angular.module('pcApp.search.controllers', ['pcApp.search.services.search', 'pcApp.config']);

  var searchMainController = function($scope, $location, searchclient, esFactory, API_CONF) {
    //TODO-Search takes input, index,type variables
    $scope.search = function(searchQuery) {
      searchclient.search({
        index: API_CONF.ELASTIC_URL.replace("/", ""),
        type: 'metric'
      }).then(function(resp) {
        var hits = resp.hits.hits;
        $scope.hits = hits
      }, function(err) {
        console.trace(err.message);
      });

      //Call to Search Service here

      $scope.searchResults = "Search Results will be placed here";
    };
  };

  searchmodule.controller("searchMainController", searchMainController);

}());
