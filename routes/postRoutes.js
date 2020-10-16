var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({
  extended: false,
});

const authController = require('../controllers/authController');
const postsController = require('../controllers/postsController');

router.use(authController.protect);

/* GET home page. */
router
  .route('/')
  .get(postsController.getAllPosts)
  .post(urlEncodedParser, postsController.addNewPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .delete(urlEncodedParser, postsController.deletePost);

router.route('/:id/like').patch(urlEncodedParser, postsController.likePost);

router
  .route('/:id/comment')
  .post(urlEncodedParser, postsController.commentPost);

router
  .route('/comments/:id')
  .delete(urlEncodedParser, postsController.deleteComment);

module.exports = router;
