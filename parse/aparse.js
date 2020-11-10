//
// COVID stats parse from csv to json
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const { rename_item, country_pop_ent } = require('./country');

// const nlimit = 5;
const nlimit = 0;
const argv_silent = argv.silent;
const argv_verbose = !argv_silent;

const daily_dir =
  '../COVID-19-JHU/csse_covid_19_data/csse_covid_19_daily_reports/';

const store_dir = '../dashboard/public/c_data/';

const stats_init = { Cases: 0, Deaths: 0 };

let fromDate;
let toDate;

const start_time = Date.now();
const pop_missing = {};
const report_lines = [];

process_dir();

function process_dir() {
  // process_population_table();
  const nfiles = fs.readdirSync(daily_dir);
  let index = 0;
  let country_dict;
  for (let nfile of nfiles) {
    const fparse = path.parse(nfile);
    if (fparse.ext != '.csv') continue;
    const cvs_path = path.resolve(daily_dir, nfile);
    country_dict = process_cvs(cvs_path, fparse.name);
    index++;
    if (nlimit && index >= nlimit) break;
  }
  const keys = Object.keys(pop_missing);
  // report_log('pop_missing', keys.length, keys.sort());
  report_log('pop_missing ' + keys.length);
  report_log(JSON.stringify(keys.sort(), null, 2));

  process_summary(country_dict);

  report_write();
}

function report_write() {
  fs.writeFileSync('./report.txt', report_lines.join('\n'));
}

function report_log(aline, aobj) {
  report_lines.push(aline);
  if (argv_verbose) console.log(aline);
}

function process_summary(country_dict) {
  report_log('Parsed fromDate=' + fromDate + ' toDate=' + toDate);

  const parse_time = Date.now() - start_time;
  if (argv_verbose) {
    report_log('parse sec ' + parse_time / 1000);
    report_log('-------------------------------------------');
  }

  // Write meta for countries
  write_meta(store_dir, { key: 'c_ref', country_dict });
  if (argv_verbose) {
    report_log('-------------------------------------------');
  }

  // Write meta for states with in each country that has them
  const states_path = path.resolve(store_dir, 'c_subs');
  for (let country in country_dict) {
    const cent = country_dict[country];
    if (!cent.ncountry) {
      // report_log('skipping country', country);
      continue;
    }
    const state_dir = path.resolve(states_path, cent.ncountry);
    // report_log('process_summary fpath', fpath);
    // write_meta(state_dir, { key: 'Province_State', state_name });
    write_meta(state_dir, {
      key: 'c_ref',
      state_name: cent.ncountry,
      country_dict: cent.states,
    });
  }
  // const states_files = fs.readdirSync(states_path);
  // for (let state_name of states_files) {
  //   if (state_name.substr(0, 1) === '.') continue;
  //   const state_dir = path.resolve(states_path, state_name);
  //   // report_log('process_summary fpath', fpath);
  //   // write_meta(state_dir, { key: 'Province_State', state_name });
  //   write_meta(state_dir, { key: 'c_ref', state_name });
  // }

  const lapse_time = Date.now() - start_time;
  if (argv_verbose) {
    report_log('-------------------------------------------');
    report_log('lapse sec ' + lapse_time / 1000);
  }
}

function process_cvs(cvs_inpath, file_date) {
  // 05-15-2020 --> 2020-05-15
  // 0123456789
  file_date =
    file_date.substring(6, 10) +
    '-' +
    file_date.substring(0, 3) +
    file_date.substring(3, 5);

  if (!toDate) toDate = file_date;
  if (!fromDate) fromDate = file_date;
  if (toDate < file_date) toDate = file_date;
  if (fromDate > file_date) fromDate = file_date;

  // const sums_country = {};
  const sums_total = Object.assign({}, stats_init);
  const country_dict = {};

  const input = fs.readFileSync(cvs_inpath);
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;

    const Country_Region = item.Country_Region;
    if (!Country_Region) {
      if (argv_verbose) {
        const str = JSON.stringify(item);
        report_log('!!@ empty Country_Region ' + file_date + ' ' + str);
      }
      return;
    }
    // let ent = sums_country[Country_Region];
    // if (!ent) {
    //   // { Cases: 0, Deaths: 0, Recovered: 0 };
    //   const totals = Object.assign({}, stats_init);
    //   ent = { c_ref: Country_Region, totals };
    //   sums_country[Country_Region] = ent;
    // }
    // calc(ent.totals, item);
    // calc(sums_total, item);

    let cent = country_dict[Country_Region];
    if (!cent) {
      const totals = Object.assign({}, stats_init);
      const pop_ent = country_pop_ent(Country_Region, pop_missing);
      // if (Country_Region === 'United States') report_log('pop_ent', pop_ent);
      cent = {
        c_ref: Country_Region,
        totals,
        c_people: pop_ent ? pop_ent.Population : 0,
        pop_ent,
        states: {},
      };
      country_dict[Country_Region] = cent;
    }
    calc(cent.totals, item);
    calc(sums_total, item);

    let Province_State = item.Province_State;
    if (
      Province_State &&
      Province_State !== 'Recovered' &&
      Province_State !== Country_Region
    ) {
      let ent = cent.states[Province_State];
      if (!ent) {
        const pop_ent = cent.pop_ent && cent.pop_ent.states[Province_State];
        // if (Country_Region === 'United States')
        //   report_log(
        //     // 'Country_Region',
        //     // Country_Region,
        //     'Province_State',
        //     Province_State,
        //     'pop_ent',
        //     pop_ent
        //   );
        const totals = Object.assign({}, stats_init);
        ent = {
          c_ref: Province_State,
          totals,
          c_people: pop_ent ? pop_ent.Population : 0,
          states: {},
        };
        cent.states[Province_State] = ent;
      }
      calc(ent.totals, item);
    }
  }
  function calc(sums, item) {
    for (let prop in stats_init) {
      let val = item[prop];
      if (!val) val = 0;
      sums[prop] += parseFloat(val);
    }
  }
  write_daily(country_dict, file_date, store_dir);

  for (let country in country_dict) {
    const cent = country_dict[country];
    // report_log('file_date', file_date, 'country', country, 'cent', cent);
    const ncountry = fileNameFromCountryName(country);
    cent.ncountry = ncountry;
    let cpath = path.resolve(store_dir, 'c_subs', ncountry);
    const writen = write_daily(cent.states, file_date, cpath);
    if (!writen) delete cent.ncountry;
  }
  return country_dict;
}

function fileNameFromCountryName(country) {
  return country.replace(/ /g, '_').replace(/,/g, '');
}

function write_daily(country_dict, file_date, path_root) {
  // if (argv_sort_deaths) {
  //   sums = Object.values(country_dict);
  //   sums.sort((item1, item2) => item2.totals.Deaths - item1.totals.Deaths);
  // } else
  // {
  const keys = Object.keys(country_dict).sort();
  const sums = keys.map(key => {
    const { c_ref, totals } = country_dict[key];
    return { c_ref, totals };
  });
  // }
  if (sums.length <= 0) {
    // report_log('write_daily empty', file_date, path_root);
    return 0;
  }
  let cpath = path.resolve(path_root, 'c_days');
  fs.ensureDirSync(cpath);
  const fname = file_date + '.json';
  cpath = path.resolve(cpath, fname);
  fs.writeJsonSync(cpath, sums, { spaces: 2 });
  return 1;
}

function write_meta(state_dir, { key, state_name, country_dict }) {
  // report_log('write_meta state_dir', state_dir);
  const c_dates = [];
  const days_path = path.resolve(state_dir, 'c_days');
  const summaryDict = {};
  if (!fs.existsSync(days_path)) {
    report_log('write_meta missing days_path ' + days_path);
    return null;
  }
  let cdict = {};
  let prior_cdict;
  // file names are sorted to get prior stats
  const day_names = fs.readdirSync(days_path).sort();
  for (let day_name of day_names) {
    // eg. fname=2020-01-22.json
    if (!day_name.endsWith('.json')) continue;
    const date = day_name.substr(0, day_name.length - 5);
    c_dates.push(date);
    const fpath = path.resolve(days_path, day_name);
    const fitem = fs.readJsonSync(fpath);
    if (fitem) {
      prior_cdict = cdict;
      cdict = {};
      fitem.forEach(citem => {
        const kvalue = citem[key];
        cdict[kvalue] = citem;
        let ent = summaryDict[kvalue];
        if (!ent) {
          ent = {};
          ent[key] = kvalue;
          ent.c_first = {};
          summaryDict[kvalue] = ent;
        }
        let { Cases, Deaths } = citem.totals;
        if (Cases && !ent.c_first.Cases) {
          ent.c_first.Cases = date;
        }
        if (Deaths && !ent.c_first.Deaths) {
          ent.c_first.Deaths = date;
        }
        // Daily is difference between now and prior
        const cprior = prior_cdict[kvalue];
        if (cprior) {
          Cases -= cprior.totals.Cases;
          Deaths -= cprior.totals.Deaths;
        }
        citem.daily = { Cases, Deaths };
        ent.last_date = date;
      });
      // Write out updated daily
      fs.writeJsonSync(fpath, fitem, { spaces: 2 });
    } else {
      report_log('write_meta readJson failed', fpath);
    }
  }
  // Write out summary, remove last_date if current
  const ckeys = Object.keys(summaryDict).sort();
  const c_regions = ckeys.map(uname => {
    const ent = summaryDict[uname];
    if (ent.last_date === toDate) {
      delete ent.last_date;
    } else if (state_name) {
      if (argv_verbose) {
        report_log(state_name + '|' + uname + '| last_date ' + ent.last_date);
      }
    }
    if (country_dict) {
      const cent = country_dict[uname];
      if (cent) {
        // const n_states = Object.keys(cent.states ? cent.states : {}).length;
        const n_states = Object.keys(cent.states).length;
        if (n_states) {
          ent.n_states = n_states;
          if (argv_verbose) {
            report_log(uname + '| n_states ' + ent.n_states);
          }
        }
        ent.c_people = cent.c_people;
      }
    }
    return ent;
  });
  const outpath_meta = path.resolve(state_dir, 'c_meta.json');
  const meta = { c_regions, c_dates };
  fs.writeJsonSync(outpath_meta, meta, { spaces: 2 });
  return meta;
}

function dump(records, sums_total, sums, cvs_inpath, outpath_country) {
  report_log('records[0] ' + records[0]);
  report_log('sums_total ' + sums_total);
  report_log('sums.length ' + sums.length);
  const ndump = 1;
  for (let index = 0; index < ndump; index++) {
    report_log('sums[' + index + '] ' + JSON.stringify(sums[index]));
  }
  report_log(cvs_inpath);
  report_log(outpath_country, '\n');
}
