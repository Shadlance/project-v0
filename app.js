var express = require('express'),
    http = require('http'),
    router = require('./routes/index'),
    path = require('path'),
    config = require('config'),
    //favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    log = require('libs/log')(module),
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

app.use(function (err, req, res, next) {
    if (app.get('env') === 'development') {
        express.errorHandler(err, req, res, next);
    } else {
        res.send(500);
    }
});

http.createServer(app).listen(config.get('port'), function() {
    log.info('Express server listening on port: ' + config.get('port'));
});
