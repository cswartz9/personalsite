var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fs = require('fs')
var https = require('https')

var contactRouter = require("./routes/contact");
var indexRouter = require('./routes/index');
var projectsRouter = require("./routes/projects");
var resumeRouter = require("./routes/resume");

var app = express();
const port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/contact', contactRouter);
app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/resume', resumeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

https.createServer(
  {key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')},
  app
).listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
