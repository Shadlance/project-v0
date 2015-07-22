var checkAuth = require('../middleware/checkAuth');

module.exports = function(app) {
    app.use(require('../middleware/insertUser'));

    app.get('/', checkAuth, require('./home').get);
    app.get('/login', require('./login').get);
    app.post('/login', require('./login').post);
    app.post('/logout', require('./logout').post);
};