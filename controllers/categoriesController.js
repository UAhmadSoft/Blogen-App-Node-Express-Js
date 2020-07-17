const CatModel = require('./../models/categories');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCategories = async (req, res) => {
  const categories = await CatModel.find({});

  res.render('categories', {
    userName: req.user.name,
    categories: categories,
    success: req.flash('success'),
    message: req.flash('message'),
    user: req.user,
  });
};

exports.addCategory = catchAsync(async (req, res, next) => {
  // Check if Title and Summary Exists in req.body
  const { title, summary } = req.body;

  const newCategory = await CatModel.create({
    title,
    summary,
  });
  req.flash('success', 'Category added successfully !');
  res.json({
    status: 'success',
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const category = await CatModel.findById(id);

  if (!category) {
    req.flash('message', 'No Category with that ID');
    // res.redirect('/categories');
    return res.render('error', {
      message: 'No Category Found with this id',
      userName: req.user,
      user: req.user,
    });
  }

  res.render('category', {
    category,
    userName: req.user.name,
    message: req.flash('message'),
    success: req.flash('success'),
    user: req.user,
  });
  // res.render('categoriescopy', { category, userName: req.user.name });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  if (!id) {
    req.flash('message', 'Plz Select a category to update');
    res.json({
      status: 'fail',
    });
  }

  // console.log(id);

  const category = await CatModel.findById(id);

  if (!category) {
    // console.log('no cat found wih this id');
    // req.session.flash() = [];

    req.flash('message', 'No Category found to be updated ');
    return res.json({
      status: 'fail',
    });
  }

  const updatedCat = await CatModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  req.flash('success', 'Changes Saved !');
  res.json({
    status: 'success',
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  if (!id) {
    req.flash('message', 'Plz Select a category to delete');
    res.json({
      status: 'fail',
    });
  }

  // console.log(id);

  try {
    await CatModel.findByIdAndDelete(id);
    req.flash('success', 'Category Deleted !');
    res.json({
      status: 'success',
    });
  } catch (err) {
    // console.log('error deleting', err);

    req.flash('message', 'Error Deleting Category ');
    return res.json({
      status: 'fail',
    });
  }
});

// console.log('hf');
