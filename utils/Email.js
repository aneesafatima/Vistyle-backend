const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.from = `Aneesa <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'development') {
    // Mailtrap
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
    // }

    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // }); // Production
  }

  // Send the actual email
  async send(subject) {
    // 1) Render HTML

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      //   html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("Welcome to the Color Theory App!");
  }

  async sendPasswordResetOTP(otp) {
    await this.send(
      `Your password reset OTP is ${otp}. It is valid for only 5 minutes.`
    );
  }
};
