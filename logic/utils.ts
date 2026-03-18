import { COUNTRIES } from './countries';
import { BASE_PRICE_USD } from './constants';

export const maskEmail = (email: string) => {
  if (!email || !email.includes('@')) return email;
  const [name, domain] = email.split('@');
  if (name.length <= 1) return `*@${domain}`;
  return `${name[0]}***@${domain}`;
};

export const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const calculateRegionalPrice = (countryCode: string | undefined, lang: string, basePrice: number) => {
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
  const rate = country.rate || 1;
  const pppFactor = country.pppFactor || 1;
  const currency = country.currency || 'USD';
  const adjustedValue = basePrice * rate * pppFactor;
  const roundedValue = Math.round(adjustedValue);
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(roundedValue);
};
