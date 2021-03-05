var express = require('express');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config({path:__dirname+'/./../config.env'});

var router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact');
});

router.post('/', (req, res) => {
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USER,
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
      accessToken: process.env.ACCESSTOKEN
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var mailFormat = {
    from: 'Site Contact Form',
    to: process.env.MAIL_USER,
    subject: 'Contact form message from coleswartz.com',
    text: `${req.body.firstname} ${req.body.lastname} (${req.body.email}) says: ${req.body.message}`
  }

  transporter.sendMail(mailFormat, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      res.render('contact');
    }
  });
});

module.exports = router;
