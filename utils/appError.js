class AppError extends Error {
   constructor(message, code) {
      super(message);
      this.statusCode = code;
      this.status = `${code}`.startsWith('4') ? 'fail' : 'error';

      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
   }
}

module.exports = AppError;
