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
    <span>You have a new message</span>
    <strong>From:</strong> ${from}
    <strong>Message:</strong> ${body}
    `
  };
  return sendMail(mail);
};

export const sendVerificationEmail = (to: string, secret: string) => {
  const mail: mailgun.messages.SendData = {
    from: 'Jae Phone<j.thechois@gmail.com>',
    to: 'j.thechois@gmail.com',
    subject: 'Email Verification',
    html: `
      Your email verification secret is <strong>${secret}</strong>
      Copy paste it on http://localhost:4000/users/verify-email
      `
  };
  return sendMail(mail);
};

export const sendPasswordResetEmail = (to: string, keyId: string) => {
  const mail: mailgun.messages.SendData = {
    from: 'Jae Phone<j.thechois@gmail.com>',
    to: 'j.thechois@gmail.com',
    subject: 'Change your password',
    html: `
      Click here to change your password http://localhost:4000/users/reset-password/${keyId}
      `
  };
  return sendMail(mail);
};
