(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];

    function LoginController($location, AuthenticationService, FlashService) {

        var vm = this;

        vm.login = login;

        (function initController() {
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password)
                .then(function (response) {
                    if (response.success) {
                        AuthenticationService.SetCredentials(response.token);
                        FlashService.Success('Usuário Logado com Sucesso', true);
                        $location.path('/');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        };
    }

})();
