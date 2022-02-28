import nodemailer from 'nodemailer';

export default class Emailer {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.emailUsername,
        pass: process.env.emailPassword,
      },
    });
  }

  /**
   * Sends an email with a pre-determined subject-line with the provided
   * emailBody to the email that is specified in the `.env` file.
   *
   * Basically this sends an email to yourself and logs the result to the
   * console.
   */
  async send(emailBody: string) {
    const emailInfo = await this.transporter.sendMail({
      to: process.env.emailUsername,
      subject: 'Update from web-watcher 👀💻',
      text: emailBody,
    });
    console.log(`Email sent with the following return info`, emailInfo);
  }
}
