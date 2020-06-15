var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.use(authController.protect);

/* GET home page. */
router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUser);

module.exports = router;
