//This will give users 404 if the page not found or the request type is not correct
const notFound = (req, res, next) => {
  const error = new Error(`${req.originalUrl} - Not found`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {errorHandler, notFound}
