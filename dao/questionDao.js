/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This module is responsible to talk with
 * QuestionAndAnswers Collection.
 *
 * Anybody who wants to talk with QuestionAndAnswers collection
 * should come through Question DAO.
 *
 */

var COLLECTION_NAME = "QuestionAndAnswers";

var dbCon = require('../db_services/connection');

var sessionDao = require('./sessionDao');
var tagsDao = require('./tagsDao');

var questionModel = require('../models/questionModel');
var answerModel = require('../models/answerModel');
var sequenceGenerator = require('../db_services/sequenceGenerator');

module.exports = {
	/* This method will add a new questionModel in given session.
	 *	Validating duplicate questions is out of current req scope.
	 * */
	postQuestion: function (question_model, cb) {
		function _postQuestion(err, unique_id) {
			if (err) {
				return cb(err, unique_id); // unique_id will be undefined
			}

			var question_data = {
				"_id": unique_id,
				"question": question_model.getQuestion(),
				"asked_by_name": question_model.getAskedBy(),
				"hasAnswer": question_model.getHasAnswer()
			};

			var queAndAnsCollection = dbCon.getConnection().collection(COLLECTION_NAME);

			queAndAnsCollection.insertOne(question_data, function (err, result) {
				if (err) {
					return cb(err);
				}
				return tagsDao.tagSession(question_data._id, question_model.getSessionId(), cb);
			});
		}

		sessionDao.isValidSessionId(question_model.getSessionId(), function(err, session)	{
			if(session) //If there is a valid session add the question..
				return sequenceGenerator.getNextSequence(COLLECTION_NAME, _postQuestion);
			cb(); // If there is no valid session, then notify user the same.
		});
	},

	postAnswer: function (answer, cb) {
		var _answer = {
			"text": answer.getText(),
			"image_url": answer.getImageUrl(),
			"answered_by_name": answer.getAnsweredBy()
		};

		var filter = {_id: parseInt(answer.getQuestionId())};
		var update = {$set: {"hasAnswer": true, "answer": _answer}};
		var options = {};

		var queAndAnsCollection = dbCon.getConnection().collection(COLLECTION_NAME);

		queAndAnsCollection.findOneAndUpdate(filter, update, options, function (err, result) {
			if (err) {
				return cb(err);
			}
			return cb(err, result.value);
		});
	},

	fetchQuestions: function (session_id, cb) {
		function _fetchQuestions(err, question_ids) {
			if (err) {
				return cb(err);
			}
			if (question_ids == null || question_ids == undefined) {
				return cb();
			}
			var queAndAnsCollection = dbCon.getConnection().collection(COLLECTION_NAME);
			var query = {_id: {$in: question_ids}};

			var cursor = queAndAnsCollection.find(query);
			cursor.toArray(function (err, questions) {
				var _questionModels = [];

				for (var i = 0; i < questions.length; i++) {
					var _answerModel = {};
					if (questions[i].hasAnswer) {
						_answerModel = new answerModel(questions[i]._id,
							questions[i].answer.text,
							questions[i].answer.image_url,
							questions[i].answer.answered_by_name);
					}

					var _questionModel = new questionModel(questions[i]._id,
						questions[i].question,
						questions[i].hasAnswer,
						_answerModel,
						questions[i].asked_by_name,
						session_id);

					_questionModels.push(_questionModel);
				}

				return cb(null, _questionModels);
			});
		}

		return tagsDao.fetchQuestionsTaggedWith(session_id, _fetchQuestions);
	}
};