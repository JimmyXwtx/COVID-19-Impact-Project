//
// parse population csv
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');

const population_table_path = './UID_ISO_FIPS_LookUp_Table.csv';
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
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  let pop_dict = {};
  for (let rent of records) {
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
      sent = { Population: rent.Population };
      cent.states[rent.Province_State] = sent;
    } else {
      // ...
    }
    // sent.Population += rent.Population;
    // cent.Population += rent.Population;
  }
  // console.log('pop_dict', pop_dict);
  fs.writeJsonSync(population_json_path, pop_dict, { spaces: 2 });

  // console.log('process_population_table records', records);
  // for (let index = 0; index < 10; index++) {
  //   console.log(index, records[index]);
  // }
}

if (!module.parent) {
  const start_time = Date.now();

  process_population_table();

  const lapse_time = Date.now() - start_time;
  console.log('lapse sec', lapse_time / 1000);
}
