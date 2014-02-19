var _ = require('underscore')

module.exports = function(app) {
    var firstQuestionId = 'id0';

    app.get('/quiz', function(req, res) {
        res.sendfile('./public/index.html');
    });

    //TODO Get data from mongoDb
    var questionData = {
        id0: {question: "What kind of work environment do you prefer?",
            options: [
                {text: "Intense.", next: 'id5', result: null},
                { text: "Friendly.", next: 'id17', result: null}
            ]
        },
        id5: { question: "Please choose a favorite hobby from the options below:",
            options: [
                {text: "Tinkering with cars.", next: null, result: 'id9'},
                { text: "Reading the newspaper. ", next: null, result: 'id8'}
            ]
        },
        id17: {question: "What is your favorite food?",
            options: [
                {text: "Smoked salmon", next: null, result: 'id12'},
                { text: "Smoked cigarette butt", next: null, result: 'id13'}
            ]
        }
    };

    var resultData = {
      id9 : {text: "You are suited for the motor industry."},
      id8 : {text: "You are ready to become a tycoon."},
      id12: {text: "Your future is in the financial sector."},
      id13: {text: "You are unlikely to find steady work."}
    };

    app.post('/quiz/reply', function(req, res){
        function makeReply(question, result) {
            if(_.isEmpty(question)) return {result: result, status: 'done'};
            else return {data: question, status: 'continue'};
        }

        if(req.body.prevQuestion === "NONE"){
            console.log("Finding initial question");
            var firstQuestion = questionData[firstQuestionId];
            console.log("initial question is " + JSON.stringify(firstQuestion));
            res.send(makeReply(firstQuestion));
        }
        else{
            console.log("We have a previous question. It is " + JSON.stringify(req.body.prevQuestion));
            //TODO  Persist the answer and the questionId for the current user!!
            var chosenOption = req.body.prevQuestion.options[req.body.answer]
            console.log("chosenOption is " + chosenOption)

            if(_.isEmpty(chosenOption.next)){
                res.send(makeReply({}, resultData[chosenOption.result]))
            }else {
                console.log("next is " + chosenOption.next)
                var nextQuestion = questionData[chosenOption.next];
                console.log("next question is " + JSON.stringify(nextQuestion))
                res.send(makeReply(nextQuestion))
            }
        }
    });


 


};