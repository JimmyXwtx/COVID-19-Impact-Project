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
  // 'South Korea': 'Korea, South',
  'Korea, South': 'South Korea',
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
  } else if (item.Country_Region == 'France') {
    if (!item.Province_State) {
      // console.log('France', item);
      // Must not be 'France' or will be filtered out
      item.Province_State = 'France Mainland';
    } else if (item.Province_State == 'Fench Guiana') {
      item.Province_State = 'French Guiana';
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

const { population_dict } = require('./population_dict');

let pop_dict = population_dict();
// console.log('pop_dict n', Object.keys(pop_dict).length);

function country_pop_ent(Country_Region, missing) {
  let pop_ent = pop_dict[Country_Region];
  if (!pop_ent) {
    missing[Country_Region] = 1;
    return 0;
  }
  return pop_ent;
  // console.log('set_population: item', item);
}

// ----------------------------------------------------------------------------

module.exports = {
  rename_item,
  country_pop_ent,
  pop_dict,
};
