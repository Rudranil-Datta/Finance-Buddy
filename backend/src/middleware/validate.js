const ApiError = require('../utils/ApiError');

function formatZodErrors(error) {
  return error.issues.map((issue) => issue.message).join('; ');
}

function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError(400, formatZodErrors(result.error)));
    }

    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(new ApiError(400, formatZodErrors(result.error)));
    }

    req.query = result.data;
    next();
  };
}

function validateParams(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(new ApiError(400, formatZodErrors(result.error)));
    }

    req.params = result.data;
    next();
  };
}

module.exports = { validateBody, validateQuery, validateParams };
