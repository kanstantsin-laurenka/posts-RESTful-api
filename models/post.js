const { model, Schema, Types } = require('mongoose');


const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });


module.exports = model('Post', postSchema);
