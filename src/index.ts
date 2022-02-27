import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import WebPage from './utils/WebPage';

dotenv.config();

async function testFunction() {
  const google = new WebPage('https://google.com');
  await google.init();
  console.log(google.querySelectorAll('div').length);
}

async function sendEmail() {
  const emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.emailUsername,
      pass: process.env.emailPassword,
    },
  });
  const emailInfo = await emailTransporter.sendMail({
    to: 'agneuhold@gmail.com',
    subject: 'This is a test',
    text: 'This is the test body',
  });
  console.log(emailInfo);
}

testFunction();
sendEmail();
