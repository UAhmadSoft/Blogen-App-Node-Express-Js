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
function handleCastErrorDB(err, req, res) {
  // console.log('object . vales is', Object.values(err.errors));
  // const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(err.message);
  // log
  let regex = /(["'])(?:\\.|[^\\])*?\1/g;

  const values = err.message.match(regex);
  const message = `The ${values[2]} with ${values[1]} : ${values[0]} does NOT Exist`.replace(
    /"/g,
    ''
  );

  // req.flash('message', message);
  return res.render('error', {
    message,
    user: req.user,
    userName: req.user.name,
  });
}

function sendErrorDevelopment(err, res) {
  // console.log(err.errorStack);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
  });
  // res.render('error');
}

function sendErrorProduction(err, res) {}

module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log('inside error controller');
  console.log(err);

  console.log(`process.env.NODE_ENV`, process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') {
      req.flash('message', 'You Must Login First');
      return res.render('login', { message: req.flash('message') });
    } else if (err.name === 'TokenExpiredError') {
      req.flash('message', 'You Must Login First');
      return res.render('login', { message: req.flash('message') });
      // return res.redirect('/login');
    } else if (err.name === 'ValidationError') {
      handleVilidationErrorDB(err, req, res);
    } else if (err.name === 'CastError') {
      handleCastErrorDB(err, req, res);
    } else if (err.code === 11000) {
      req.flash(
        'error',
        `Field  ${JSON.stringify(err.keyValue)} already exists! Try Another`
      );
      return res.status(200).json({
        status: 'fail',
      });
    } else if (err.statusCode === 404) {
      req.flash('error', '404 Not Found !');
      return res.render('error', {
        // message: err,
        message: '404 NOT FOUND !',
        userName: req.user.name,
        user: req.user,
      });
    } else {
      req.flash(
        'error',
        'Something went very Wrong ! Try Again in a little bit !'
      );
      return res.render('error', {
        // message: err,
        message: 'Something went very Wrong ! Try Again in a little bit !',
        userName: req.user.name,
        user: req.user,
      });
    }
  }
};
