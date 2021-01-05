//
// COVID stats parse from csv to json
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const report = require('./report');
const cdata = require('./cdata');
const { rename_item, country_pop_ent, pop_dict } = require('./country');

// const nlimit = 5;
const nlimit = 0;
const argv_silent = argv.silent;
const argv_verbose = !argv_silent;

report.verbose(argv_verbose);

const daily_dir =
  '../COVID-19-JHU/csse_covid_19_data/csse_covid_19_daily_reports/';

// const store_dir = '../dashboard/public/c_data/world';
const store_dir = '../parsed-data/c_data/world';

let from_date;
let to_date;

const start_time = Date.now();
const pop_missing = {};

process_world_dir();

function process_world_dir() {
  report.log('pop_dict n ' + Object.keys(pop_dict).length);

  const sub_dict = process_dir_csv();

  process_summary(sub_dict);

  report.flush();
}

function process_dir_csv() {
  const nfiles = fs.readdirSync(daily_dir);
  let index = 0;
  let sub_dict;
  for (let nfile of nfiles) {
    const fparse = path.parse(nfile);
    if (fparse.ext != '.csv') continue;
    const csv_path = path.resolve(daily_dir, nfile);
    sub_dict = process_file_csv(csv_path, fparse.name);
    index++;
    if (nlimit && index >= nlimit) break;
  }
  const keys = Object.keys(pop_missing);
  // report.log('pop_missing', keys.length, keys.sort());
  report.log('pop_missing ' + keys.length);
  report.log(JSON.stringify(keys.sort(), null, 2));
  return sub_dict;
}

function process_summary(sub_dict) {
  report.log('Parsed from_date=' + from_date + ' to_date=' + to_date);

  const parse_time = Date.now() - start_time;
  report.log('parse sec ' + parse_time / 1000);
  report.log('-------------------------------------------');

  // Write meta for countries
  cdata.write_meta(store_dir, {
    sub_dict,
    report_n_subs: 1,
    to_date,
    c_title: 'Worldwide',
    c_sub_titles: ['Country', 'State', 'County'],
  });

  const lapse_time = Date.now() - start_time;
  report.log('-------------------------------------------');
  report.log('lapse sec ' + lapse_time / 1000);
}

function process_file_csv(csv_inpath, file_date) {
  // 05-15-2020 --> 2020-05-15
  // 0123456789
  file_date =
    file_date.substring(6, 10) +
    '-' +
    file_date.substring(0, 3) +
    file_date.substring(3, 5);

  if (!to_date) to_date = file_date;
  if (!from_date) from_date = file_date;
  if (to_date < file_date) to_date = file_date;
  if (from_date > file_date) from_date = file_date;

  // const sums_country = {};
  const sums_total = cdata.empty();
  const sub_dict = {};

  const input = fs.readFileSync(csv_inpath);
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;

    // console.log('process_item item', item);

    if (!cdata.hasValue(item)) {
      return;
    }

    const Country_Region = item.Country_Region;
    if (!Country_Region) {
      const str = JSON.stringify(item);
      report.log('!!@ empty Country_Region ' + file_date + ' ' + str);
      return;
    }

    let cent = sub_dict[Country_Region];
    if (!cent) {
      //  { Cases: 0, Deaths: 0 };
      const totals = cdata.empty();
      const pop_ent = country_pop_ent(Country_Region, pop_missing);
      // if (Country_Region === 'United States') report.log('pop_ent', pop_ent);
      cent = {
        c_ref: Country_Region,
        totals,
        c_people: pop_ent ? pop_ent.Population : 0,
        pop_ent,
        subs: {},
      };
      sub_dict[Country_Region] = cent;
    }
    cdata.calc(cent.totals, item);
    cdata.calc(sums_total, item);

    let Province_State = item.Province_State;
    if (
      Province_State &&
      Province_State !== 'Recovered' &&
      Province_State !== Country_Region
    ) {
      let sent = cent.subs[Province_State];
      if (!sent) {
        const pop_ent = cent.pop_ent && cent.pop_ent.subs[Province_State];
        const totals = cdata.empty();
        sent = {
          c_ref: Province_State,
          totals,
          c_people: pop_ent ? pop_ent.Population : 0,
          subs: {},
        };
        cent.subs[Province_State] = sent;
      }
      cdata.calc(sent.totals, item);
      const Admin2 = item.Admin2;
      if (Admin2) {
        let aent = sent.subs[Admin2];
        if (!aent) {
          let pop_ent = cent.pop_ent && cent.pop_ent.subs[Province_State];
          if (pop_ent && pop_ent.subs) {
            pop_ent = pop_ent.subs[Admin2];
          }
          const totals = cdata.empty();
          aent = {
            c_ref: Admin2,
            totals,
            c_people: pop_ent ? pop_ent.Population : 0,
            subs: {},
          };
          sent.subs[Admin2] = aent;
        }
        cdata.calc(aent.totals, item);
      }
    }
  }

  cdata.write_daily(sub_dict, file_date, store_dir);

  return sub_dict;
}
