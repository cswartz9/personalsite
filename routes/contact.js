var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact');
});

router.post('/', (req, res) => {
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: proceess.env.GMAIL_PASS
    }
  });

  var mailFormat = {
    from: 'Site Contact Form',
    to: process.env.GMAIL_USER,
    subject: 'Contact form message from coleswartz.com',
    text: `${req.body.firstname} ${req.body.lastname} (${req.body.email}) says: ${req.body.message}`
  }

  smtpTransport.sendMail(mailFormat, (error, response) => {
    if (error) {
      res.json('{success: false}');
    } else {
      res.json('{success: true}');
    }
  });
});

module.exports = router;
