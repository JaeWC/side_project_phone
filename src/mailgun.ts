import mailgun from 'mailgun-js';

const client = mailgun({
  apiKey: process.env.MAILGUN_API_KEY || '',
  domain: process.env.MAILGUN_DOMAIN || ''
});

const sendMail = mail => client.messages().send(mail);

export const sendNewSMSMail = (from: string, body: string, owner: string) => {
  const mail: mailgun.messages.SendData = {
    from: 'Jae Phone <me@samples.mailgun.org>',
    to: 'j.thechois@gmail.com',
    subject: '(1) New Message on Jae Phone',
    html: `
    <h1>You have a new message</h1>
    <strong>From:</strong> ${from}
    <strong>Message:</strong> ${body}
    `
  };
  return sendMail(mail);
};
