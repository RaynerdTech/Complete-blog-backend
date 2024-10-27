const Comment = require('../models/commentSchema');
const postModel = require('../models/postSchema');
const userModel = require('../models/usersSchema');

const postComment = async (req, res) => {
  const { text } = req.body;  // Extract comment text from the request body
  const { userId } = req.user;  // Extract user ID from the JWT payload
  const postId = req.params.postId;  // Extract postId from the route params

  try {
    // Check if the same comment already exists for this post by the same user
    const existingComment = await Comment.findOne({ text, postId, commentorId: userId });
    if (existingComment) {
      return res.status(400).json({ message: "Oops! You've already said that" });
    }

    // Create and save a new comment
    const newComment = new Comment({ text, commentorId: userId, postId });
    const savedComment = await newComment.save();

    // Update the post model to include the new comment
    await postModel.findByIdAndUpdate(postId, {
      $push: { comment: savedComment._id }, // Ensure `comments` matches your schema
    });

    res.status(201).json({ message: "Commented successfully", comment: savedComment });
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(500).json({ error: "Unable to post comment" });
  }
};



 
//EDIT COMMENT 
const editComment = async (req, res) => {
  const { text } = req.body;  // Get comment text from the request body
  const { userId: userId } = req.user;  // User ID from `verify` middleware
  const { commentId } = req.params; // Extract commentId from the URL parameters

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    console.log("commentorId:", comment.commentorId, "userId:", userId);

    // Ensure the user owns the comment before allowing edit
    if (comment.commentorId.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own comment" });
    }
    
    // Validate that the text is provided 
    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },  // Only update the text
      { new: true }
    );

    res.status(200).json({ message: "Comment updated successfully", comment: updatedComment });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Could not edit comment" });
  }
};



// Like or unlike comment
const likeComment = async (req, res) => {
  const { commentId } = req.params; // Extract comment ID from URL parameters
  const { userId: userId } = req.user; // Get user ID from JWT payload

  try {
    // Fetch the user's latest data from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const name = user.userName; // Get the updated user name

    // Fetch the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likesArray = comment.likes;
    const isLiked = likesArray.includes(name);

    if (!isLiked) {
      likesArray.push(name); // Like the comment
    } else {
      const index = likesArray.indexOf(name);
      likesArray.splice(index, 1); // Unlike the comment
    }

    comment.likes = likesArray;
    await comment.save(); // Save the updated comment instance

    res.status(200).json({ message: 'Like status updated', comment });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error updating like status' });
  }
};


// Delete comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params; // Extract comment ID from URL parameters
  const { userId: userId } = req.user; // Get user ID from JWT payload

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Ensure the user owns the comment before allowing delete
    if (comment.commentorId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own comment' });
    }

    // Delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId); // Use the model directly

    res.status(200).json({ message: 'Comment deleted successfully', comment: deletedComment });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error deleting comment' });
  }
};



// Get all comments for a specific post
const getComments = async (req, res) => {
  const { postId } = req.params; // Extract post ID from URL parameters

  try {
    // Fetch comments associated with the post and populate the commentor's name
    const comments = await Comment.find({ postId }).populate('commentorId', 'userName');

    if (!comments || comments.length === 0) {
      return res.status(200).json({ message: 'No comments found', comments: [] });
    }

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching comments' });
  }
};



module.exports = { postComment, editComment, likeComment, deleteComment, getComments };
