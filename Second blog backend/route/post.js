const express = require('express');
const router = express.Router();
const {makePost, getAllPost, getPost, deletePost, updatePost, likePost} = require('../controllers/post')
const {verify} = require('../middleware/verify')

router.post('/new-post', verify, makePost);           // Authenticated user creates a post
router.get('/allpost', getAllPost);                   // Public route to view all posts
router.get('/getpost/:id', getPost);                  // Public route to view a single post
router.put('/editpost/:id', verify, updatePost);      // Authenticated user edits their post (id from token/body)
router.delete('/deletepost', verify, deletePost);     // Authenticated user deletes their post (id from token/body)
router.post('/postlike/:id', verify, likePost);           // Authenticated user likes a post




module.exports = router;          