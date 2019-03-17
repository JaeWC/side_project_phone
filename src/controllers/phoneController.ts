import { availableCountries, getName } from '../countries';
import { Request, Response } from 'express';
import {
  numbersByCountry,
  priceByCountry,
  buyPhoneNumber,
  releasePhoneNumberById,
  getInbox
} from '../twilio';
import { extractPrice } from '../utils';
import { sendNewSMSMail } from '../mailgun';
import { prisma } from '../../generated/prisma-client';

const searchNumbers = async (req: Request, res: Response) => {
  const {
    query: { country }
  } = req;

  let numbers = null;
  let price;
  let error = false;

  if (country) {
    try {
      const {
        data: { available_phone_numbers }
      } = await numbersByCountry(country);
      numbers = available_phone_numbers;

      const {
        data: { phone_number_prices }
      } = await priceByCountry(country);
      price = extractPrice(phone_number_prices, country);
    } catch (e) {
      console.log(e);
      error = true;
    }
  }

  res.render('index', {
    availableCountries,
    searchingBy: country,
    numbers,
    price,
    error,
    title: 'Get SMS from anywhere in the world'
  });
};

const rentPhoneNumber = async (req, res) => {
  const {
    query: { confirmed },
    params: { countryCode, phoneNumber },
    user
  } = req;

  if (!confirmed) {
    try {
      const {
        data: { phone_number_prices }
      } = await priceByCountry(countryCode);
      res.render('purchase', {
        confirmed,
        countryName: getName(countryCode),
        phoneNumber,
        price: extractPrice(phone_number_prices, countryCode)
      });
    } catch (e) {
      req.flash('error', 'Something happened!');
      res.redirect('/');
    }
  } else if (Boolean(confirmed)) {
    if (!user) {
      req.session.continuePurchase = `/numbers/rent/${countryCode}/${phoneNumber}`;
      req.flash('info', 'Create an account to continue with your purchase');
      res.redirect('/create-account');
    } else {
      try {
        const { id } = user;
        const {
          data: { sid }
        } = await buyPhoneNumber(phoneNumber, id);
        await prisma.createNumber({
          number: phoneNumber,
          twilioId: sid,
          owner: {
            connect: {
              id
            }
          }
        });
        req.flash('success', 'The number has been purchased!');
        res.redirect('/account');
      } catch (error) {
        req.flash(
          'error',
          'There was an error renting this phone number, choose a different one'
        );
        res.render(`/?country=${countryCode}`);
      }
    }
  }
};

const releasePhoneNumber = async (req, res) => {
  const {
    query: { confirmed, pid },
    params: { phoneNumber },
    user
  } = req;

  try {
    const exists = await prisma.$exists.number({
      AND: [{ owner: { id: user.id } }, { number: phoneNumber, twilioId: pid }]
    });

    if (!exists) {
      req.flash('error', 'Number not found');
      res.redirect('/dashboard');
    }

    if (confirmed && pid) {
      req.flash('success', 'This number has been deleted from your account');

      await releasePhoneNumberById(pid);
      await prisma.deleteNumber({ twilioId: pid, number: phoneNumber });

      res.redirect('/account');
    } else {
      res.render('release', {
        phoneNumber,
        confirmed: false,
        pid,
        title: 'Release number'
      });
    }
  } catch (e) {
    req.flash(
      'error',
      'Could not delete this number from your account, try again later'
    );
    res.redirect('/dashboard');
  }
};

const getPhoneNumberInbox = async (req, res) => {
  const {
    params: { phoneNumber },
    user
  } = req;

  let messages;
  let error;

  try {
    const exists = await prisma.$exists.number({
      number: phoneNumber,
      owner: {
        id: user.id
      }
    });

    if (!exists) {
      req.flash('error', `You don't own this number`);
      return res.redirect('/dashboard');
    }

    const {
      data: { messages: receivedMessages }
    } = await getInbox(phoneNumber);
    messages = receivedMessages;
  } catch (e) {
    error = "Can't check Inbox at this time";
  }

  res.render('inbox', {
    phoneNumber,
    messages,
    error,
    title: `Inbox for ${phoneNumber}`
  });
};

const handleNewMessage = async (req, res) => {
  const {
    body: { From, Body, To }
  } = req;

  res.end().status(200);

  try {
    const owner = await prisma.number({ number: To }).owner();

    if (owner) {
      sendNewSMSMail(From, Body, owner.email);
    }
  } catch (e) {
    console.log(e);
  }
};

export default {
  searchNumbers,
  rentPhoneNumber,
  releasePhoneNumber,
  getPhoneNumberInbox,
  handleNewMessage
};
