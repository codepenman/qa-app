/**
 * @Author: Harish
 * @Version: v1.0
 *
 * This class contains all the unit test cases to test
 * API's related to this Application.
 *
 * Any changes in the API, should be committed only if all the
 * tests in this module pass.
 */

var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where our server is running.
var server = supertest.agent("http://localhost:3000");

//All Unit tests will begin now
describe("Testing all APIs", function () {

	// #1 Create a QA Session
	var host_user = "Steph Curry";
	var start_time = new Date().getTime();
	var end_time = new Date().getTime() + 600000;
	var session_id;

	it("Should Create a QA Session", function (done) {

		server
			.post("/createQASession")
			.send({
				"host": host_user,
				"start_time": start_time,
				"end_time": end_time
			})
			.expect(200) // This is HTTP response
			.end(function (err, res) {
				// HTTP status should be 200
				should(res.status).equal(200);
				session_id = res.body.session_id;
				console.log(session_id);
				done();
			});
	});

	// #2 Retrieve created Session....
	it("Retrieving Creating Session", function (done) {

		server
			.get("/getQASession/" + session_id)
			.expect(200) // This is HTTP response
			.end(function (err, res) {
				// HTTP status should be 200
				should(res.status).equal(200);
				var _session = JSON.parse(res.body.session);
				should(host_user).equal(_session.host);
				should(start_time).equal(_session.start_time);
				should(end_time).equal(_session.end_time);
				done();
			});
	});

	var question = "What is your average daily practise time?";
	var asked_by_name = "Anmol Bhatia";
	var question_id;

	// #3 Post a question in this Session....
	it("Posting a question", function (done) {

		server
			.post("/postQuestion")
			.send({
				"session_id": session_id,
				"question": question,
				"asked_by_name": asked_by_name
			})
			.expect(200) // This is HTTP response
			.end(function (err, res) {
				// HTTP status should be 200
				should(res.status).equal(200);
				question_id = res.body.question_id;
				console.log(res.body.question_id);
				done();
			});
	});

	var text = "I practise for 3 hours";
	var image_url = "https://usatftw.files.wordpress.com/2015/11/steph.jpg?w=1000&h=600&crop=1";
	var answered_by_name = "Steph Curry";

	// #4 Post an answer....
	it("Posting an answer", function (done) {

		server
			.post("/postAnswer")
			.send({
				"question_id": question_id,
				"answer_text": text,
				"image_url": image_url,
				"answered_by_name": answered_by_name
			})
			.expect(200) // This is HTTP response
			.end(function (err, res) {
				// HTTP status should be 200
				should(res.status).equal(200);
				console.log(res.body.message);
				done();
			});
	});

	// #5 Get all the questions for a given session....
	it("Get all the questions", function (done) {

		// calling home page api
		server
			.get("/getQuestions/" + session_id)
			.expect(200) // This is HTTP response
			.end(function (err, res) {
				// HTTP status should be 200
				should(res.status).equal(200);
				console.log(res.body.questions);
				done();
			});
	});
});

describe("Testing all APIs - Invalid Id's", function () {

	var session_id = 0;

	// #1 Retrieve Invalid Session....
	it("Retrieving Invalid Session", function (done) {

		server
			.get("/getQASession/" + session_id)
			.end(function (err, res) {
				// HTTP status should be 400
				should(res.status).equal(400);
				console.log(res.body.session);
				done();
			});
	});

	var question = "What is your average daily practise time?";
	var asked_by_name = "Anmol Bhatia";
	var question_id = 0;

	// #2 Post a question to invalid Session....
	it("Posting a question", function (done) {

		server
			.post("/postQuestion")
			.send({
				"session_id": session_id,
				"question": question,
				"asked_by_name": asked_by_name
			})
			.end(function (err, res) {
				// HTTP status should be 400
				should(res.status).equal(400);
				console.log(res.body.question_id);
				done();
			});
	});

	var text = "I practise for 3 hours";
	var image_url = "https://usatftw.files.wordpress.com/2015/11/steph.jpg?w=1000&h=600&crop=1";
	var answered_by_name = "Steph Curry";

	// #4 Post an answer to invalid question id....
	it("Posting an answer", function (done) {

		server
			.post("/postAnswer")
			.send({
				"question_id": question_id,
				"answer_text": text,
				"image_url": image_url,
				"answered_by_name": answered_by_name
			})
			.end(function (err, res) {
				// HTTP status should be 400
				should(res.status).equal(400);
				console.log(res.body.message);
				done();
			});
	});

	// #5 Try to get all the questions for an invalid session....
	it("Get all the questions", function (done) {

		// calling home page api
		server
			.get("/getQuestions/" + session_id)
			.end(function (err, res) {
				// HTTP status should be 400
				should(res.status).equal(400);
				console.log(res.body.questions);
				done();
			});
	});
});