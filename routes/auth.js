const { Router } = require('express');
const { body } = require('express-validator');

const { signUp, login } = require("../controllers/auth");
const User = require('../models/user');

const router = Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid Email address!')
      .custom(async (email, { req }) => {
        if (await User.findOne({ email })) {
          return Promise.reject('E-mail address already exists!');
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty(),
  ],
  signUp,
);

router.post('/login', login);


module.exports = router;
