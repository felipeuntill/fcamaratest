(function () {

    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService) {

        var service = {};
        var serviceHttpPath = "http://localhost:1960";

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(username, password, callback) {
            return $http.post(serviceHttpPath + '/account/Login', { username: username, password: password })
                .then(handleSuccess, handleError('Não foi possível registrar o usuário'));
        }

        function SetCredentials(authdata) {

            $rootScope.globals = {
                token: authdata
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

    }

})();