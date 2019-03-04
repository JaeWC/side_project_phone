import { getPhoneNumbersByName } from '../twilio';

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

export default {
  myAccount
};
