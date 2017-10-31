var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  title: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  body: {
    type: String,
    required: true,
    date: {
    	type: Date,
    	default: Date.now
    }
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
