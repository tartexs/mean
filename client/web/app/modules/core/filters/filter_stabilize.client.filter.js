(function () {
  'use strict';

  angular
    .module('core')
    .factory('filterStabilize', filterStabilize);

  filterStabilize.$inject = ['memoize'];

  function filterStabilize(memoize) {
    return service;

    function service(fn) {
      return memoize(filter);

      function filter() {
        var args = [].slice.call(arguments);
        // always pass a copy of the args so that the original input can't be modified
        args = angular.copy(args);
        // return the `fn` return value or input reference (makes `fn` return optional)
        return fn.apply(this, args) || args[0];
      }
    }
  }
}());
