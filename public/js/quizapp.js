var quizapp = angular.module("quizapp", [])

quizapp.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider.when('/questions', {
            controller: "QuestionsCtrl",
            templateUrl: "templates/questions.html"
        }).otherwise({redirectTo: "/questions"});
    }]);

//To do.  Use a service or pull out the frequent $http call into an inner function
//No more data.data
quizapp.controller("QuestionsCtrl", function ($scope, $http) {
     //We want to use this function, but need to do something with the promise.  See app.js, and see http://stackoverflow.com/questions/17414093/jquerys-when-done-for-angularjs
    //$q, mentioned there, is useful when waiting for many things to return, even if we don't need it here
    //Or make this a service.
    //Or just pass in a function that does something in the success, and one that does something in the error.
    /*function remote(prevQuestion, answer) {
        $http({
            method: "POST",
            url: 'quiz/reply',
            responseType: 'json',
            data: {prevQuestion: prevQuestion || 'NONE', answer: answer || ""}
        }).success(function (data, status) {
                $scope.data = data.data;
            }).error(function (data, status) {
                $('#questionsForm .error').text("Unsuccessful request").show().fadeOut(3000);
            });
    } */

    $scope.data = {};
    $http({
        method: "POST",
        url: 'quiz/reply',
        responseType: 'json',
        data: {prevQuestion: 'NONE', answer: ""}
    }).success(function (data, status) {
            $scope.data = data.data;
        }).error(function (data, status) {
            $('#questionsForm .error').text("Unsuccessful request").show().fadeOut(3000);
        });

    $scope.nextQuestion = function (answer) {
        if (isEmpty(answer)) {
            $('#questionsForm .error').text("Please choose an answer before submitting").show().fadeOut(3000);
        }
        else {
            console.log("The chosen answer is " + answer);
            //console.long("The question is " + $scope.data.data.question)
            $http({
                method: "POST",
                url: 'quiz/reply',
                responseType: 'json',
                data: {prevQuestion: $scope.data, answer: answer}
            }).success(function (data, status) {
                    $scope.data = data.data;
                }).error(function (data, status) {
                    $('#questionsForm .error').text("Unsuccessful request").show().fadeOut(3000);
                });
        }
    };


});
