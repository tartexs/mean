(function() {
  'use strict';

  angular
    .module('core')
    .factory('Alert', Alert);

  Alert.$inject = ['$uibModal'];

  /* @ngInject */
  function Alert($uibModal) {
    var service = {
      display: display,
      confirm: confirm
    };
    return service;

    ////////////////

    function display(title, content) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/core/templates/modal_alert.client.template.html',
        windowClass: 'hs-modal',
        controller: 'ModalAlertController as mac',
        resolve: {
          title: function () {
            return title;
          },
          content: function () {
            return content;
          }
        }
      });

      return modalInstance;
    }

    function confirm(title, content, callback) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/core/templates/modal_confirm.client.template.html',
        windowClass: 'hs-modal',
        controller: 'ModalConfirmController as mcc',
        resolve: {
          title: function () {
            return title;
          },
          content: function () {
            return content;
          },
          callback: function () {
            return callback;
          }
        }
      });

      return modalInstance;
    }

  }
})();
