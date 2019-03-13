import { getPhoneNumbersByName } from '../twilio';
import { hashPassword, genSecret } from '../utils';
import { prisma } from '../../generated/prisma-client';
import { sendVerificationEmail } from '../mailgun';

const myAccount = async (req, res) => {
  const USERNAME = 'Jae Phone';
  try {
    const {
      data: { incoming_phone_numbers }
    } = await getPhoneNumbersByName(USERNAME);
    res.render('dashboard', {
      numbers: incoming_phone_numbers,
      title: 'Dashboard'
    });
  } catch (error) {
    console.log(error);
  }
};

const createAccount = async (req, res) => {
  const title = 'Create An Account';
  let error;

  if (req.method === 'POST') {
    const {
      body: { email, password }
    } = req;
    try {
      const exists = await prisma.$exists.user({ email });
      if (!exists) {
        const hash = await hashPassword(password);
        const sercret = genSecret();
        await prisma.createUser({
          email,
          password: hash,
          verificationSecret: sercret
        });
        sendVerificationEmail(email, sercret);
      } else {
        error = 'This user has an account already. Maybe try to log in?';
      }
    } catch (e) {
      error = e;
    }
    res.render('create-account', { title, error });
  }
};

const logIn = (req, res) => res.render('login', { title: 'Log In' });

const logOut = (req, res) => {
  req.logout();
  res.redirect('/');
};

export default {
  myAccount,
  createAccount,
  logIn,
  logOut
};
