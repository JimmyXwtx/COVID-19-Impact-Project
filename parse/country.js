//
// Massage country names to link to population numbers
//
//
const prop_renames = {
  'Province/State': 'Province_State',
  '﻿Province/State': 'Province_State',
  'Country/Region': 'Country_Region',
  Confirmed: 'Cases',
};
// item {
//   '﻿Province/State': 'Shandong',
//   'Country/Region': 'Mainland China',
//   'Last Update': '1/26/20 16:00',
//   Confirmed: '46',
//   Deaths: '',
//   Recovered: '',
//   Country_Region: 'China',
//   Cases: '46',
//   source_index: 8
// }
// '﻿Province/State': 'Taiwan',

const Country_Region_renames = {
  'Mainland China': 'China',
  'Hong Kong': 'China',
  Taiwan: 'Taiwan*',
  'South Korea': 'Korea, South',
  ' Azerbaijan': 'Azerbaijan',
  'Bahamas, The': 'Bahamas',
  'The Bahamas': 'Bahamas',
  'Gambia, The': 'Gambia',
  'The Gambia': 'Gambia',
  'Republic of the Congo': 'Congo (Brazzaville)',
  'Iran (Islamic Republic of)': 'Iran',
  'Puerto Rico': 'United States',
  US: 'United States',
  UK: 'United Kingdom',
  'Viet Nam': 'Vietnam',
  'West Bank and Gaza': 'occupied Palestinian territory',
};

function rename_item(item) {
  for (let prop in prop_renames) {
    const nprop = prop_renames[prop];
    const val = item[prop];
    if (val) item[nprop] = val;
  }
  const cname = Country_Region_renames[item.Country_Region];
  if (cname) item.Country_Region = cname;
  if (item.Country_Region == 'United States') {
    if (!item.Province_State) {
      if (item['Country/Region'] === 'Puerto Rico') {
        item.Province_State = 'Puerto Rico';
      } else {
        console.log('rename_item !!@ not Province_State', item);
        return;
      }
    }
    const stateFix = stateFixes[item.Province_State];
    if (stateFix) {
      item.Province_State = stateFix;
      return;
    }
    const parts = item.Province_State.split(',');
    if (parts.length >= 2) {
      const stateCode = parts[1].trim();
      const stateName = stateCodeMaps[stateCode];
      if (stateName) {
        item.Province_State = stateName;
      } else {
        console.log('rename_item !!@ item.Province_State', item.Province_State);
        console.log(item);
      }
    }
  }
}

const stateFixes = {
  Chicago: 'Illinois',
  'Grand Princess Cruise Ship': 'Grand Princess',
  'Unassigned Location (From Diamond Princess)': 'Diamond Princess',
  'Washington, D.C.': 'District of Columbia',
  'United States Virgin Islands': 'Virgin Islands',
  'Virgin Islands, U.S.': 'Virgin Islands',
  'Omaha, NE (From Diamond Princess)': 'Nebraska',
  'Travis, CA (From Diamond Princess)': 'California',
  'Lackland, TX (From Diamond Princess)': 'Texas',
};

// !!@     "Province_State": "Wuhan Evacuee",
// "first_date": {
//   "Cases": "2020-03-22"

// // https://gist.github.com/mshafrir/2646763#file-states_hash-json
const stateCodeMaps = require('./states_hash.json');

// ----------------------------------------------------------------------------
// -- NOT USED --

// const pop = require('./world-population/pop2018.json');
// const pop_by_country = {};
// pop.forEach((item) => {
//   pop_by_country[item.country_name] = item;
// });

const Country_Region_to_country_name = {
  UK: 'United Kingdom',
  Macau: 'China',
  Taiwan: 'China',
  'South Korea': 'Korea, Rep.',
  US: 'United States',
  Iran: 'Iran, Islamic Rep.',
  Venezuela: 'Venezuela, RB',
  Bahamas: 'Bahamas, The',
  Brunei: 'Brunei Darussalam',
  Burma: 'Myanmar',
  'Congo (Brazzaville)': 'Congo, Rep.',
  'Congo (Kinshasa)': 'Congo, Rep.',
  Czechia: 'Czech Republic',
  Egypt: 'Egypt, Arab Rep.',
  Gambia: 'Gambia, The',
  'Korea, South': 'Korea, Rep.',
  Kyrgyzstan: 'Kyrgyz Republic',
  Laos: 'Lao PDR',
  Russia: 'Russian Federation',
  'Saint Kitts and Nevis': 'St. Kitts and Nevis',
  'Saint Lucia': 'St. Lucia',
  'Saint Vincent and the Grenadines': 'St. Vincent and the Grenadines',
  Slovakia: 'Slovak Republic',
  Syria: 'Syrian Arab Republic',
  Yemen: 'Yemen, Rep.',
};

// set_population: country_name missing Diamond Princess
// set_population: country_name missing Eritrea
// set_population: country_name missing Holy See
// set_population: country_name missing MS Zaandam
// set_population: country_name missing Taiwan*
// set_population: country_name missing Western Sahara

// sums[0] {"Confirmed":869170,"Deaths":49954,"Country_Region":"US"}
// "country_name": "United States",

// sums[7] {"Confirmed":87026,"Deaths":5481,"Country_Region":"Iran"}
// "country_name": "Iran, Islamic Rep.",

// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-23-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-21-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/01-22-2020.csv';

function find_population(item, silent) {
  let cname = Country_Region_to_country_name[item.Country_Region];
  if (!cname) cname = item.Country_Region;
  let ncountry = pop_by_country[cname];
  if (!ncountry) {
    if (!silent) {
      // console.log('silent', silent);
      console.log('set_population: country_name missing', cname);
    }
    return 0;
  }
  return ncountry.population;
  // console.log('set_population: item', item);
}

// { 'Province/State': 'Hubei',
// 'Country/Region': 'China',
// 'Last Update': '2020-03-21T10:13:08',
// Confirmed: '67800',
// Deaths: '3139',
// Recovered: '58946',
// Latitude: '30.9756',
// Longitude: '112.2707',
// source_index: 0 }

// { FIPS: '36031',
// Admin2: 'Essex',
// Province_State: 'New York',
// Country_Region: 'US',
// Last_Update: '2020-04-22 00:00:00',
// Lat: '44.11630765',
// Long_: '-73.77297842',
// Confirmed: '22',
// Deaths: '0',
// Recovered: '0',
// Active: '22',
// Combined_Key: 'Essex, New York, US' }

// ----------------------------------------------------------------------------

module.exports = {
  rename_item,
  find_population,
};
