/**
 * @Author: Harish
 * @Version: v1.0
 */

angular.module("qa_app", [])
	.controller("QASessionCntrl", function ($scope, $http) {
		/*
		* This method will make an Asynchronous call to Create Question and Answer
		* session..
		*
		* I am not doing any validation for the data and time input at client side..
		* There are chances that, user input is null.
		* Validations that should be done here are:
		* 	a. Null Check
		* 	b. End time should be greater than Start Time.
		* */
		$scope.createQASession = function () {

			$scope.createSessionReturnMsg = "";

			$http
				.post("/createQASession", {
					"host": $scope.host,
					"start_time": Date.parse($scope.start_time),
					"end_time": Date.parse($scope.end_time)
				})
				.then(function (response) {
					$scope.createSessionReturnMsg = "Your Session Id: " + response.data.session_id;
				}, function (error) {
					console.log(error);
					$scope.createSessionReturnMsg = error.data.message + " Session creation failed, please try again..";
				});
		};

		/*
		* This method will make an Async Call to get Question and Answer Session
		* for the given session Id.
		* */
		$scope.getQASession = function()	{

			$scope.session_data = "";

			var session_id = $scope.session_id;

			$http
				.get("/getQASession/" + session_id)
				.then(function(response){
					$scope.session_data = response.data.session;
				}, function(error){
					$scope.session_data = error.data.message;
				});
		};

		/*
		 * This method will make an Async Call to post question in the current
		 * session. Current session is identified by sessionId give by user.
		 * */
		$scope.askQuestion = function()	{

			$scope.askQuestionReturnMsg = "";

			var session_id = $scope.session_id;
			var question = $scope.question;
			var asked_by_name = $scope.asked_by_name;

			$http
				.post("/postQuestion", {
					"session_id": session_id,
					"question": question,
					"asked_by_name": asked_by_name
				})
				.then(function(response){
					$scope.askQuestionReturnMsg = "Your question Id: " + response.data.question_id +
					"." + " You need this to answer the question later.";
				}, function(error){
					$scope.askQuestionReturnMsg = error.data.message;
				});
		};

		/*
		 * This method will make an Async Call to post answer in the current
		 * session for a given question Id..
		 * */
		$scope.postAnswer = function()	{

			$scope.postAnswerReturnMsg = "";

			var question_id = $scope.question_id;
			var answer_text = $scope.answer_text;
			var image_url = $scope.image_url;
			var answered_by_name = $scope.answered_by_name;

			$http
				.post("/postAnswer", {
					"question_id": question_id,
					"answer_text": answer_text,
					"image_url": image_url,
					"answered_by_name": answered_by_name
				})
				.then(function(response){
					$scope.postAnswerReturnMsg = response.data.message;
				}, function(error){
					$scope.postAnswerReturnMsg = error.data.message;
				});
		};

		/*
		 * This method will make an Async Call to get all the questions
		 * for a given session Id..
		 * */
		$scope.getQuestions = function()	{

			$scope.questions = "";
			$scope.message = "";

			var session_id = $scope.session_id;

			$http
				.get("/getQuestions/" + session_id)
				.then(function(response){
					$scope.questions = response.data.questions;
				}, function(error){
					$scope.message = error.data.message;
				});
		};
	});
