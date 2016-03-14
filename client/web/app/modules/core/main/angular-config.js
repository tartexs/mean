(function (ApplicationConfiguration) {
  'use strict';

  // Setting HTML5 Location Mode
  angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(AngularConfiguration);

  AngularConfiguration.$inject = ['$locationProvider', '$httpProvider'];

  function AngularConfiguration($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('AuthInterceptor');
  }
}(ApplicationConfiguration));
