/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This module responsibility is to Tag a question
 * and store it in the database for future mining.
 */

var COLLECTION_NAME = "Tags";

var dbCon = require('../db_services/connection');

module.exports = {
	/*
	* This method will tag the question with session.
	* This will increase performance while accessing.
	* @param[questionId]: Question that should be tagged.
	* @param[sessionId]: Session Id that should be tagged with.
	* */
	tagSession: function (question_id, session_id, cb) {
		var tagCollection = dbCon.getConnection().collection(COLLECTION_NAME);

		var filter = { "_id": parseInt(session_id)};
		var update = {$push: {"questions": parseInt(question_id)}};
		var options = {
			upsert: true
		};

		tagCollection.updateOne(filter, update, options, function(err, tag)	{
			return cb(err, question_id);
		});
	},

	fetchQuestionsTaggedWith : function(session_id, cb)	{
		var tagCollection = dbCon.getConnection().collection(COLLECTION_NAME);

		tagCollection.findOne({_id: parseInt(session_id)}, function(err, sessionTaggedQuestions)	{
			if(err)	{
				return cb(err);
			}
			if(sessionTaggedQuestions)	{
				return cb(err, sessionTaggedQuestions.questions);
			}
			return cb();
		});
	}
};


