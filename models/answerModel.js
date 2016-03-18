/**
 * @Author: Harish
 * @Version: v1.0
 *
 * Model for a question.
 * Data this model contains
 *    a. questionID - Each answer will be mapped to a Question
 *    b. Text - Text component of the answer
 *    c. Image_url - Image component of the answer.
 *    d. Answered_By - Host Name who answers the question
 */

module.exports = function (question_id,
						   text,
						   image_url,
						   answered_by_name) {
	var _question_id = question_id;
	var _text = text;
	var _image_url = image_url;
	var _answered_by_name = answered_by_name;

	this.getQuestionId = function () {
		return _question_id;
	};

	this.getText = function () {
		return _text;
	};

	this.getImageUrl = function () {
		return _image_url;
	};

	this.getAnsweredBy = function () {
		return _answered_by_name;
	}
};
