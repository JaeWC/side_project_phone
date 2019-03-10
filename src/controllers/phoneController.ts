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
    query: { confirmed }
  } = req;
  const {
    params: { countryCode, phoneNumber }
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
      // To Do: Make flash message saying error
      console.log(e);
      res.redirect('/');
    }
  } else if (Boolean(confirmed) === true) {
    try {
      // To Do: Get the real username
      await buyPhoneNumber(phoneNumber, 'Jae Phone');
      // To Do: Make flash message saying success
      res.redirect('/account');
    } catch (error) {
      console.log(error);
      // To Do: Make flash message saying error
      res.render(`/?country=${countryCode}`);
    }
  }
};

const releasePhoneNumber = async (req, res) => {
  const {
    query: { confirmed, pid }
  } = req;
  const {
    params: { phoneNumber }
  } = req;

  if (confirmed && pid) {
    try {
      // TODO: Flash Message with deletion success
      await releasePhoneNumberById(pid);
    } catch (e) {
      // TODO: Falsh message with error
      console.log(e);
    }
    res.redirect('/account');
  } else {
    res.render('release', { phoneNumber, confirmed: false, pid });
  }
};

const getPhoneNumberInbox = async (req, res) => {
  const {
    params: { phoneNumber }
  } = req;
  let error;
  let messages;
  try {
    const {
      data: { messages: receivedMessages }
    } = await getInbox(phoneNumber);
    messages = receivedMessages;
  } catch (e) {
    console.log(e);
    error = "Can't check Inbox at this time";
  }
  res.render('inbox', { phoneNumber, error, messages });
};

const handleNewMessage = (req, res) => {
  const {
    body: { From, Body, To }
  } = req;

  res.end().status(200);
  sendNewSMSMail(From, Body, To);
};

export default {
  searchNumbers,
  rentPhoneNumber,
  releasePhoneNumber,
  getPhoneNumberInbox,
  handleNewMessage
};
