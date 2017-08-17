(function () {

    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope'];

    function HomeController(UserService, $rootScope) {

        var vm = this;

        initController();

        function initController() {
            loadAllUsers();
        }

        function loadAllUsers() {
            UserService.List()
            .then(function (response) {
                    vm.users = response;
                });
        }
    }

})();