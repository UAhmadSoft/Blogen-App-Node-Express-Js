function handleVilidationErrorDB(err, req, res) {
  // console.log('object . vales is', Object.values(err.errors));
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input Data. ${errors.join('. ')}`;

  req.flash('message', message);
  return res.json({
    status: 'fail',
    error: err,
  });
}

function sendErrorDevelopment(err, res) {
  console.log(err.errorStack);
  res.status(err.statusCode).render('error', { error: err });
  // res.render('error');
}

function sendErrorProduction(err, res) {}

module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err);

  // if (process.env.NODE_ENV === 'development') {
  //    sendErrorDevelopment(err, res);
  // } else if (process.env.NODE_ENV === 'production') {
  //    sendErrorProduction(err, res);
  // }
  if (err.name === 'JsonWebTokenError') {
    req.flash('message', 'You Must Login First');
    res.redirect('/login');
  } else if (err.name === 'TokenExpiredError') {
    req.flash('message', 'You Must Login First');
    res.redirect('/login');
  } else if (err.name === 'ValidationError') {
    handleVilidationErrorDB(err, req, res);
  } else if (err.code === 11000) {
    req.flash(
      'error',
      `Field  ${JSON.stringify(err.keyValue)} already exists! Try Another`
    );
    res.status(200).json({
      status: 'fail',
    });
  } else {
    if (err.statusCode === 500) {
      req.flash(
        'error',
        'Something went very Wrong ! Try Again in a little bit !'
      );
      return res.json({
        status: 'fail',
        message: err.message,
        stack: err.stack,
      });
    }
    res.render('error', { error: err });
  }
};
