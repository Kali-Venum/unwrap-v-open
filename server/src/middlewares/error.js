const httpStatus = require('http-status');
const config = require('../configs/index');
const logger = require('../configs/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    isError: true,
    code: statusCode,
    message,
    ...(config.env === 'development'),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
  // res.send({
  //   serverResponse: {
  //     code: statusCode,
  //     ...response,
  //   },
  // });
  // res.status(statusCode).send({code:statusCode,response})
};

module.exports = {
  errorConverter,
  errorHandler,
};
