(function () {
  'use strict';

  angular
    .module('core')
    .filter('groupBy', groupBy);

  groupBy.$inject = ['filterStabilize'];

  function groupBy(stabilize) {
    return stabilize(groupByFilter);

    function groupByFilter(data, key) {
      var result = {};
      var index;

      if (data && key) {
        for (index = 0; index < data.length; index++) {
          if (!result[data[index][key]]) {
            result[data[index][key]] = [];
          }

          result[data[index][key]].push(data[index]);
        }
      }

      return result;
    }
  }
}());
