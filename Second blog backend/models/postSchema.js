const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true, 
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ensures only authenticated users can create posts
    },
    tags: {
      type: [String], // Array of strings to allow multiple tags
      default: [],
    },
    previewPix: {
      type: String,
      default: '',
    },
    detailPix: {
      type: String,
      default: '',
    },
    likes: {
      type: [String],
      ref: 'User',
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: [mongoose.Schema.Types.ObjectId], // Store Comment IDs
      ref: 'Comment',
      default: [],
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` automatically
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
