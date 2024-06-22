const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  logger: true,
  debug: true
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'plisbyc2103@gmail.com',
  subject: 'Prueba de nodemailer',
  text: 'Este es un correo de prueba',
  html: '<p>Este es un correo de prueba</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error enviando correo:', error);
  }
  console.log('Correo enviado:', info.response);
});
