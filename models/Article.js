var mongoose = require('mongoose');
var Comment = require("./Comment");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
 },
  link: {
    type: String,
  },
  summary: {
    type: String,
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

//export model
module.exports = Article;
