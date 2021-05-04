// Currying and Closure for error handling

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
