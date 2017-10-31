//require request and cheerio to scrape
var request = require('request');
var cheerio = require('cheerio');
//Require models
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');
//dependencies
var path = require('path');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var logger = require("morgan");
var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: true }));

app.use(express.static("public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
	defaultLayout: "main" 
}));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://heroku_5c63m63b:nju5decskeup6kh4hpbda1guts@ds241875.mlab.com:41875/heroku_5c63m63b");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function() {
	console.log("Connected to Mongoose");
});

//index
app.get("/", function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  Article.find({"saved": true}).populate("comments").exec(function(error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("article", hbsObject);
  });
});

// A GET request to scrape the Verge website
app.get("/scrape", (req, res) => {
  request("https://www.theonion.com/", function(error, response, html) {
    const $ = cheerio.load(html);
    const titlesArr = [];
    $(".headline--wrapper").each((i, element) => {
      var result = {};
        result.title = $(element).children("a").children("h3").text();
        result.link = $(element).children("a").attr("href");
        result.summary = $(element).children("p").text();

        if(result.title !== "" && result.link !== "") {
        	if(titlesArr.indexOf(result.title) == -1) {
        		titlesArr.push(result.title);
        		Article.count({title: result.title}, function(err, test) {
        			if(test == 0) {
				        var entry = new Article(result);
				        //save entry to mongodb
				        entry.save(function(err, doc) {
				          if (err) {
				            console.log(err);
				          } else {
				            console.log(doc);
				          }
				        });
			        }
	        	});
        	} else {
        		console.log("Article already exists.");
        	}
      	} else {
      		console.log("Not saved to DB; missing data.");
      	}
    });
    // after scrape, redirects to index
    res.redirect('/');
  });
});

app.get("/articles", function(req, res) {
  //allows newer articles to be on top
  Article.find({})
    //send to handlebars
    .exec(function(err, doc) {
      if(err){
        console.log(err);
      } else{
        var artcl = {article: doc};
        res.render('index', artcl);
      }
    });
});

app.get("/articles/:id", function(req, res) {
	Article.findOne({"_id": req.params.id})
	.populate("comment")
	.exec(function(error, doc) {
		if (error) {
			res.send(error);
		} else {
			res.json(doc);
		}
	});
});

//clear all articles for testing purposes
app.get('/clearAll', function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('removed all articles');
    }
  });
  res.redirect('/articles');
});
// saves the articles 
app.post("/articles/save/:id", function(req, res) {
	Article.findOneAndUpdate({"_id": req.params.id}, {"saved":true})
	.exec(function(err, doc) {
		if (err) {
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});
// deletes articles
app.post("/articles/delete/:id", function(req, res) {
	Article.findOneAndUpdate(
		{"_id": req.params.id}, 
		{"saved": false, "comments": []})
	.exec(function(err, doc) {
		if (err) {
			res.send(err);
		} else {
			res.send(doc);
		}
	});
});
// Create a new comment
app.post('/comments/save/:id', function(req, res) {
  //using the Comment model, create a new comment
  var newComment = new Comment({
  	title: req.params.id,
  	body: req.body.text
  });

  newComment.save(function(err, comment) {
    if (err) {
      res.send(err);
    } else {
      Article.findOne(
        {"_id": req.params.id},
        {$push: {"comments": comment} })
      //execute everything
      .exec(function(err, doc) {
        if (err) {
          res.send(err);
        } else {
        	res.send(comment);
          res.redirect('/comments/:id');
        }
      });
    }
  });
});
//deletes comments
app.delete("/comments/delete/:comment_id/:article_id", function(req, res) {
	Comment.findOneAndRemove({"_id": req.params.article_id}, function(err) {
    if (err) {
      res.send(err);
    } else {
      Article.findOneAndUpdate(
        { "_id": req.params.article_id }, 
        {$pull: {"comments": req.params.comment_id}})
	   .exec(function(err) {
		    if (err) {
			   res.send(err);
		    } else {
			   res.send("Comment has been deleted.");
		    }
    	});
    }
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
