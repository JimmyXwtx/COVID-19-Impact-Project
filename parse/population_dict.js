//
// parse population csv
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');

// const population_table_path = './UID_ISO_FIPS_LookUp_Table.csv';
const population_table_path =
  '../COVID-19-JHU/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv';
const population_json_path = './population.json';

module.exports = {
  population_dict,
};

function population_dict() {
  const pop_dict = fs.readJsonSync(population_json_path);
  return pop_dict;
}

// 0 {
//   UID: '4',
//   iso2: 'AF',
//   iso3: 'AFG',
//   code3: '4',
//   FIPS: '',
//   Admin2: '',
//   Province_State: '',
//   Country_Region: 'Afghanistan',
//   Lat: '33.93911',
//   Long_: '67.709953',
//   Combined_Key: 'Afghanistan',
//   Population: '38928341'
// }

function process_population_table() {
  const input = fs.readFileSync(population_table_path);
  // const input = (fs.readFileSync(population_table_path) + '').replace(/\r?\n/, '\n');
  fs.writeFileSync(
    './UID_ISO_FIPS_LookUp_Table.csv',
    (input + '').replace(/\r\n/g, '\n')
  );
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  let pop_dict = {};
  for (let rent of records) {
    const cname = Country_Region_renames[rent.Country_Region];
    if (cname) rent.Country_Region = cname;

    rent.Population = parseFloat(rent.Population ? rent.Population : 0);

    let cent = pop_dict[rent.Country_Region];
    if (!cent) {
      cent = { Population: rent.Population, states: {} };
      pop_dict[rent.Country_Region] = cent;
    } else {
      // ...
    }
    if (!rent.Province_State) continue;
    let sent = cent.states[rent.Province_State];
    if (!sent) {
      // First occurrence of Province_State is for entire state
      sent = { Population: rent.Population };
      cent.states[rent.Province_State] = sent;
    } else {
      if (rent.Admin2) {
        if (!sent.states) {
          sent.states = {};
        }
        sent.states[rent.Admin2] = { Population: rent.Population };
      }
    }
  }
  fs.writeJsonSync(population_json_path, pop_dict, { spaces: 2 });

  // console.log('process_population_table records', records);
  // for (let index = 0; index < 10; index++) {
  //   console.log(index, records[index]);
  // }
}

// pop_missing [
//   'Aruba',
//   'Cape Verde',
//   'Cayman Islands',
//   'Channel Islands',
//   'Cruise Ship',
//   'Curacao',
//   'Czech Republic',
//   'East Timor',
//   'Faroe Islands',
//   'French Guiana',
//   'Gibraltar',
//   'Greenland',
//   'Guadeloupe',
//   'Guam',
//   'Guernsey',
//   'Hong Kong SAR',
//   'Ivory Coast',
//   'Jersey',
//   'Macao SAR',
//   'Macau',
//   'Martinique',
//   'Mayotte',
//   'North Ireland',
//   'Others',
//   'Palestine',
//   'Republic of Ireland',
//   'Republic of Korea',
//   'Republic of Moldova',
//   'Reunion',
//   'Russian Federation',
//   'Saint Barthelemy',
//   'Saint Martin',
//   'St. Martin',
//   'Taipei and environs',
//   'United States',
//   'Vatican City',
//   'occupied Palestinian territory'
// ]
const Country_Region_renames = {
  US: 'United States',
};

if (!module.parent) {
  const start_time = Date.now();

  process_population_table();

  const lapse_time = Date.now() - start_time;
  console.log(population_json_path + ' lapse sec', lapse_time / 1000);
}
