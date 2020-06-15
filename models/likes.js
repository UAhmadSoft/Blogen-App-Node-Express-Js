const mongoose = require('mongoose');
const User = require('./userModel');
const Post = require('./postModel');

const likeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'A Like must belong to a Post !'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A Like must belong to a User !'],
  },
  like: {
    type: Boolean,
    default: true,
  },
});

// Query Middleware
likeSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'post',
    select: '-body',
  }).populate({
    path: 'user',
    select: '-password -passwordConfirm',
  });

  next();
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
