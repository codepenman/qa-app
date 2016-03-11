/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This module is responsible to talk with QASession Collection.
 *
 * Anybody who wants to talk with QASession collection should come
 * through Session DAO.
 */

var COLLECTION_NAME = "QASession";

var dbCon = require('../db_services/connection');
var Session = require('../models/sessionModel');
var sequenceGenerator = require('../db_services/sequenceGenerator');

module.exports = {
	createQASession: function (session_model, cb) {
		sequenceGenerator.getNextSequence(COLLECTION_NAME, function (err, unique_id) {
			if (err) {
				return cb(err, unique_id);
			}

			var session_data = {
				"_id": unique_id,
				"host": session_model.getHost(),
				"start_time": session_model.getStartTime(),
				"end_time": session_model.getEndTime()
			};

			var qASessionCollection = dbCon.getConnection().collection(COLLECTION_NAME);

			qASessionCollection.insertOne(session_data, function (err, result) {
				return cb(err, session_data._id);
			});
		});
	},

	getQASession: function (session_id, cb) {
		return _getQASession(session_id, cb);
	},

	isValidSessionId : function(session_id, cb)	{
		return _getQASession(session_id, cb);
	}
};

var _getQASession = function(session_id, cb)	{
	var qASessionCollection = dbCon.getConnection().collection(COLLECTION_NAME);

	qASessionCollection.findOne({_id: parseInt(session_id)}, function (err, session) {
		if (err) {
			return cb(err);
		}
		if(session == null)	{
			return cb();
		}
		var session_model = new Session(session.host,
			session.start_time,
			session.end_time,
			session._id);
		return cb(null, session_model);
	});
};
