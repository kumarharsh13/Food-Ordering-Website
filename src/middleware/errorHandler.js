const createError = require('http-errors');
const logger = require('../config/logger');

exports.notFound = (req, res, next) => {
  next(createError(404));
};

exports.errorHandler = (err, req, res, next) => {
  logger.error({ message: err.message, stack: err.stack, url: req.originalUrl });
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
};
