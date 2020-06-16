const catModel = require('./../models/categories');
const User = require('./../models/userModel');
const Post = require('./../models/postModel');
const catchAsync = require('./../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const cats = await catModel.find({});
  const users = await User.find({});
  const posts = await Post.find({});

  const userName = req.user.name;
  // console.log(cats.length);

  res.render('index', {
    message: req.flash('message'),
    success: req.flash('success'),
    categories: cats,
    userName,
    users,
    posts,
    user: req.user,
  });
});
