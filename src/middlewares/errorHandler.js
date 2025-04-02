import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
