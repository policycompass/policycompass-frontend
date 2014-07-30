'use strict';

describe('Events Controller Spec', function() {

    beforeEach(module('ngRoute'));
    beforeEach(module('pcApp.events'));

    describe('EventDetailController', function(){
        var scope, metDetCtrl;

        beforeEach(inject(function($rootScope, $routeParams, $controller){
            $routeParams.eventId = 1;
            scope = $rootScope.$new();
            metDetCtrl = $controller('EventDetailController',{
                $scope: scope
            });
        }));

        it('should have a message',function(){
            expect(scope.event).toHaveBeenCalled;
        });

    } );


});