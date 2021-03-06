(function() {

    'use strict';

    angular
        .module(APP_NAME)
        .controller('TestsController', TestsController)
        .controller('TestQuestionsController', TestQuestionsController)
        .controller('TestsStartController', TestsStartController)
        .controller('TestsResponsesController', TestsResponsesController);

    TestsController
        .$inject = [
            '$location',
            '$routeParams',
            '$route',
            'Test',
            'Course',
            'MessageService',
            'RedirectService',
            'ModalService',
            'PermissionsService'
        ];

    function TestsController($location, $routeParams, $route, Test, Course, MessageService, RedirectService, ModalService, PermissionsService) {
        
        var vm = this;

        vm.createTest      = createTest;
        vm.updateTest      = updateTest;
        vm.retrieveCourse  = retrieveCourse;
        vm.c_delete        = c_delete;
        vm.delete_modal_id = "confirmDeleteTest";

        vm.courses  = [];

        activate();

        function activate() {
            if (!($routeParams.id === undefined)) {
                vm.test = Test.get({
                    id: $routeParams.id
                }, function() { 
                    Course.coursesForTest(function(data) {
                        vm.courses = data;
                        retrieveCourse();
                    });
                    console.log("edit");
                });
            } else {
                vm.test = new Test();
                Test.query(function(data) {
                    vm.tests = data;
                    Course.coursesForTest(function(data) {
                        vm.courses = data;
                        PermissionsService.verifyPermissions(['permission.courses.globally_manipulate', 'permission.courses.teach', 'permission.courses.take_part'], function(permissions) {
                            vm.permissions = permissions;
                        });
                    });
                });
                console.log("view");
            }            
        }

        function createTest() {
            vm.test.$save(function() {
                MessageService.sendMessage('test.created.success');
                RedirectService.redirect("/tests");
            },
            function(err) {
                MessageService.sendMessage('test.created.error');
                RedirectService.redirect("/tests");
            });
        };

        function updateTest() {
            vm.test.$update(function() {
                MessageService.sendMessage('test.updated.success');
                RedirectService.redirect("/tests");
            },
            function(err) {
                MessageService.sendMessage('test.updated.error');
                RedirectService.redirect("/tests");
            });
        }

        function c_delete(id) {
            Test.delete({
                id: id
            }, function() {
                MessageService.sendMessage('test.deleted.success');
                RedirectService.redirect("/tests");
            },
            function(err) {
                MessageService.sendMessage('test.deleted.error');
                RedirectService.redirect("/tests");
            });
        }

        function retrieveCourse() {
            vm.course = Course.get({id: vm.test.course_id});
        }
    };

    TestQuestionsController
        .$inject = [
            '$location',
            '$routeParams',
            '$route',
            'Test',
            'Course',
            'Question',
            'MessageService',
            'RedirectService',
            'ModalService'
        ];

    function TestQuestionsController($location, $routeParams, $route, Test, 
                        Course, Question, MessageService, RedirectService, ModalService) {
        
        var vm = this;

        vm.removeQuestion = removeQuestion;
        vm.searchQuestions = searchQuestions;
        vm.clearSearch = clearSearch;
        vm.selectQuestion = selectQuestion;
        vm.selectAllQuestions = selectAllQuestions;
        vm.addSelected = addSelected;

        vm.selectedQuestions = [];
        vm.questions = [];
        vm.test = Test.get({id: $routeParams.id});
        vm.refresh = false;
        initialize();

        function initialize() {
            vm.test = Test.get({ id: $routeParams.id }, function(data){
                if(vm.refresh) {
                    searchQuestions();
                    vm.refresh = false;
                }
            });
        }

        function searchQuestions() {
            Test.searchQuestions({id: vm.test.id, search_string: vm.searchString}, function(data) {
                vm.questions = [];
                for(var i = 0; i < data.length; i++) {
                    var question = data[i];
                    if(!isDuplicate(question) && data[i] !== undefined) {
                        vm.questions.push(question);
                    }
                }
            }); 
            
        }

        function clearSearch() {
            vm.searchString = "";
            vm.questions = [];
            vm.selectedQuestions = [];
        }

        function isDuplicate(question_add) {
            for(var i in vm.test.questions) {
                var question = vm.test.questions[i];
                if(question_add.id == question.id) {
                    return true;
                }
            }
            return false;
        }

        function selectQuestion(question) {
            question.selected = !question.selected;
            if(question.selected) {
                vm.selectedQuestions.push(question); 
            } else {
                var newSelectedQuestions = [];
                for(var i in vm.selectedQuestions) {
                    var searchQuestion = vm.selectedQuestions[i];
                    if(searchQuestion.id != question.id) {
                        newSelectedQuestions.push (searchQuestion);
                    }
                }
                vm.selectedQuestions = newSelectedQuestions;
            }
        }

        function selectAllQuestions(selection) {
            for (var i = 0; i < vm.questions.length; i++) {
                    vm.questions[i].selected = selection;
                    vm.selectedQuestions.push(vm.questions[i]);
            }
        }

        function addSelected() {
            // only do the request if questions are not added!
            if(vm.selectedQuestions.length > 0) {
                Test.addQuestions({id: vm.test.id}, {questions: vm.selectedQuestions}, function(data) {
                    MessageService.sendMessage('test.questions.added.success');
                    vm.refresh = true;
                    initialize();
                }, function(data) {
                    MessageService.sendMessage('test.questions.added.error');
                });
            }
        }

        function removeQuestion(question_id) {
            vm.test.$removeQuestion({question_id: question_id}, function(data) {
                MessageService.sendMessage('test.questions.removed.success');
                vm.refresh = true;
                vm.test = Test.get({id: $routeParams.id}, function(data) {
                    searchQuestions();
                });
            }, function(data) {
                MessageService.sendMessage('test.questions.removed.error');
            });
        }
    }

    TestsStartController.$inject = ['$timeout', '$routeParams', 'Test', 'Question', 'Response', 
                                     '$scope', 'lodash', 'MessageService', 'RedirectService']
    function TestsStartController($timeout, $routeParams, Test, Question, Response, $scope, lodash, 
                                    MessageService, RedirectService) {
        var vm = this;
        vm.responses = [];
        vm.next_question = next_question;
        vm.response = new Response();
        vm.last_question = false;
        vm.prepare_summary = prepare_summary;
        vm.display_summary = false;
        vm.first_question = true;
        vm.submit_test = submit_test;
        // yes, this could be a directive..
        // could be... :)
        vm.tickInterval = 1000;
        vm.clock = 0;
        vm.counter = 0;
        var tick = function() {
            vm.counter = vm.counter + 1;
            formatTime();
            $timeout(tick, vm.tickInterval); 
        }
        function formatTime() {
            var min = Math.floor(vm.counter / 60);
            var sec = Math.floor(vm.counter % 60);
            vm.clock = ((min < 10) ? "0" : "") + min + ":" + ((sec < 10) ? "0" : "") + sec;
        }
        //end of directive ;)

        // Start the timer
        $timeout(tick, vm.tickInterval);

        function intialize() {
            Test.get({id: $routeParams.id}, function(data) { 
                vm.test = data;
                vm.question_tracker = 0;
                vm.question = vm.test.questions[vm.question_tracker];
                if(vm.test.questions.length == 1)
                    vm.last_question = true;
                set_current(vm.question.id);
            });
        } 

        function set_current(question_id) {
            Question.show({id: question_id}, function(data){
                vm.choices = data.choices;
                if(vm.responses[vm.question_tracker] === undefined) {
                    vm.keys = lodash.fill(Array(vm.choices.length), false);
                } else {
                    vm.keys = vm.responses[vm.question_tracker].keys;
                }
            });
        }

        function next_question(next) {
            if(vm.question_tracker < vm.test.questions.length) {
                vm.responses[vm.question_tracker] = {
                    keys: vm.keys,
                    question_id: vm.question.id,
                    response: vm.response.text
                }
            }
            vm.question_tracker = vm.question_tracker + next;
            if(vm.question_tracker == 0) {
                vm.first_question = true;
            } else if (vm.question_tracker < 0) {
                vm.question_tracker = vm.question_tracker + 1;
                vm.first_question = true;
                return;
            }else {
                vm.first_question = false;
            }
            // avoid overflow and weird javascript errors
            if(vm.question_tracker != vm.test.questions.length && vm.question_tracker >= 0) {
                vm.question = vm.test.questions[vm.question_tracker];
                set_current(vm.test.questions[vm.question_tracker].id);
                if(vm.responses[vm.question_tracker] === undefined) {
                    vm.response = new Response();
                } else {
                    vm.response.text = vm.responses[vm.question_tracker].response;
                }
            }
            if(vm.question_tracker == (vm.test.questions.length - 1)) {
                vm.last_question = true;
                vm.display_summary = false;
            } else if(vm.question_tracker == vm.test.questions.length) {
                    vm.prepare_summary();
                    vm.last_question = false;
            } else {
                vm.last_question = false;
            }
           
        }
        function prepare_summary() {
            vm.summary = [];
            for(var i = 0; i < vm.test.questions.length; i++) {
                if(vm.responses[i] !== undefined) {
                    var s_response = vm.responses[i];
                    vm.summary.push({
                        keys: s_response.keys,
                        style: vm.test.questions[i].style,
                        response: s_response.response,
                        question_id: vm.test.questions[i].id
                    });
                } else {
                    vm.summary.push({
                        is_response: false
                    });
                }
            }
            vm.display_summary = true;
        }

        function submit_test() {
            Test.submitResponses({id: vm.test.id, summary: vm.summary}, 
                function(data){
                     MessageService.sendMessage('test.submitted.success');
                     RedirectService.redirect("/tests/");
                },
                function(err) {
                    MessageService.sendMessage('test.submitted.error');
                     RedirectService.redirect("/tests/");
                }
            );

        }

        intialize();
    }

    TestsResponsesController.$inject = ['Test', '$routeParams'];

    function TestsResponsesController(Test, $routeParams) {
        var vm = this;
        Test.getSummary({id: $routeParams.id}, function(data){
            vm.summary  = data.summary;
            vm.test_name = data.test_name;
        });
    }
})();
