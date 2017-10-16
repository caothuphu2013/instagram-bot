const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'friends@buzzlightyear.io', // generated ethereal user
    pass: 'Whadew102@'  // generated ethereal password
  }
})

// setup e-mail data with unicode symbols
var mailOptions = {
  from: '"Friends at BuzzLightYear" <friends@buzzlightyear.io>', // sender address
  to: 'watchamacollin@gmail.com', // list of receivers
  subject: 'Nodemailer Test', // Subject line
  text: 'This is a nodemailer test', // plaintext body
  html: '<b>Hello world ?</b>' // html body
}

// verify connection configuration
exports.verifyEmail = transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Server is ready to take our messages')
  }
})

// send mail with defined transport object
exports.sendEmail = transporter.sendMail(mailOptions, function (error, info) {
  if (error) return console.log(error)
  console.log('Message sent: ' + info.response)
})

// Incoming server: imap.secureserver.net
// Incoming ports: 143
// Outgoing server: smtpout.secureserver.net
// Outgoing ports: 80, 25, 587, or 3535
