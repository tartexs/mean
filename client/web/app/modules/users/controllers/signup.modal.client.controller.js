(function() {
  'use strict';

  angular
    .module('users')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$timeout', '$state', '$uibModalInstance', 'AuthenticationModal', 'Authentication'];

  /* @ngInject */
  function SignupController($timeout, $state, $uibModalInstance, AuthenticationModal, Authentication) {
    var vm = this;
    // signup button status
    vm.enabled = true;
    // User credentials
    vm.credentials = {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      password: undefined,
      error: undefined,
      success: undefined
    };
    // error messages
    vm.messages = {
      location: "",
      email: "",
      address: "",
      name: "",
      date: ""
    }
    // functions
    vm.signup = signup;
    vm.isValidData = isValidData;


    // Avoid register page when user already login
    if(Authentication.user)
      $state.go('home');

    // do signup
    function signup() {
      if (!isValidData() || !vm.enabled)
        return;

      // disable signup
      vm.enabled = false;

      Authentication.signup(vm.credentials)
        .then(signupCompleted)
        .catch(signupFailed);

      function signupCompleted(user) {
        // Success message
        vm.messages.success = 'Account created. Automatic login into your account';
        // Do automatic login
        var user = {
          email: vm.credentials.email,
          password: vm.credentials.password
        };

        // Try to login new user
        Authentication.login(user)
          .then(loginCompleted)
          .catch(loginFailed);

        // If login failed alert an error
        function loginFailed(err) {
          $loading.close(function(){
            Alert.display("Error", "An error occurred when try to login into your account, please try manually").result
              .then(AuthenticationModal.openLogin)
              .catch(AuthenticationModal.openLogin);
          });
        }

        // When login completed close signup modal
        function loginCompleted(user) {
        }
      }

      // When signup fail alert errros
      function signupFailed(err) {
        vm.error = err.data;
        vm.messages.error = vm.error.message;
        // enable signup
        vm.enabled = true;
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

      // Validate Name
      if ((field && field === 'firstname') || !field) {
        if ((typeof vm.credentials.firstName !== 'undefined') && (vm.credentials.firstName.trim() !== '')) {
          res &= true;
          vm.messages.firstName = null;
        } else {
          res &= false;
          vm.messages.firstName = "Please insert your first name";
        }
      }

      // Validate Last Name
      if ((field && field === 'lastname') || !field) {
        if ((typeof vm.credentials.lastName !== 'undefined') && (vm.credentials.lastName.trim() !== '')) {
          res &= true;
          vm.messages.lastName = null;
        } else {
          res &= false;
          vm.messages.lastName = "Please insert your last name";
        }
      }

      // Email validation
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      // Validate Email
      if ((field && field === 'email') || !field) {
        if (regex.exec(vm.credentials.email) !== null) {
          res &= true;
          vm.messages.email = null;
        } else {
          res &= false;
          vm.messages.email = "Please insert a valid email address";
        }
      }

      // Validate Password
      if ((field && field === 'password') || !field) {
        if ((typeof vm.credentials.password !== 'undefined') && (vm.credentials.password.trim() !== '')) {
          res &= true;
          vm.messages.password = null;
        } else {
          res &= false;
          vm.messages.password = "Please insert your account password";
        }
      }

      return res;
    }
  }
})();
