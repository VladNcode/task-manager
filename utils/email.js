const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: './config.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email, // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: 'Welcome to tasks app',
      text: `Hello ${name}, This is your welcome email`,
      html: `<strong>Hello ${name}, This is your welcome email</strong>`,
    })
    .catch(error => {
      console.error(error);
    });
};

exports.sendGoodbyeEmail = (email, name) => {
  sgMail
    .send({
      to: email, // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: 'Goodbye from tasks app',
      text: `Bye ${name}, This is your goodbye email`,
      html: `<strong>Bye ${name}, This is your goodbye email</strong>`,
    })
    .catch(error => {
      console.error(error);
    });
};

// module.exports;
