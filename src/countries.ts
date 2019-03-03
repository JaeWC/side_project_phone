export const availableCountries = [
  {
    name: 'Australia',
    dial_code: '+61',
    code: 'AU',
    flag: '🇦🇺'
  },
  {
    name: 'Austria',
    dial_code: '+43',
    code: 'AT',
    flag: '🇦🇹'
  },
  {
    name: 'Croatia',
    dial_code: '+385',
    code: 'HR',
    flag: '🇭🇷'
  },
  {
    name: 'Hungary',
    dial_code: '+36',
    code: 'HU',
    flag: '🇭🇺'
  },
  {
    name: 'Israel',
    dial_code: '+972',
    code: 'IL',
    flag: '🇮🇱'
  },
  {
    name: 'Poland',
    dial_code: '+48',
    code: 'PL',
    flag: '🇵🇱'
  },
  {
    name: 'Portugal',
    dial_code: '+351',
    code: 'PT',
    flag: '🇵🇹'
  },
  {
    name: 'Puerto Rico',
    dial_code: '+1939',
    code: 'PR',
    flag: '🇵🇷'
  },
  {
    name: 'Sweden',
    dial_code: '+46',
    code: 'SE',
    flag: '🇸🇪'
  },
  {
    name: 'Switzerland',
    dial_code: '+41',
    code: 'CH',
    flag: '🇨🇭'
  },
  {
    name: 'United Kingdom',
    dial_code: '+44',
    code: 'GB',
    flag: '🇬🇧'
  },
  {
    name: 'United States',
    dial_code: '+1',
    code: 'US',
    flag: '🇺🇸'
  }
];

export const getName = (code: string) =>
  availableCountries.filter(country => country.code === code)[0];
