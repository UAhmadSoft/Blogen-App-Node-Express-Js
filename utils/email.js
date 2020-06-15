const nodeMailer = require('nodemailer');

const sendMail = async (options) => {
  // 1 Create Transportor
  const transportor = nodeMailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.Sendgrid_Username,
      pass: process.env.Sendgrid_Password,
    },
  });
  // const transportor = nodeMailer.createTransport({
  //   host: process.env.MailTrap_Host,
  //   port: process.env.MailTrap_Port,
  //   auth: {
  //     user: process.env.MailTrap_User,
  //     pass: process.env.MailTrap_Password,
  //   },
  // });

  // 2 Define Mail Options
  const mailOptions = {
    from: process.env.Email_From,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 Send Email
  await transportor.sendMail(mailOptions);
};

module.exports = sendMail;
