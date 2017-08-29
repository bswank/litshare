const pug = require('pug')
const juice = require('juice')
const htmltotext = require('html-to-text')
const postmark = require('postmark')

const client = new postmark.Client('bce02af7-32e9-44a8-bce6-b3cba9ca076e')

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options)
  const inlined = juice(html)
  return inlined
}

exports.send = (options) => {
  const html = generateHTML(options.filename, options)
  const text = htmltotext.fromString(html)
  const mailOptions = {
    from: options.from || `LitShare <notify@litshareapp.com>`,
    to: options.to,
    subject: options.subject,
    htmlBody: html,
    textBody: text
  }
  client.sendEmail(mailOptions).catch(err => {
    console.error(err)
  })
}
