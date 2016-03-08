(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeadController', HeadController);

  HeadController.$inject = ['Seo'];

  /* @ngInject */
  function HeadController(Seo) {
    var vm = this;
    vm.Seo = Seo;
  }
})();
