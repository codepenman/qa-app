/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This module takes care of creating an unique id.
 * Id is unique only with in a Collection.
 */

var COLLECTION_NAME = "Counters";
var dbCon = require('../db_services/connection');

module.exports = {
	getNextSequence: function (collectionName, cb) {
		query = {'_id': collectionName};
		sort = [];
		update = {'$inc': {seq: 1}};
		options = {'new': true, upsert: true};

		dbCon.getConnection()
			.collection(COLLECTION_NAME)
			.findAndModify(query, sort, update, options, function (err, docs) {
				cb(err, docs.value.seq);
			});
	}
};
