//
// Basic totals from COVID data
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');

const path =
  './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/04-23-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-23-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/03-21-2020.csv';
// './COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/01-22-2020.csv';
const input = fs.readFileSync(path);
const records = parse(input, {
  columns: true,
  skip_empty_lines: true,
});

// const nrecords = records.filter((item, index) => index < 4);
const renames = {
  'Province/State': 'Province_State',
  'Country/Region': 'Country_Region',
};
const sums_us = { Confirmed: 0, Deaths: 0 };
const sums_total = { Confirmed: 0, Deaths: 0 };

function calc(sums, item) {
  for (let prop in sums) {
    let val = item[prop];
    if (!val) val = 0;
    sums[prop] += parseInt(val);
  }
}

function rename_item(item) {
  for (let prop in renames) {
    const nprop = renames[prop];
    const val = item[prop];
    if (val) item[nprop] = val;
  }
}

function include_test(item) {
  // item.Province_State == 'New York' && item.Country_Region == 'US';
  return item.Country_Region == 'US';
}

function filter_item(item, index) {
  rename_item(item);
  item.source_index = index;
  const include = include_test(item);
  if (include) {
    calc(sums_us, item);
  }
  calc(sums_total, item);
  return include;
}

// sums { Confirmed: 2708885, Deaths: 190858 }

const nrecords = records.filter(filter_item);
// nrecords.length 59

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

function show_filter(item, index) {
  return index > 10 && index < 15;
}

console.log('\n', path);
console.log('records[0]', records[0]);
// console.log('nrecords', nrecords.filter(show_filter));
console.log('nrecords.length', nrecords.length, '\n');
console.log('sums_us', sums_us);
console.log('sums_total', sums_total);
console.log('\n');
