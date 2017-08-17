(function () {

    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {

        $routeProvider

            // Página Inicial
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'src/js/modules/home/home.view.html',
                controllerAs: 'vm'
            })

            // Página de Login
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'src/js/modules/login/login.view.html',
                controllerAs: 'vm'
            })

            // Página de Registro
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'src/js/modules/register/register.view.html',
                controllerAs: 'vm'
            })

            // Quando não for identificada uma rota redireciona para o login
            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function run($rootScope, $location, $cookies, $http) {

        // Mantém o usuário logado depois de registrado.
        $rootScope.globals = $cookies.getObject('globals') || {};

        if ($rootScope.globals.token)
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.token;

        $rootScope.$on('$locationChangeStart', function (event, next, current) {

            // Redireciona o usuário para o login se ele não estiver autenticado e não estiver nas páginas /login ou /register
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.token;

            if (restrictedPage && !loggedIn)
                $location.path('/login');

        });
    }

})();