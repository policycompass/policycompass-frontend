describe('Metrics Controller Spec', function() {
	
	var helloCtrl;
	
	beforeEach(module("pcApp.controllers.metric"));
	beforeEach(inject(function($controller) {
		helloCtrl = $controller("HelssloController");
	}));
	
	describe("HelloController", function() {
		if("should hava a message of hello", function() {
			expect(helloCtrl.message).toBe("Hello");
		});
	});
	
});