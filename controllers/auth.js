const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  
  const { email, name, password } = req.body;
  
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  
  try {
    const hashedPassword = await bcryptjs.hash(password, 12); // 12 is the number of rounds
    
    const user = new User({
      email,
      name,
      password: hashedPassword,
    });
    
    const newUser = await user.save();
    
    res.status(201).json({ message: 'User created!', userId: newUser._id });
  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with this email could not be found!');
      error.statusCode = 401;
      return next(error);
    }
    
    const isEqual = await bcryptjs.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      return next(error);
    }
    
    const token = jwt.sign(
      {
        email,
        userId: user._id
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );
    
    res.status(200).json({ token, userId: user._id });
    
  } catch (e) {
    return next(e);
  }
}
