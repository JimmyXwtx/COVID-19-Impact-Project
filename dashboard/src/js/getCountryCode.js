//
import { getCode } from 'country-list';

const getCountryCode = (region) => {
  let countryCode = '';
  switch (region) {
    case 'Bolivia':
      countryCode = 'BO';
      break;
    case 'Brunei':
      countryCode = 'BN';
      break;
    case 'Burma':
      countryCode = 'MM';
      break;
    case 'Congo (Brazzaville)':
      countryCode = 'CG';
      break;
    case 'Congo (Kinshasa)':
      countryCode = 'CD';
      break;
    case "Cote d'Ivoire":
      countryCode = 'CI';
      break;
    case 'Laos':
      countryCode = 'LA';
      break;
    case 'Moldova':
      countryCode = 'MD';
      break;
    case 'Reunion':
      countryCode = 'RE';
      break;
    case 'Syria':
      countryCode = 'SY';
      break;
    case 'Tanzania':
      countryCode = 'TZ';
      break;
    case 'Vietnam':
      countryCode = 'VN';
      break;
    case 'United States':
    case 'US':
      countryCode = 'US';
      break;
    case 'United Kingdom':
    case 'UK':
      countryCode = 'GB';
      break;
    case 'Iran':
      countryCode = 'IR';
      break;
    case 'Taiwan*':
      countryCode = 'TW';
      break;
    case 'Korea, South':
      countryCode = 'KR';
      break;
    case 'Russia':
      countryCode = 'RU';
      break;
    case 'Venezuela':
      countryCode = 'VE';
      break;
    case 'Macau':
      countryCode = 'MO';
      break;
    default:
      countryCode = getCode(region);
  }
  return countryCode;
};

export default getCountryCode;
