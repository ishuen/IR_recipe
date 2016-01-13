var mongoose = require('mongoose');
var json = require('json-file');

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

// var rec = mongoose.model('rec', r);
var recipe = mongoose.model('recipe', r);
var i = 1432;
var count = 1;
var p1 = function(i, count){
	return new Promise(function(resolve, reject){
		resolve(Insert(i, count));
	})
};
p1(i, count).then(function(){
console.log('completed.');
}).catch(function(error){
	console.log(error);
});


function Insert(i, count){
	var j = 1;
	while(j <= i){
		var file = json.read('./'+i+'.json');
		// var file = json.read('./1.json');
	// 	console.log(file.data[0]);
		var k = 0;
		while(file.data[k] != undefined){
			var newData = Object();
			// console.log(file.data[k]);
			console.log('j:'+j+' count:'+count);
			newData = file.data[k];
			// var n = new rec(newData);
			var n = new recipe(newData);
			n.save(function(err, data){
				if (err) return handleError(err);
				else
					console.log('successfully added.');
			});
			k++;
			count++;
		}
		j++;
	}
}

	
	
