module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'assets/angular/angular.js',
      'assets/angular-route/angular-route.js',
      'assets/angular-resource/angular-resource.js',
      'assets/angular-mocks/angular-mocks.js',
      'app/**/*.js',
      'app/*.js',
      'app/test/unit/**/*.js'
    ],
    
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    
    plugins : [
               'karma-chrome-launcher',
               'karma-jasmine'
               ]
   
  });
};