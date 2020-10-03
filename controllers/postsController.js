// const { s, pro } = require('./../app.js');
const socket = require('socket.io');

const catchAsync = require('./../utils/catchAsync');
const Post = require('./../models/postModel');
const CatModel = require('./../models/categories');
const Like = require('./../models/likes');
const Comment = require('./../models/commentModel');
// const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');

let io = {};
// const { server, Pie } = require('./../app');
// app.good();
// app.bad();
// console.log(app.good);
// console.log('app.io', app.server);
// const io = socket(app.server);
// console.log('appp is', s, pro);
function filter(value, object) {
  object = object.filter((el) => {
    el.category.title = el.category.title.toLowerCase();
    // console.log(el.category.title);

    return el.category.title.includes(`${value.toLowerCase()}`);
  });
  // console.log(object.length);
  return object;
}

exports.getAllPosts = catchAsync(async (req, res) => {
  let query = Post.find();

  // API Features
  const features = new APIFeatures(query, req.query).sort().filterByDate();

  const categories = await CatModel.find({});
  // console.log('app', app);
  let posts = await features.query;

  // Filtering by Category
  if (req.query.cat) {
    posts = filter(req.query.cat, posts);
  }

  // Filtering by post search filter
  if (req.query.pos) {
    const { pos } = req.query;

    posts = posts.filter((el) => {
      return el.title.toLowerCase().includes(`${pos.toLowerCase()}`);
    });
  }

  // Filer by owner of post
  if (req.query.postBy) {
    let postUsers = JSON.stringify(req.query.postBy);
    postUsers = postUsers.split(',');
    // console.log(postUsers);
    // Posts by me
    // console.log(postUsers[0]);

    if (postUsers[0] == '"me"' || postUsers[1] == '"me"') {
      posts = posts.filter((el) => {
        // console.log('el.id');
        // console.log(el.user._id);
        // console.log('req.user.id');
        // console.log(req.user.id);

        return el.user._id == req.user.id;
      });
    } else {
      posts = posts.filter((el) => {
        // console.log('el.id');
        // console.log(el.user._id);
        // console.log('req.user.id');
        // console.log(req.user.id);

        return el.user._id != req.user.id;
      });
    }
  }

  res.render('posts', {
    userName: req.user.name,
    posts,
    categories,
    user: req.user,
  });
});

exports.addNewPost = catchAsync(async (req, res) => {
  // console.log(req.body);

  // getting all cates for posts.ejs
  const categories = await CatModel.find({});

  // Get Category Id
  const CatId = await CatModel.findOne({
    title: req.body.category,
  }).select('_id');

  //  Add New Post
  const Newpost = await Post.create({
    title: req.body.title,
    category: CatId,
    body: req.body.body,
    user: req.user.id,
  });

  const posts = await Post.find({});

  res.render('posts', {
    userName: req.user.name,
    posts,
    categories,
    user: req.user,
  });
});
let mySocket = {};
exports.getPost = catchAsync(async (req, res, next) => {
  // 1 Getting post

  console.log(`user is ${req.user.email}`);
  const { socketServer } = require('./../app');
  // io = socket(socketServer);

  // io.on('connection', (socket) => {
  //   mySocket = socket;

  //   console.log('connection made');
  // });

  const post = await Post.findById(req.params.id)
    .populate({
      path: 'comments',
      select: 'body -post date',
    })
    .exec();
  // .execPopulate();

  if (!post) {
    req.flash(
      'message',
      'The post you are trying to access is either deleted or is private !!!'
    );
    return res.render('post', {
      message: req.flash('message'),
      userName: req.user.name,
      user: req.user,
      post: undefined,
    });
  }

  // console.log('====================================');
  // console.log(post);
  // console.log('====================================');

  // 2 Getting total Likes of the post
  console.log(req.params.id);
  const likes = await Like.find({
    post: req.params.id,
    like: true,
  });

  const likesTotal = likes.length;

  console.log('total likes are', likesTotal);

  // 3 Getting like info about the post by this user
  const like = await Like.findOne({
    post,
    user: req.user,
  });

  // 4 Getting Comments about this post
  const comments = await Comment.find({
    post,
  }).select('-post');

  if (!like) {
    console.log('no like');
    res.render('post', {
      post,
      userName: req.user.name,
      like: false,
      likes: likesTotal,
      delPostErr: req.flash('delPostErr'),
      comments,
      user: req.user,
    });
  } else {
    res.render('post', {
      user: req.user,
      post,
      userName: req.user.name,
      like: like.like,
      likes: likesTotal,
      delPostErr: req.flash('delPostErr'),
      comments,
    });
  }
});

exports.likePost = catchAsync(async (req, res, next) => {
  const { io } = require('./../app');
  // Get Post Id
  const post = await Post.findOne({
    title: req.body.title.trim(),
  });

  const postId = post._id;

  // console.log('post id is', postId);

  // Check if like already exists then
  const like = await Like.findOne({
    user: req.user,
    post,
  });

  // If like exist then unlike it ,
  if (like) {
    console.log('like exist .....unliking');
    like.like = like.like === true ? false : true;

    await like.save({ validateBeforeSave: 'false' });

    console.log('after unlike now like is', like.like);
    // false -> unlike
  } else {
    console.log('like not exists');
    const newLike = await Like.create({
      user: req.user.id,
      post: postId,
    });

    if (!newLike) {
      req.flash('likeErr', 'Error Liking the post !');
      return res.render('post', {
        likeErr: req.flash('likeErr'),
      });
    }
  }
  const postLikes = await Like.find({
    post,
    like: true,
  });

  if (like) {
    liking = like.like;
  } else {
    liking = true;
  }
  io.sockets.emit('likedPost', {
    like: liking,
    likes: postLikes.length,
    email: req.user.email,
  });

  res.json({
    status: 'success',
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  // Checking if user who is deleting post is the one who made post

  const post = await Post.findOne({
    user: req.user,
  });

  if (!post) {
    req.flash(
      'delPostErr',
      'Only user who created post can actually delete it !'
    );
    return res.json({
      status: 'success',
    });
  }

  await Post.findByIdAndDelete(req.params.id);

  res.json({
    status: 'success',
  });
});

exports.commentPost = catchAsync(async (req, res, nxt) => {
  const id = req.originalUrl.split('/')[2];
  const { io } = require('./../app');

  const post = await Post.findById(id);
  const user = req.user;

  const postComments = await Comment.find({
    post,
  });

  const newComment = await Comment.create({
    user,
    post,
    body: req.body.comment,
  });

  if (!newComment) {
    req.flash('message', 'error commenting post');
    return res.json({
      status: 'fail',
    });
  }

  // I want to broadcast here
  // socket.broadcast.emit('commentMade', data);
  console.log('io is', io);
  io.sockets.emit('comment', {
    comment: req.body.comment,
    user: user.name,
    id: newComment._id,
    date: newComment.getFormattedDate(),
    author: req.user.email,
    comments: newComment ? postComments.length + 1 : postComments.length,
  });

  res.json({
    status: 'success',
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const id = req.originalUrl.split('/')[2];
  const { io } = require('./../app');

  await Comment.findByIdAndDelete(req.params.id);
  const { postId } = req.body;
  console.log(req.body);

  const comments = await Comment.find({
    post: postId,
  });

  io.sockets.emit('commentDeleted', {
    id: req.params.id,
    comments: comments.length,
  });

  res.json({
    status: 'success',
  });
});
