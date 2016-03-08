(function() {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = [];

  /* @ngInject */
  function HomeController() {
    var vm = this;
  }
})();