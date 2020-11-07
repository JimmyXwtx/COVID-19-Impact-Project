//
// COVID stats parse from csv to json
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

// const nlimit = 5;
const nlimit = 0;
const argv_silent = argv.silent;
const argv_verbose = !argv_silent;
const argv_sort_deaths = argv.sort_deaths;

// const { rename_item, find_population } = require('./country');
const { rename_item } = require('./country');

const daily_dir =
  '../COVID-19-JHU/csse_covid_19_data/csse_covid_19_daily_reports/';
const store_dir = '../dashboard/public/c_data/';
const stats_init = { Cases: 0, Deaths: 0 };
let fromDate;
let toDate;

const start_time = Date.now();

process_dir();

function process_dir() {
  // process_init();
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
  process_summary(country_dict);
}

function process_summary(country_dict) {
  console.log('Parsed fromDate=' + fromDate + ' toDate=' + toDate);

  const parse_time = Date.now() - start_time;
  if (argv_verbose) {
    console.log('parse sec', parse_time / 1000);
    console.log('-------------------------------------------');
  }

  // Write meta for countries
  write_meta(store_dir, { key: 'Country_Region', country_dict });
  if (argv_verbose) {
    console.log('-------------------------------------------');
  }

  // Write meta for states with in each country that has them
  const states_path = path.resolve(store_dir, 'c_states');
  const states_files = fs.readdirSync(states_path);
  for (let state_name of states_files) {
    if (state_name.substr(0, 1) === '.') continue;
    const state_dir = path.resolve(states_path, state_name);
    // console.log('process_summary fpath', fpath);
    write_meta(state_dir, { key: 'Province_State', state_name });
  }

  const lapse_time = Date.now() - start_time;
  if (argv_verbose) {
    console.log('-------------------------------------------');
    console.log('lapse sec', lapse_time / 1000);
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

  const sums_country = {};
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
        console.log('!!@ empty Country_Region', file_date, str);
      }
      return;
    }
    let ent = sums_country[Country_Region];
    if (!ent) {
      // { Cases: 0, Deaths: 0, Recovered: 0 };
      const totals = Object.assign({}, stats_init);
      ent = { Country_Region, totals };
      sums_country[Country_Region] = ent;
      // console.log('process_item silent', silent);
      // stats.population = find_population(item, silent);
    }
    calc(ent.totals, item);
    calc(sums_total, item);

    let states = country_dict[Country_Region];
    if (!states) {
      states = {};
      country_dict[Country_Region] = states;
    }
    let Province_State = item.Province_State;
    // if (! Province_State) Province_State = Country_Region;
    // console.log('item', item);
    // console.log('Province_State', Province_State);

    if (
      Province_State &&
      Province_State !== 'Recovered' &&
      Province_State !== Country_Region
    ) {
      ent = states[Province_State];
      if (!ent) {
        const totals = Object.assign({}, stats_init);
        ent = { Province_State, totals };
        states[Province_State] = ent;
      }
      calc(ent.totals, item);
    }
  }
  function calc(sums, item) {
    for (let prop in stats_init) {
      let val = item[prop];
      if (!val) val = 0;
      sums[prop] += parseInt(val);
    }
  }
  write_daily(sums_country, file_date, store_dir);
  for (let country in country_dict) {
    const ent = country_dict[country];
    // console.log('file_date', file_date, 'country', country, 'ent', ent);
    const ncountry = fileNameFromCountryName(country);
    let cpath = path.resolve(store_dir, 'c_states', ncountry);
    write_daily(ent, file_date, cpath);
  }
  return country_dict;
}

function fileNameFromCountryName(country) {
  return country.replace(/ /g, '_').replace(/,/g, '');
}

function write_daily(sums_country, file_date, path_root) {
  let sums;
  if (argv_sort_deaths) {
    sums = Object.values(sums_country);
    sums.sort((item1, item2) => item2.totals.Deaths - item1.totals.Deaths);
  } else {
    const keys = Object.keys(sums_country).sort();
    sums = keys.map(key => sums_country[key]);
  }
  if (sums.length <= 0) {
    // console.log('write_daily empty', file_date, path_root);
    return;
  }
  let cpath = path.resolve(path_root, 'c_days');
  fs.ensureDirSync(cpath);
  const fname = file_date + '.json';
  cpath = path.resolve(cpath, fname);
  fs.writeJsonSync(cpath, sums, { spaces: 2 });
}

function dump(records, sums_total, sums, cvs_inpath, outpath_country) {
  console.log('records[0]', records[0]);
  console.log('sums_total', sums_total);
  console.log('sums.length', sums.length);
  const ndump = 1;
  for (let index = 0; index < ndump; index++) {
    console.log('sums[' + index + ']', JSON.stringify(sums[index]));
  }
  console.log(cvs_inpath);
  console.log(outpath_country, '\n');
}

function write_meta(state_dir, { key, state_name, country_dict }) {
  const dates = [];
  const days_path = path.resolve(state_dir, 'c_days');
  const summaryDict = {};
  if (!fs.existsSync(days_path)) {
    console.log('write_meta missing days_path', days_path);
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
    dates.push(date);
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
          ent.first_date = {};
          summaryDict[kvalue] = ent;
        }
        let { Cases, Deaths } = citem.totals;
        if (Cases && !ent.first_date.Cases) {
          ent.first_date.Cases = date;
        }
        if (Deaths && !ent.first_date.Deaths) {
          ent.first_date.Deaths = date;
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
      console.log('write_meta readJson failed', fpath);
    }
  }
  // Write out all dates seen
  // const outpath_dates = path.resolve(state_dir, 'cdates.json');
  // fs.writeJsonSync(outpath_dates, dates, { spaces: 2 });

  // Write out summary, remove last_date if current
  const ckeys = Object.keys(summaryDict).sort();
  const regions = ckeys.map(uname => {
    const ent = summaryDict[uname];
    if (ent.last_date === toDate) {
      delete ent.last_date;
    } else if (state_name) {
      if (argv_verbose) {
        console.log(state_name + '|' + uname + '|', 'last_date', ent.last_date);
      }
    }
    if (country_dict) {
      const cent = country_dict[uname];
      if (cent) {
        const n_states = Object.keys(cent).length;
        if (n_states) {
          ent.n_states = n_states;
          if (argv_verbose) {
            console.log(uname + '|', 'n_states', ent.n_states);
          }
        }
      }
    }
    return ent;
  });
  const outpath_meta = path.resolve(state_dir, 'c_meta.json');
  const meta = { regions, dates };
  fs.writeJsonSync(outpath_meta, meta, { spaces: 2 });
  return meta;
}
