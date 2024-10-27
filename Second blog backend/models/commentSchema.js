const mongoose = require('mongoose');

// Define the Comment Schema
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, 
    trim: true 
  },

  postId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the related post
    ref: 'Post', 
    required: true
  },
  commentorId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the related post
    ref: 'User', 
    required: true
  },
  likes: {
    type: [String], // Array of user names or IDs who liked the comment
    default: [] 
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
});

// Export the Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

