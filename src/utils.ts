import bcrypt from 'bcrypt';
import { adj, nouns } from './words';

interface IPrice {
  number_type: 'local' | 'mobile' | 'toll_free';
  base_price: string;
  current_price: string;
}

export const isLocal = (code: string) =>
  code === 'US' || code === 'CA' || code === 'PR';

export const extractPrice = (prices: [IPrice], code: string) => {
  const price = prices.filter(price => {
    if (isLocal(code)) {
      return price.number_type === 'local';
    } else {
      return price.number_type === 'mobile';
    }
  })[0];

  return price.base_price;
};

export const hashPassword = async (plain: string): Promise<string> => {
  const hash = await bcrypt.hash(plain, 10);
  return hash;
};

export const checkPassword = async (
  hash: string,
  plain: string
): Promise<boolean> => {
  const isSame = await bcrypt.compare(plain, hash);
  return isSame;
};

export const genSecret = (): string => {
  const MAX = nouns.length;
  const wordNumber = Math.floor(Math.random() * MAX);
  return `${adj[wordNumber]} ${nouns[wordNumber]}`;
};
