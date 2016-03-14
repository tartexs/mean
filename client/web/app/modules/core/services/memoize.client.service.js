(function () {
  'use strict';

  angular
    .module('core')
    .factory('memoize', memoize);

  memoize.$inject = [];

  function memoize() {
    return service;

    // //////////////
    function service() {
      return memoizeFactory.apply(this, arguments);
    }

    function memoizeFactory(fn) {
      var cache = {};

      function memoized() {
        var args = [].slice.call(arguments);
        var key = JSON.stringify(args);
        var fromCache = cache[key];
        if (fromCache) {
          return fromCache;
        }
        cache[key] = fn.apply(this, arguments);

        return cache[key];
      }

      return memoized;
    }
  }
}());
