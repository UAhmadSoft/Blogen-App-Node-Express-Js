const mongoose = require('mongoose');
const User = require('./userModel');
const Comment = require('./commentModel');
const Like = require('./likes');
const Category = require('./categories');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A posts must have a title'],
    },
    body: {
      type: String,
      required: [true, 'There must be a post body '],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'categories',
      required: [true, 'A post must belong to a Category !'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A post must belong to a User !'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // comments: [String],
    //   category :x
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text Index
postSchema.index({
  // category: 'text',
  title: 'text',
});

// Virtual Populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

// postSchema.virtual('likes', {
//   ref: 'Like',
//   foreignField: 'post',
//   localField: '_id',
// });

// Methods
postSchema.methods.getFormattedDate = function () {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // console.log(this.date.getMonth());

  let month = monthNames[this.date.getMonth()];
  let date = this.date.getDate();
  let year = this.date.getFullYear();

  let myDate = month + ' ' + date + ' ' + year;
  //   console.log(`my date is ${myDate}`);
  return myDate;
};

// delete all likes and comments when deleting post
postSchema.pre(/(Delete)|(Remove)/, async function (next) {
  const thisPost = await Post.find(this.query);

  // Delete any like associated with this post
  await Like.deleteMany({
    post: thisPost,
  });

  // Delete any Comment associated with this post
  await Comment.deleteMany({
    post: thisPost,
  });

  next();
});

// Query Middleware
postSchema.pre(/^find/, async function (next) {
  this.populate({
    path: 'category',
    select: 'title -_id',
  }).populate({
    path: 'user',
    select: '-password -passwordConfirm',
  });

  // this.sort('-date');

  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
