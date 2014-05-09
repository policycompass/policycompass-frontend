
pcApp.factory('SimpleFactory', function() {
	var customers =  [
	        			{name: 'Dave Smith', city: 'New York'}, 
	        			{name: 'John Doe', city: 'Boston'}, 
	        			{name: 'Sarah Miller', city: 'Chicago'}
	        			];
	var factory = {};
	factory.getCustomers = function() {
		return customers;
	};

	return factory;
});