(function() {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$rootScope', 'Tasks', 'Alert', 'Authentication'];

  /* @ngInject */
  function HomeController($rootScope, Tasks, Alert, Authentication) {
    var vm = this;
    
    activate();
    
    $rootScope.$on('user-login', activate);
    $rootScope.$on('user-logout', cleanTasks);

    ////////////////

    function activate() {
      if(Authentication.user) {
        Tasks.getAll()
          .then(successResponse)
          .catch(failedResponse);
      }

      function successResponse(tasks) {
        vm.tasks = tasks;
      }

      function failedResponse(err) {
        Alert.display(err);
      }
    }

    function cleanTasks() {
      vm.tasks = []; 
    }
  }
})();