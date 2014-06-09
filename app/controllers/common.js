
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

pcApp.controller('DateController', function ($scope) {

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

});