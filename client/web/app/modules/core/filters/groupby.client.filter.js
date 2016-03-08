(function() {
  'use strict';

  angular
    .module('core')
    .filter('groupBy', groupBy);

  var results = {};

  groupBy.$inject = ['filterStabilize']

  function groupBy(stabilize) {
    var self = this;
    return stabilize(groupByFilter);

    ////////////////

    function groupByFilter(data, key) {
      if (!(data && key)) return;

      var result = {};
      for (var i = 0; i < data.length; i++) {
        if (!result[data[i][key]])
          result[data[i][key]] = [];
        
        result[data[i][key]].push(data[i]);
      }

      return result;
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('core')
    .factory('filterStabilize', filterStabilize);

  filterStabilize.$inject = ['memoize'];

  /* @ngInject */
  function filterStabilize(memoize) {
    return service;

      ////////////////      
    function service(fn) {

      function filter() {
        var args = [].slice.call(arguments);
        // always pass a copy of the args so that the original input can't be modified
        args = angular.copy(args);
        // return the `fn` return value or input reference (makes `fn` return optional)
        var filtered = fn.apply(this, args) || args[0];
        return filtered;
      }

      var memoized = memoize(filter);
      return memoized;
    }
  }
})();


(function() {
  'use strict';

  angular
    .module('core')
    .factory('memoize', memoize);

  memoize.$inject = [];

  /* @ngInject */
  function memoize() {
    return service;

    ////////////////
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
})();