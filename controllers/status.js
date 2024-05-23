const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getStatus = async (req, res, next) => {
  try {
    const { status } = await User.findById(req.userId);
    
    return res.status(200).json({ status });
  } catch (e) {
    return next(e);
  }
};

exports.postStatus = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = new Error('Status message invalid');
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }
  
  try {
    const { status } = req.body;
    const user = await User.findById(req.userId);
    user.status = status;
    
    await user.save();
    res.status(200).json({ message: 'Status has been set successfully!', status: status });
  } catch (e) {
    return next(e);
  }
};
