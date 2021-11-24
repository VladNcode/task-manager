const AppError = require('./appError');

module.exports = allowedUpdates = (req, res, next, a, b, ...c) => {
  const updates = Object.keys(req.body);
  const allowed = [a, b, ...c];
  const isValidOperation = updates.every(item => allowed.includes(item));
  if (!isValidOperation)
    return next(
      new AppError(
        `You can only update: '${[...allowed]
          .join(',')
          .replace(/,/g, ', ')
          .toUpperCase()}' fields by using this route! Please exclude everything else if you want to proceed`,
        400
      )
    );
};
