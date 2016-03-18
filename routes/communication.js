/**
 * @Author: Harish
 * @Version: v1.0
 */

//Load DAO modules
var sessionDao = require('../dao/sessionDao');
var questionDao = require('../dao/questionDao');

//Load Model modules
var sessionModel = require('../models/sessionModel');
var questionModel = require('../models/questionModel');
var answerModel = require('../models/answerModel');

module.exports = function (app) {
	app.post("/createQASession", createQASession);
	app.get("/getQASession/:session_id", getQASession);
	app.post("/postQuestion", postQuestion);
	app.post("/postAnswer", postAnswer);
	app.get("/getQuestions/:session_id", getQuestions);
};

/*
* This method will Create Question and Answer session
* */
var createQASession = function (req, res) {
	/*
	* Fetch parameters required to create session.
	* */
	var host = req.body.host;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;

	console.log(req.body.host);
	/*
	* If any input value is null,
	* return with custom error message.
	* */
	if(host == null || start_time == null || end_time == null)	{
		return res.status(400).send({"message": "Some input values are null."});
	}
	console.log(req.body.host);
	/*
	* If start time is greater than end time,
	* return custom error message
	* */
	if(start_time >= end_time)	{
		return res.status(400).send({"message": "Start time should be lesser than End Time."});
	}

	/*
	* After validation, I create a Session Data Model.
	* Pass to Session DAO(Data Access Object) to create session.
	* */
	var _sessionModel = new sessionModel(host, start_time, end_time);

	console.log(req.body.host);
	sessionDao.createQASession(_sessionModel, function (err, session_id) {
		if (err) {
			res.status(503).end();
			return;
		}
		return res.status(200).send({"session_id": session_id});
	})
};

/*
* This method will fetch Session Model, if there is one session
* defined by user given session_id
* */
var getQASession = function (req, res) {
	var session_id = req.params.session_id;

	sessionDao.getQASession(session_id, function (err, session) {
		if (err) {
			res.status(503).end();
			return;
		}
		if (session == null || session == undefined) {
			res.status(400).send({"message": "Session not found"});
			return;
		}
		var _session = {
			"id": session.getId(),
			"host": session.getHost(),
			"start_time": session.getStartTime(),
			"end_time": session.getEndTime()
		};
		return res.status(200).send({"session": JSON.stringify(_session)});
	})
};

/*
* This function will post question in the current Q & A Session.
* If there is no one such session, it will return error message
* with 400 status.
* */
var postQuestion = function (req, res) {
	/*
	* Fetch all the parameters required to create a Question
	* */
	var session_id = req.body.session_id;
	var question = req.body.question;
	var asked_by_name = req.body.asked_by_name;

	/*
	* Create a question data model, and pass it on to
	* question DAO to handle the data insertion into database..
	* */
	var _questionModel = new questionModel();
	_questionModel.setSessionId(session_id);
	_questionModel.setQuestion(question);
	_questionModel.setAskedBy(asked_by_name);

	questionDao.postQuestion(_questionModel, function (err, question_id) {
		if (err) {
			res.status(503).end();
			return;
		}
		if (question_id == null || question_id == undefined) {
			res.status(400).send({
				"message": "Session not found, " +
				"Please enter valid session id."
			});
			return;
		}
		return res.status(200).send({"question_id": question_id});
	});
};

/*
* This function is responsible to update the answer for an
* existing Question.
* If question is not present,
* it will throw an custom error to user.
* */
var postAnswer = function (req, res) {
	var question_id = req.body.question_id;
	var text = req.body.answer_text;
	var image_url = req.body.image_url;
	var answered_by_name = req.body.answered_by_name;

	var answer = new answerModel(question_id,
		text,
		image_url,
		answered_by_name);

	questionDao.postAnswer(answer, function (err, result) {
		if (err) {
			return res.status(503).end();
		}
		if (result == null || result == undefined) {
			return res.status(400).send({
				"message": "Question not found, " +
				"Please enter valid question id."
			});
		}
		return res.status(200).send({"message": "Answer posted successfully"});
	});
};

/*
* This function is responsible to fetch all the questions
* that belongs to a given session.
* Data is sent to client in the Array format.
* Each element in an array is an object.
* Object is of structure:- {
* 	questionId,
* 	question,
*	hasAnswer, -> To filter out if this question into answered/un-answered classes
*	answer
*	image_url
*	asked_by
*	answered_by
* }
* */
var getQuestions = function (req, res) {
	var session_id = req.params.session_id;

	questionDao.fetchQuestions(session_id, function (err, questions) {
		if (err) {
			return res.status(503).end();
		}
		if (questions == null || questions == undefined) {
			return res.status(400).send({
				"message": "Session not found, " +
				"Please enter valid session id."
			});
		}

		function questionsList(questions) {
			var allQuestions = [];
			for (var i = 0; i < questions.length; i++) {
				var aQ = {
					"id": questions[i].getId(),
					"question": questions[i].getQuestion(),
					"hasAnswer": questions[i].getHasAnswer(),
					"asked_by_name": questions[i].getAskedBy()
				};

				if (questions[i].getHasAnswer()) {
					aQ.answer_text = questions[i].getAnswer().getText();
					aQ.image_url = questions[i].getAnswer().getImageUrl();
					aQ.answered_by_name = questions[i].getAnswer().getAnsweredBy();
				}

				allQuestions.push(aQ);
			}
			return res.status(200).send({"questions": JSON.stringify(allQuestions)});
		}

		return questionsList(questions);
	});
};