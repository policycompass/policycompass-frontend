module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-resource/angular-resource.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/handsontable/dist/jquery.handsontable.full.js',
    'bower_components/underscore/underscore.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-dialog-service/dialogs.min.js',
    'bower_components/angular-dialog-service/dialogs-default-translations.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'app/**/*.js',
    'app/*.js',
    'test/unit/**/*.js'
    ],

    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    
    plugins : [
               'karma-chrome-launcher',
               'karma-jasmine'
               ]
   
  });
};