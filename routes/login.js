var CustomError = require('../error').CustomError,
    User = require('../data/models/user').User;

exports.get = function(req, res) {
    res.render('pages/login');
};

exports.post = function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.authorize(username, password, function(err, user) {
        if (err) {
            if (!err.status) {
                return next(new CustomError(403, err.message))
            } else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    });
};