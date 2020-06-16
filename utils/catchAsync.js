module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      // console.log(`err from catchasync is ${err}`);
      console.log(`errror is ${err}`);
      next(err);
    });
  };
};
