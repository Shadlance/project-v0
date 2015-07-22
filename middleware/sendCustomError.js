module.exports = function (req, res, next) {
    res.sendCustomError = function(err) {
        if (err.status) res.status(err.status);

        if (res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json(err);
        } else {
            res.render("pages/error", {error: err});
        }
    };

    next();
};