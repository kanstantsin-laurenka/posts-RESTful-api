const fs = require('node:fs/promises');
const path = require('node:path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const { getIO } = require('../socket');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post
      .find()
      .sort({ createdAt: -1 })
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    
    res.status(200).json({ posts, totalItems });
  } catch (e) {
    return next(e); // Correct way to handle errors in async functions
  }
}

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    return next(error); // Correct way to handle errors in async functions
  }
  
  const { title, content } = req.body;
  
  try {
    if (!req.file) {
      const error = new Error('No Image Provided!');
      error.statusCode = 422;
      return next(error); // Correct way to handle errors in async functions
    }
    
    const imageUrl = req.file.path;
    
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId, // Set in is-auth.js Middleware
    });
    
    await post.save();
    
    const user = await User.findById(req.userId);
    user.posts.push(post); // Mongoose will take post._id automatically
    await user.save();
    
    getIO().emit('post', { action: 'create', post: { ...post._doc, creator: { _id: req.userId, name: user.name } } });
    
    res.status(201).json({
      creator: { _id: user._id, name: user.name },
      message: 'Post created successfully!',
      post,
    });
  } catch (e) {
    return next(e); // Correct way to handle errors in async functions
  }
}

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  
  try {
    const post = await Post.findById(postId);
    
    if (!post) {
      const error = new Error('Could not find post!');
      error.statusCode = 404;
      return next(error);
    }
    
    res.status(200).json({ post });
  } catch (e) {
    return next(e); // Correct way to handle errors in async functions
  }
}

exports.editPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.statusCode = 422;
    return next(error);
  }
  
  const { postId } = req.params;
  const { title, content } = req.body;
  let imageUrl;
  
  try {
    const existingPost = await getPostById(postId, next);
    
    if (!existingPost.creator._id.equals(req.userId)) {
      const error = new Error('Forbidden!');
      error.statusCode = 403;
      return next(error);
    }
    
    // If a new image was uploaded, use its path, otherwise keep the old image.
    if (req.file) {
      imageUrl = req.file.path;
      // If the image URL has changed, clear the old image.
      if (existingPost.imageUrl !== imageUrl) {
        await clearImage(existingPost.imageUrl);
      }
    } else {
      imageUrl = existingPost.imageUrl;
    }
    
    existingPost.content = content;
    existingPost.imageUrl = imageUrl;
    existingPost.title = title;
    
    const post = await existingPost.save();
    
    getIO().emit('post', { action: 'update', post });
    res.status(200).json({ message: 'Post Updated!', post });
  } catch (e) {
    return next(e);
  }
}

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  
  try {
    const existingPost = await getPostById(postId, next);
    
    if (!existingPost.creator._id.equals(req.userId)) {
      const error = new Error('Forbidden!');
      error.statusCode = 403;
      return next(error);
    }
    
    const post = await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    
    await user.save();
    await clearImage(existingPost.imageUrl);
    
    getIO().emit('post', { action: 'delete', post: post._id });
    res.status(200).send({ message: `Post with ID ${postId} was successfully removed.`, post: post });
  } catch (e) {
    return next(e); // Correct way to handle errors in async functions
  }
}

const clearImage = async (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  
  try {
    await fs.unlink(filePath);
  } catch (e) {
    console.error(e);
  }
}

const getPostById = async (postId, next) => {
  const post = await Post.findById(postId).populate('creator');
  
  if (!post) {
    const error = new Error('Post was not found!');
    error.statusCode = 404;
    return next(error);
  }
  
  return post;
}
