var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('libs/mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    config = require('config'),
    //favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    log = require('libs/log')(module),
    errorHandler = require('express-error-handler'),
    CustomError = require('error').CustomError,
    app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger(app.get('env') === 'development' ? 'dev' : 'default'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('middleware/sendCustomError'));

app.use(function noCacheForRoot(req, res, next) {
    if (req.url === '/') {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
    }
    next();
});

require('routes')(app);

app.use(function (err, req, res, next) {
    if (typeof err === 'number') {
        err = new CustomError(err);
    }

    if (err instanceof CustomError) {
        res.sendCustomError(err);
    } else {
        if (app.get('env') === 'development') {
            errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new CustomError(500);
            res.sendCustomError(err);
        }
    }
});

http.createServer(app).listen(config.get('port'), function() {
    log.info('Express server listening on port: ' + config.get('port'));
});
