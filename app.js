var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fs = require('fs')
var https = require('https')
var httpsRedirect = require('express-https-redirect');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();

var contactRouter = require("./routes/contact");
var indexRouter = require('./routes/index');
var projectsRouter = require("./routes/projects");
var resumeRouter = require("./routes/resume");

var app = express();
app.use('/', httpsRedirect());
app.use(bodyParser.urlencoded({extended: true}));
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


const privateKey = fs.readFileSync('/etc/letsencrypt/live/coleswartz.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/coleswartz.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/coleswartz.com/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
	cert: certificate,
	ca: ca
};

https.createServer(credentials, app).listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`)
});

app.listen(3001, () => {
  console.log('Example app listening at http:localhost:${3001}');
});

module.exports = app;
