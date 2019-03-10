import { getPhoneNumbersByName } from '../twilio';
import { hashPassword } from '../utils';

const myAccount = async (req, res) => {
  const USERNAME = 'Jae Phone';
  try {
    const {
      data: { incoming_phone_numbers }
    } = await getPhoneNumbersByName(USERNAME);
    res.render('account', { numbers: incoming_phone_numbers });
  } catch (error) {
    console.log(error);
  }
};

const createAccount = async (req, res) => {
  if (req.method === 'GET') {
    res.render('create-account', { title: 'Create An Account' });
  } else if (req.method === 'POST') {
    const {
      body: { email, password }
    } = req;
    const hash = await hashPassword(password);
    res.render('create-account');
  }
};

export default {
  myAccount,
  createAccount
};
