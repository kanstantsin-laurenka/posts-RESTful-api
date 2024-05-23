const { Router } = require('express');
const { body } = require('express-validator');


const { getPosts, createPost, deletePost, getPost, editPost } = require('../controllers/feed');
const fileUpload = require('../middlewares/file-upload');
const isAuth = require('../middlewares/is-auth');

const router = Router();

router.get('/posts', isAuth, getPosts);
router.post(
  '/post',
  isAuth,
  fileUpload('image', ['image/png', 'image/jpg', 'image/jpeg']),
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  createPost);

router.get('/post/:postId', isAuth, getPost);

router.put('/post/:postId',
  isAuth,
  fileUpload('image', ['image/png', 'image/jpg', 'image/jpeg']),
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  editPost,
);

router.delete('/post/:postId', isAuth, deletePost);

module.exports = router;
