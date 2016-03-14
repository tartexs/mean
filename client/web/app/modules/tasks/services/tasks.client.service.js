(function () {
  'use strict';

  angular
      .module('core')
      .factory('Tasks', Tasks);

  Tasks.$inject = ['MEANRestangular'];

  function Tasks(MEANRestangular) {
    var service = {
      create: create,
      getAll: getAll,
    };
    return service;

    function create(task) {
      return MEANRestangular.all('tasks').post(task);
    }

    function getAll() {
      return MEANRestangular.all('tasks').getList();
    }
  }
}());
