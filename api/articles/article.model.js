const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'], 
    default: 'draft'
  },
  createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

let Article;

try {
  Article = mongoose.model('Article');
} catch (error) {
  // Only create the model if it doesn't already exist
  Article = mongoose.model('Article', articleSchema);
}

module.exports = Article;