(function() {

    'use strict';

    angular
        .module(APP_NAME)
        .config(CourseRoutes);

    CourseRoutes.$inject = ['$routeProvider'];

    function CourseRoutes($routeProvider) {
        $routeProvider
            .when('/courses/new', {
                templateUrl: 'templates/courses/new.html',
                controller: 'CoursesController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/update/:id', {
                templateUrl: 'templates/courses/update.html',
                controller: 'CoursesController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/participants/:id', {
                templateUrl: 'templates/courses/participants.html',
                controller: 'CourseParticipantsController',
                controllerAs: 'Ctrl'
            })
            .when('/courses', {
                templateUrl: 'templates/courses/index.html',
                controller: 'CoursesController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:course_id/content/:id', {
                templateUrl: 'templates/contents/show.html',
                controller: 'ContentsController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:course_id/question/:question_id', {
                templateUrl: 'templates/responses/new.html',
                controller: 'CreateResponsesController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:course_id/:resource/:id/recommend', {
                templateUrl: 'templates/recommendations/recommend.html',
                controller: 'RecommendationsController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:id', {
                templateUrl: 'templates/courses/show.html',
                controller: 'CourseShowController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:id/new_lesson', {
                templateUrl: 'templates/courses/new_lesson.html',
                controller: 'LessonsController',
                controllerAs: 'Ctrl'
            })
            .when('/courses/:id/edit_lesson/:lesson_id', {
                templateUrl: 'templates/courses/edit_lesson.html',
                controller: 'LessonsController',
                controllerAs: 'Ctrl'
            });
    }

})();