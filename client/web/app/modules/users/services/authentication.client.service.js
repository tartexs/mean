(function() {
  'use strict';

	// Authentication service for user variables
	angular
		.module('users')
		.factory('Authentication', Authentication);

	Authentication.$inject = ['$rootScope', '$state', '$localStorage', 'MEANRestangular'];

  function Authentication($rootScope, $state, $localStorage, MEANRestangular) {
    var auth = {
      user: $localStorage.user,
      login: login,
      logout: logout,
      signup: signup,
      forgot: forgot,
      reset: reset,
      token: token,
      getToken: getToken
    };

    if ($localStorage.token) {
      // Update previous headers
      var headers = MEANRestangular.defaultHeaders;
      headers['Authorization'] = 'JWT ' + $localStorage.token;
      // Set default headers
      MEANRestangular.setDefaultHeaders(headers);
    }

    return auth;

    // implementations

    function getToken() {
      return $localStorage.token;
    }

    /**
     * Do user login
     * param credentials: {email: user_email, password: user_password}
     */
    function login(credentials) {
      return MEANRestangular.all('token').post(credentials)
        .then(loginCompleted)
        .catch(loginFailed);

      function loginCompleted(response) {
        auth.user = response.user;
        $localStorage.user = response.user;
        $localStorage.token = response.token;
        // Update previous headers
        var headers = MEANRestangular.defaultHeaders;
        headers['Authorization'] = 'JWT ' + $localStorage.token;
        // Set default headers
        MEANRestangular.setDefaultHeaders(headers);

        // broadcast user logged message and user data
        $rootScope.$broadcast('user-login', response.user);

        return response.user;
      }

      function loginFailed(err) {
        throw 'Login Failed';
      }
    }

    /**
     * Do user logout
     */
    function logout() {
      auth.user = null;
      delete $localStorage.user;
      delete $localStorage.token;
      delete $localStorage.getstated;
      delete $localStorage.uuid;

      // Update previous headers
      var headers = MEANRestangular.defaultHeaders;
      headers['Authorization'] = undefined;
      // Set default headers
      MEANRestangular.setDefaultHeaders(headers);

      $state.go('home');

      // broadcast user logout message
      $rootScope.$broadcast('user-logout');
    }

    /**
     * Do user signup
     * param credentials: {firstName, lastName, email, password, ...}
     */
    function signup(credentials) {
      return MEANRestangular.all('users').post(credentials)
        .then(signupCompleted)
        .catch(signupFailed);

      function signupCompleted(response) {
        return response;
      }

      function signupFailed(err) {
        throw err;
      }
    }

    /**
     * Password forgot/recovery
     * param credentials : object {email: example@domain.name}
     */
    function forgot(credentials) {
      return MEANRestangular.one('auth').post('forgot', credentials)
        .then(forgotCompleted)
        .catch(forgotFailed);

      function forgotCompleted(response) {
        return response;
      }

      function forgotFailed(err) {
        throw err.data;
      }
    }

    /**
     * Password reset
     * param token: password reset token
     * param credentials : object {password: password}
     */
    function reset(token, credentials) {
      return MEANRestangular.one('auth', 'reset').post(token, credentials)
        .then(resetCompleted)
        .catch(resetFailed);

      function resetCompleted(response) {
        return response;
      }

      function resetFailed(err) {
        throw err.data;
      }
    }

    /**
     * Password reset token validation
     * param token: token to validate
     */
    function token(token) {
      return MEANRestangular.one('auth', 'reset').customGET(token)
        .then(validateCompleted)
        .catch(validateFailed);

      function validateCompleted(response) {
        return response;
      }

      function validateFailed(err) {
        throw err.data;
      }
    }
  }

})();
