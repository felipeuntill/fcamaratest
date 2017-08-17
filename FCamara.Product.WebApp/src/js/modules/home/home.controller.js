﻿(function () {

    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope'];

    function HomeController(UserService, $rootScope) {

        var vm = this;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

})();