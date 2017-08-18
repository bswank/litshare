const nodemailer = require('nodemailer');
const promisify = require('es6-promisify');
const pug = require('pug');
const juice = require('juice');
const htmltotext = require('html-to-text');
const postmark = require('postmark');

// const postmarkAPIKey = process.env.MAIL_API;
const client = new postmark.Client('bce02af7-32e9-44a8-bce6-b3cba9ca076e');

client.sendEmail({
    "From": "noreply@litshareapp.com",
    "To": "brianswank@gmail.com",
    "Subject": "Testing",
    "TextBody": "Test Message"
});

// const transport = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// });
//
// const generateHTML = (filename, options = {}) => {
//   const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
//   const inlined = juice(html);
//   return inlined;
// };
//
// exports.send = async (options) => {
//   const html = generateHTML(options.filename, options);
//   const text = htmltotext.fromString(html);
//   const mailOptions = {
//     from: `Brian Swank <noreply@litshareapp.com>`,
//     to: options.to,
//     subject: options.subject,
//     html,
//     text
//   };
//   const sendMail = promisify(transport.sendMail, transport);
//   return sendMail(mailOptions);
// };
