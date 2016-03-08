(function() {
  'use strict';

  angular
    .module('users')
    .controller('PasswordResetController', PasswordResetController);

  PasswordResetController.$inject = ['$state', '$stateParams', 'Seo', 'Alert', 'Authentication', 'AuthenticationModal'];

  /* @ngInject */
  function PasswordResetController($state, $stateParams, Seo, Alert, Authentication, AuthenticationModal) {
    var vm = this;
    // Reset button text
    vm.buttonText = 'Please wait...';
    // User credentials (password)
    vm.credentials = {
      newPassword: undefined,
      verifyPassword: undefined
    };
    // Messages
    vm.messages = {
      error: undefined,
      password: undefined,
      check: undefined
    };
    // Interaction
    vm.enabled = true;

    // Functions
    vm.doReset = doReset;
    vm.isValidData = isValidData;


    // Page title and description
    Seo.setTitle('Homeswitch - Reset Password');
    Seo.setDescription('Homeswitch password recovery and reset');

    initialize();

    ///////////////

    /**
     * View initialize, check for valid reset token
     */
    function initialize() {
      // Alert of invalid token
      if (!$stateParams.token) {
        // Avoid this page if no token in url
        $state.go('home');
      } else { // Validate token
        // Validate token
        Authentication.token($stateParams.token)
          .then(validateCompleted)
          .catch(validateFailed);
      }

      // If token is valid close loading and continue
      function validateCompleted(data) {
        // If user logged then logut before continue
        if (Authentication.user) {
          Authentication.logout
        }
        // Reset button text
        vm.buttonText = 'Reset';
      }

      // If token is invalid alert error and go home
      function validateFailed(data) {
        Alert.display('Error', 'Password reset token is invalid or has expired').result
          .then(goBack)
          .catch(goBack);
      }

      // return to home
      function goBack() {
        $state.go('home');
      }
    }

    /**
     * Do password reset
     */
    function doReset() {
      // first validate data
      if (!isValidData())
        return;

      // Disable interaction
      vm.enabled = false;
      // Open loading modal
      // Change button text
      vm.buttonText = 'Please wait...';
      // do password recovery
      Authentication.reset($stateParams.token, vm.credentials)
        .then(resetCompleted)
        .catch(resetFailed);

      // if reset success
      function resetCompleted(response) {
        // Reset button text
        vm.buttonText = 'Success';
        // Clear error message
        vm.messages.error = null;
        // Write success message
        vm.messages.success = response;
        // Alert success
        Alert.display('Success', response).result
          .then(openLogin)
          .catch(openLogin);
      }

      // Open login modal
      function openLogin() {
        AuthenticationModal.openLogin().result
          .then(goHome)
          .catch(goHome);

        function goHome() {
          if (!Authentication.user) {
            $state.go('home');
          }
        }
      }

      // if reset failed
      function resetFailed(err) {
        // Reset button text
        vm.buttonText = 'Reset';
        // Re enable interaction
        vm.enabled = true;
        // Clear success message
        vm.messages.success = null;
        // Write error message
        vm.messages.error = err.message;
      }
    }


    /*
     * Check if the form has valid data
     */
    function isValidData(field) {
      // Clear global error message
      vm.messages.error = null;

      // validation result
      var res = true;

      // Validate Password
      if ((field && field === 'password') || !field) {
        if ((typeof vm.credentials.newPassword !== 'undefined') && (vm.credentials.newPassword.trim() !== '')) {
          if ((typeof vm.credentials.verifyPassword !== 'undefined') && (vm.credentials.newPassword !== vm.credentials.verifyPassword)) {
            res &= false;
            vm.messages.check = "Password are no the same";
          } else {
            res &= true;
            vm.messages.check = null;
            vm.messages.password = null;
          }
        } else {
          res &= false;
          vm.messages.password = "Please insert a new account password";
        }
      }

      // Verify Password
      if ((field && field === 'check') || !field) {
        if ((typeof vm.credentials.verifyPassword !== 'undefined') && (vm.credentials.verifyPassword.trim() !== '')) {
          if ((typeof vm.credentials.newPassword !== 'undefined') && (vm.credentials.newPassword !== vm.credentials.verifyPassword)) {
            res &= false;
            vm.messages.check = "Password are no the same";
          } else {
            res &= true;
            vm.messages.check = null;
          }
        } else {
          res &= false;
          vm.messages.check = "Please insert again new account password";
        }
      }

      return res;
    }

  }
})();
