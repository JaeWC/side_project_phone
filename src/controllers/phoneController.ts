import { availableCountries } from '../countries';
import { Request, Response } from 'express';
import { numbersByCountry, priceByCountry } from '../twilio';
import { extractPrice } from '../utils';

const searchNumbers = async (req: Request, res: Response) => {
  const {
    query: { country }
  } = req;

  let numbers = null;
  let price;
  let isLocal = country === 'US' || country === 'CA' || country === 'PR';
  let error = false;

  if (country) {
    try {
      const {
        data: { available_phone_numbers }
      } = await numbersByCountry(country, isLocal);
      numbers = available_phone_numbers;

      const {
        data: { phone_number_prices }
      } = await priceByCountry(country);
      price = extractPrice(phone_number_prices, isLocal);
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
    error
  });
};

export default {
  searchNumbers
};
