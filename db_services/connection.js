/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This Handler is responsible for creating the connection
 * to MongoDB.
 *
 * Connection is created only once and as part of the server start.
 *
 * Server is not started, if connection to database is failed.
 */

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/slyce";
var dbConnection = null;

module.exports = {
	connect: function(cb)	{
		MongoClient.connect(url, function (err, _db) {
			if (err) {
				cb(err)
			}
			console.log("Connected to Mongo DB in Server");
			dbConnection = _db;
			cb();
		});
	},

	getConnection: function()	{
		return dbConnection;
	},

	close: function()	{
		dbConnection.close();
	}
};