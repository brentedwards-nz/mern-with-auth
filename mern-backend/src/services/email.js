const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log('Server validation failed.')
        console.table(error);
        return false;
      } else {
        console.log('Server validation done and ready for messages.')
      }
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent sucessfully");
    return true;
  } catch (error) {
    console.log("Email not sent");
    console.table(error);
    return false;
  }
};

module.exports = { sendEmail };