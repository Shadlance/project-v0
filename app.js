var express = require("express"),
    http = require("http"),
    config = require("config"),
    path = require("path"),
    //favicon = require("serve-favicon"),
    logger = require("morgan"),
    log = require("libs/log")(module),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    routes = require("./routes/index"),
    app = express();

app.engine("ejs", require("ejs-locals"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger(app.get("env") === "development" ? "dev" : "default"));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

app.use(function(err, reg, res, next) {
    if (app.get("env") === "development") {
        express.errorHandler(err, req, res, next);
    } else {
        res.send(500);
    }
});

http.createServer(app).listen(config.get("port"), function() {
    log.info("Express server listen on port " + config.get("port"));
});

// view engine setup
/*app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});*/


module.exports = app;
