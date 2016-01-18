var express = require('express');
var router = express.Router();
// var dbFunc = require('../db.js');
var mongoose = require('mongoose');

/* GET home page. */
var title = '甜點食譜';
router.get('/', function(req, res, next) {
  res.render('index', { title: title});
});

var db = mongoose.connection;
mongoose.connect('mongodb://IR_recipe:IRTM123@ds027825.mongolab.com:27825/recipe');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('success connect');
});


process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

var r = new mongoose.Schema({
	view_count:{type: Number},
	ingredient:{type:Object},
	description: {type: String},
	title: {type: String},
	fav_count: {type: Number},
	num_of_people: {type: Number},
	author: {type: String},
	step: {type: Object},
	time: {type: Number},
	tips: {type: String},
	recipe_id: {type:String}
});

var recipe = mongoose.model('recipe', r);

module.exports = function(app){
	var sess = new Object();
	app.get('/', function(req, res){
		if(sess.searchBox != undefined){
			console.log(sess.searchBox);
			if(sess.searchBox == ''){
				// var query = recipe.find().select({'title':1, 'recipe_id':1, 'num_of_people':1, 'time':1, 'description':1});
// 				query.lean().exec(function (err, docs) {
// 					if(err) return handleError(err);
// 					console.log(docs);
// 					// console.log('end searching');
// 					res.render('index', {title: title, data:docs});
// 				});
				res.render('index', {title: title});
			}
			else{
				var id = sess.searchBox;
				var query = recipe.find({'title':{$regex : ".*"+id+".*"}}).select({'title':1, 'recipe_id':1, 'num_of_people':1, 'time':1, 'description':1});
				query.lean().exec(function (err, docs) {
					if(err) return handleError(err);
					console.log(docs);
					// console.log('end searching');
					res.render('index', {title: title, data:docs});
				});
			}
		}
		else res.render('index', { title: title});
	});
	app.get('/view_recipe', function(req, res){
		// console.log(req.query);
		var data = Object();
		// data = dbFunc.showRecipeById('32532');
		// console.log(data);
		var id = req.query.id;
		var query = recipe.findOne({'recipe_id':id});
		query.exec(function (err, docs) {
			if(err) return handleError(err);
			// console.log(docs);
			// console.log('end searching');
			res.render('view_recipe', {title: title, data:docs});
		});
	});
	app.get('/search_result', function(req, res){
		sess.searchBox = req.query.searchBox;
		req.session = sess;
		// console.log(sess.searchBox);
		// console.log(req.session.searchBox);
		res.redirect("/");
	})
}
// module.exports = router;
