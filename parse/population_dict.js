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

  // Write copy of csv in unix line ending to track changes via git
  const strOut = (input + '').replace(/\r\n/g, '\n');
  fs.writeFileSync('./UID_ISO_FIPS_LookUp_Table.csv', strOut);

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
        if (
          rent.Country_Region == 'United States' &&
          rent.Province_State == 'New York'
        ) {
          const nAdmin2 = newYorkCountyFixes[rent.Admin2];
          if (nAdmin2) rent.Admin2 = nAdmin2;
        }
        if (!sent.states) {
          sent.states = {};
        }
        sent.states[rent.Admin2] = { Population: rent.Population };
      }
    }
  }
  fs.writeJsonSync(population_json_path, pop_dict, { spaces: 2 });
}

const Country_Region_renames = {
  US: 'United States',
  'Korea, South': 'South Korea',
};

const newYorkCountyFixes = {
  Kings: 'Brooklyn',
  'New York': 'Manhattan',
  Richmond: 'Staten Island',
};

const Country_Region_renames2 = {
  'Korea, South': {
    Country_Region: 'South Korea',
  },
  US: {
    Country_Region: 'United States',
    Province_State: {
      'New York': {
        Admin2: {
          Kings: 'Brooklyn',
          'New York': 'Manhattan',
          Richmond: 'Staten Island',
        },
      },
    },
  },
};

if (!module.parent) {
  const start_time = Date.now();

  process_population_table();

  const lapse_time = Date.now() - start_time;
  console.log(population_json_path + ' lapse sec', lapse_time / 1000);
}
