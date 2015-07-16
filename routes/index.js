var User = require('../data/models/user').User;

module.exports = function(app, HttpError) {
    app.get('/', function(req, res, next) {
        res.render('pages/index');
    });

    app.get('/users', function(req, res, next) {
        User.find({}, function(err, users) {
            if (!users) {
                next();
                return;
            }
            res.json(users);
        });
    });

    app.get('/users/:username', function(req, res, next) {
        User.find({ username: req.params.username}, function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user.length) {
                return next(new HttpError(404, "User not found"))
            }
            res.json(user);
        });
    });
};