
pcApp.controller('CommonController', function($scope, SimpleFactory) {
	$scope.customers = [];

	init();
	
	function init() {
		$scope.customers = SimpleFactory.getCustomers();
	}
	$scope.addCustomer = function() {
		$scope.customers.push({
			name: $scope.newCustomer.name, 
			city: $scope.newCustomer.city
			});
	};
});