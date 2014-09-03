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
    'app/**/*.js',
    'app/*.js',
    'test/unit/**/*.js'
    ],

    frameworks: ['jasmine'],
    browsers : ['PhantomJS'],
    
    plugins : [
               'karma-chrome-launcher',
               'karma-jasmine',
               'karma-phantomjs-launcher'
               ]
   
  });
};
