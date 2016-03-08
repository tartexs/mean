(function() {
  'use strict';

  angular
    .module('core')
    .factory('MEANRestangular', MEANRestangular);

  MEANRestangular.$inject = ['$cacheFactory', 'Restangular'];

  /* @ngInject */
  function MEANRestangular($cacheFactory, Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('https://localhost:3000/api/v1/');

      // Default headers without cache and empty access token
      RestangularConfigurer.setDefaultHeaders({
        'x-access-token': undefined,
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });
    });
  }
})();