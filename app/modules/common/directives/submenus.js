angular.module('pcApp.common.directives.submenus', [

])

.directive("createSubmenu", function () {
    return {
        restrict: "E",
        template: '<div class="row">' +
            '<div class="glyphicon-effect-wrap glyphicon-effect">' +
        '<a  href="#!/metrics/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Metric</span></a>' +
        '<a  href="#!/visualizations/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Visualisation</span></a>' +
        '<a  href="#!/events/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Historical Event</span></a>' +
        '<a  href="#!/models/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">FCM</span></a>' +
        '</div>' +
        '</div>'
    };
})
    .directive("createSubmenuTemp", function () {
        return {
            restrict: "E",
            template: '<div class="row">' +
                '<div class="glyphicon-effect-wrap glyphicon-effect">' +
                '<a  href="#!/metrics/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Metric</span></a>' +
                '<a  href="#!/visualizations/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Visualisation</span></a>' +
                '<a  href="#!/events/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Historical Event</span></a>' +
                '<a  href="#!/models/create"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">FCM</span></a>' +
                '</div>' +
                '</div>'
        };
    })
.directive("browseSubmenu", function () {
    return {
        restrict: "E",
        template: '<div class="row navbar-fixed-top secondBar">' +
            '<div class="glyphicon-effect-wrap glyphicon-effect">' +
            '<a  href="#!/metrics"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Metrics</span></a>' +
            '<a  href="#!/visualizations"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Visualisations</span></a>' +
            '<a  href="#!/events"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">Historical Events</span></a>' +
            '<a  href="#!/models"><span class="glyphicon glyphicon-style glyphicon-ok"></span><span class="glyphicon-effect-link">FCMs</span></a>' +
            '</div>' +
            '</div>'
    };
});

