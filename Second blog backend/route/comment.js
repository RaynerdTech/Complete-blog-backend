const express = require('express');
const router = express.Router();
const {postComment, editComment, likeComment, deleteComment, getComments} = require('../controllers/comment')
const {verify} = require('../middleware/verify')

// Route to post a new comment on a specific post
router.post('/posts/:postId/comments', verify, postComment);

// Route to edit a specific comment by its ID
router.put('/comments/:commentId', verify, editComment);

// Route to like or unlike a specific comment by its ID
router.patch('/comments/:commentId/like', verify, likeComment);

// Route to delete a specific comment by its ID
router.delete('/comments/:commentId', verify, deleteComment);

// Route to get all comments for a specific post (no verification needed if public)
router.get('/posts/:postId/comments', getComments); 

module.exports = router;