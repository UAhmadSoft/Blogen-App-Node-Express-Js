var express = require('express');
var router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const authController = require('../controllers/authController');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(authController.protect);
/* GET home page. */
router
  .route('/')
  .get(categoriesController.getAllCategories)
  .post(
    urlencodedParser,

    categoriesController.addCategory
  )
  .patch(
    urlencodedParser,

    categoriesController.updateCategory
  )
  .delete(
    urlencodedParser,

    categoriesController.deleteCategory
  );

router.get('/:id', categoriesController.getCategory);

module.exports = router;
