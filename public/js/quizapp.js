var quizapp = angular.module("quizapp", [])

quizapp.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider.when('/questions', {
            controller: "QuestionsCtrl",
            templateUrl: "templates/questions.html"
        }).otherwise({redirectTo: "/questions"});
    }]);

quizapp.service("NextQuestion", function($http){
  this.initial = function(prevQuestion, answer, callback) {
      $http({
      method: "POST",
      url: 'quiz/reply',
      responseType: 'json',
      data: {prevQuestion: prevQuestion || 'NONE', answer: answer || ""}
  }).success(function (data, status) {
          callback(data);
      }).error(function (data, status) {
          $('#questionsForm .error').text("Unsuccessful request").show().fadeOut(3000);
      });
    }

});

quizapp.controller("QuestionsCtrl", function ($scope, NextQuestion) {
    function dataBind(data){
        $scope.data = data.data;
    }
    $scope.data = {};

    //Passing in $scope.data and binding there doesn't work!!
    NextQuestion.initial("NONE", "", dataBind);

    $scope.nextQuestion = function (answer) {
        if (isEmpty(answer)) {
            $('#questionsForm .error').text("Please choose an answer before submitting").show().fadeOut(3000);
        }
        else {
            NextQuestion.initial($scope.data, answer, dataBind);
        }
    };
});
