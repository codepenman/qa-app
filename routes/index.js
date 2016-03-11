/**
 * @Author: Harish
 * @Version: v1.0
 */

module.exports = function (app) {
	app.get("/", function(req, res){
		res.render("index", {"title":"Q&A Session"});
	});
};