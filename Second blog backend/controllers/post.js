const postModel = require('../models/postSchema');
const userModel = require('../models/usersSchema');

const makePost = async (req, res) => {
  const { title, desc, content, tags, previewPix, detailPix, published } = req.body;
  const { userId: creatorId } = req.user; // Extract user ID from JWT

  const newPost = new postModel({
     title,
     desc,
     content,
     creatorId, // This is linked to the user's ID from the JWT
     tags,
     previewPix,
     detailPix,
     published
  });

  try {
     await newPost.save();
     res.status(201).json({ message: "Post successfully created", post: newPost });
  } catch (error) {
     res.status(500).json({ error: "Cannot create post" });
     console.log(error);
  }
};


const getAllPost = async (req, res) => {
  try {
    const allPosts = await postModel.find()
      .populate({ path: "creatorId", select: "userName email gender" }) // Populate creator's info
      .populate({ path: "comment", select: "text commentorId" }); // Populate comments

    res.status(200).json(allPosts); // Return the fetched posts
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Cannot retrieve posts. Please try again later." });
  }
}


// Update post
const updatePost = async (req, res) => {
  const { id } = req.params;  // Get post ID from route parameters
  const { userId } = req.user;  // Get user ID from `verify` middleware
  const updates = req.body;  // Get fields to update from the request body

  try {
    // Check if the post exists
    const ownerPost = await postModel.findById(id);
    if (!ownerPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the user is the creator of the post
    if (ownerPost.creatorId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own post" });
    }

    // Prevent empty updates   
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No changes provided for update" });
    }

    // Update the post with new values
    const updatedPost = await postModel.findByIdAndUpdate(id, updates, { new: true });

    // If no changes were made (i.e., the post is identical)
    if (!updatedPost) {
      return res.status(304).json({ message: "Post is already up-to-date" });
    }

    // Respond with success and the updated post
    res.status(200).json({ 
      message: "Post updated successfully", 
      updatedFields: updates,  // Send back the fields that were changed
      post: updatedPost 
    });

  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Cannot update post. Please try again later." });
  }
};



const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id)
      .populate({ path: "creatorId", select: "userName email gender" })
      .populate({ 
        path: "comment", 
        select: "text commentorId", 
        populate: { path: "commentorId", select: "userName" } // Populate userName from User model
      });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Cannot get post" });
  }
}


const deletePost = async (req, res) => {
  const { id } = req.params; // Get post ID from the URL parameters
  const { id: userId } = req.user; // Get user ID from the `verify` middleware

  try {
    // Find the post by ID
    const post = await postModel.findById(id);
    
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the user requesting the deletion is the post creator
    if (post.creatorId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own post" });
    }

    // Delete the post
    await postModel.findByIdAndDelete(id);

    // Respond with a success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Could not delete post" });
  }
};



// Add like/unlike feature
const likePost = async (req, res) => {
  const { id } = req.params;  // Get post ID from route parameters
  const { userId } = req.user;  // User ID from JWT

  try {
    // Retrieve the user's name from the database
    const user = await userModel.findById(userId).select("userName");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await postModel.findById(id);  // Find post by ID
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likesArray = post.likes;  // Array of likes (names)
    const userName = user.userName;  // Extract the user's name

    const index = likesArray.indexOf(userName);  // Find the index of the user's name

    if (index === -1) {
      // If not liked, add the user's name
      likesArray.push(userName);
    } else {
      // If already liked, remove the user's name
      likesArray.splice(index, 1);
    }

    post.likes = likesArray;  // Update the post's likes
    await post.save();  // Save changes

    res.status(200).json({ message: "Post like status updated", post });
  } catch (error) {
    console.error(error);  // Log any errors for debugging
    res.status(500).json({ error: "Error processing like/unlike" });
  }
}; 

module.exports = { makePost, getAllPost, getPost, deletePost, updatePost, likePost };
