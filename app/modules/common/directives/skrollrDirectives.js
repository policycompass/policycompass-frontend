angular.module('skrollrDirectives', []).directive('skrollr', function () {
    var directiveDefinitionObject = {
        link: function () {
            skrollr.init();
        }
    };

    return directiveDefinitionObject;
});
