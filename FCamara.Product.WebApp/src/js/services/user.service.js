(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];

    function UserService($http) {

        var service = {};
        var serviceHttpPath = "http://localhost:1960";

        service.Create = Create;
        service.List = List;

        return service;

        function Create(user) {
            return $http.post(serviceHttpPath + '/account/register', user).then(handleSuccess, handleError('Não foi possível registrar o usuário'));
        }

        function List() {
            return $http.get(serviceHttpPath + '/account/users').then(handleSuccess, handleError('Não foi possível registrar o usuário'));
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
