'use strict';

// Init the application configuration module for AngularJS application
/* exported ApplicationConfiguration */
/* exported */
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'meanweb';
  var applicationModuleVendorDependencies = ['ui.router', 'ui.utils', 'ui.bootstrap',
    'ngStorage', 'restangular', 'ngAnimate', 'angular-loading-bar'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule,
  };
}());

console.log(ApplicationConfiguration.applicationModuleName);
