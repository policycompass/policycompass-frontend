module.exports = function(config){
  config.set({

    basePath : '../../',

    files : [
      'app/assets/angular/angular.js',
      'app/assets/angular-route/angular-route.js',
      'app/assets/angular-resource/angular-resource.js',
      'app/assets/angular-mocks/angular-mocks.js',
      'app/*.js',
      'app/!(assets)/*.js',
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