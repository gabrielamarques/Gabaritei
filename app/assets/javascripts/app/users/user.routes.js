(function() {

    'use strict';

    angular
        .module(APP_NAME)
        .config(UserRoutes);

    UserRoutes.$inject = ['$routeProvider'];

    function UserRoutes($routeProvider) {
        $routeProvider
            .when('/users/new', {
                templateUrl: 'templates/users/new.html',
                controller: 'EditUserController',
                controllerAs: 'Ctrl'
            })
            .when('/users/update/:id', {
                templateUrl: 'templates/users/update.html',
                controller: 'EditUserController',
                controllerAs: 'Ctrl'
            })
            .when('/users', {
                templateUrl: 'templates/users/index.html',
                controller: 'UsersController',
                controllerAs: 'Ctrl'
            })
            .when('/users/:id', {
                templateUrl: 'templates/users/show.html',
                controller: 'UsersController',
                controllerAs: 'Ctrl'
            })
            .when('/users/change_password/:id', {
                templateUrl: 'templates/users/change_password.html',
                controller: 'UsersController',
                controllerAs: 'Ctrl'
            })
            .when('/users/settings/:id', {
                templateUrl: 'templates/users/settings.html',
                controller: 'SettingsController',
                controllerAs: 'Ctrl'
            });
    }

})();