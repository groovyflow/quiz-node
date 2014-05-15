var quizapp = angular.module("quizapp", [])

quizapp.config(["$routeProvider",
    function ($routeProvider) {
        $routeProvider.when('/results', {
            controller: "ResultsCtrl",
            templateUrl: "templates/results.html"
        }).when('/questions', {
            controller: "QuestionsCtrl",
            templateUrl: "templates/questions.html"
        }).otherwise({redirectTo: "/questions"});
    }]);

//Should we use promises here? https://docs.angularjs.org/api/ng/service/$q
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

//Stackoverflow on sharing data between controllers: http://stackoverflow.com/questions/18227090/angularjs-sharing-data-between-controllers
//Besides the DataSharing service below it suggests:
// $rootScope.$broadcast('UPDATE_CLIENT_DATA', clientDataObject);
// and listening to the broadcast with: $scope.$on('UPDATE_CLIENT_DATA', function ( event, clientDataObject ) { ... });
quizapp.factory("DataSharing", function() {
    return {}
});

quizapp.controller("ResultsCtrl", function($scope, DataSharing){
   $scope.data = DataSharing.data;
});

quizapp.controller("QuestionsCtrl", function ($scope, $location, NextQuestion, DataSharing) {
    $scope.data = {};
    function bindAndReact(data){
        console.log("status is " + data.status);
        if(data.status === 'continue'){
            $scope.data = data.data;
        }else{
          DataSharing.data = data.result;
          $location.path("/results");
        }
    }

    //Passing in $scope.data and binding there doesn't work!!
    NextQuestion.initial("NONE", "", bindAndReact);

    $scope.nextQuestion = function (answer) {
        if (isEmpty(answer)) {
            $('#questionsForm .error').text("Please choose an answer before submitting").show().fadeOut(3000);
        }
        else {
            NextQuestion.initial($scope.data, answer, bindAndReact);
        }
    };
});
