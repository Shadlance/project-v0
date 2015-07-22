var CustomError = require('error').CustomError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        return next(new CustomError(401, 'You not authorized'))
    }
    next();
};