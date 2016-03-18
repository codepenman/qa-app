/**
 * @Author: Harish
 * @Version: v1.0
 *
 * Model for a question.
 * Data this model contains
 *    a. ID
 *    b. Host
 *    c. Start
 *    d. End
 */

module.exports = function (host,
						   start_time,
						   end_time,
						   id) {
	var _host = host;
	var _start_time = start_time;
	var _end_time = end_time;
	var _id = id;

	this.getHost = function () {
		return _host;
	};

	this.getStartTime = function () {
		return _start_time;
	};

	this.getEndTime = function()	{
		return _end_time;
	}

	this.getId = function()	{
		return _id;
	}
};