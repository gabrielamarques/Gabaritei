(function() {

    'use strict';

    angular
        .module(APP_NAME)
        .config(HomeRoutes);

    function HomeRoutes($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'templates/home/home.html',
                controller: 'HomeController',
                controllerAs: 'Ctrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }

})();
