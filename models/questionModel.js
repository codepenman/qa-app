/**
 * @Author: Harish
 * @Version: v1.0
 *
 * Model for a question.
 * Data this model contains
 *    a. ID
 *    b. Question
 *    c. Answer: {Text and/or Image} - answerModel
 *    e. Asked_By
 *    f. Session Posted
 */

var answerModel = require('./answerModel');

module.exports = function (id,
						   question,
						   hasAnswer,
						   answer,
						   asked_by_name,
						   session_id) {
	var _id = id;
	var _question = question;
	var _hasAnswer = hasAnswer;
	var _answer = answer;
	var _asked_by_name = asked_by_name;
	var _session_id = session_id;

	this.getId = function()	{
		return _id;
	};

	this.getQuestion = function()	{
		return _question;
	};

	this.getHasAnswer = function()	{
		if(_hasAnswer == undefined || _hasAnswer == null) {
			return false;
		}
		return _hasAnswer;
	};

	this.getAnswer = function()	{
		if(_answer == undefined || _answer == null) {
			return new answerModel();
		}
		return _answer;
	};

	this.getAskedBy = function()	{
		return _asked_by_name;
	};

	this.getSessionId = function()	{
		return _session_id;
	};

	this.setId = function(id)	{
		_id = id;
	};

	this.setQuestion = function(question)	{
		_question = question;
	};

	this.setHasAnswer = function(hasAnswer)	{
		_hasAnswer = hasAnswer;
	};

	this.setAnswer = function(answer)	{
		_answer = answer;
	};

	this.setAskedBy = function(asked_by_name)	{
		_asked_by_name = asked_by_name;
	};

	this.setSessionId = function(session_id)	{
		_session_id = session_id;
	}
};
