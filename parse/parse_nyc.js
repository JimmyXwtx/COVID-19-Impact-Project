//
// parse COVID  NYC stats from csv to json
//
/* eslint-disable max-len */

// Input: ./nyc-data/repo/totals/data-by-modzcta.csv
//    stats by borough / zipcode
// eg:
//  MODIFIED_ZCTA,NEIGHBORHOOD_NAME,BOROUGH_GROUP,COVID_CASE_COUNT,COVID_CASE_RATE,POP_DENOMINATOR,
//    COVID_DEATH_COUNT,COVID_DEATH_RATE,PERCENT_POSITIVE,TOTAL_COVID_TESTS
//  11234,Bergen Beach/Flatlands/Marine Park/Mill Basin,Brooklyn,3259,3464.95,94056.07,197,209.45,10.05,31969
//
// Write out per-day csv
//  ./nyc-data
//    repo
//    days
//      2020-12-04.csv
//

// rm -rf ../dashboard/public/c_data/nyc/
// node parse_nyc --date 2020-12-03

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const report = require('./report');

// const nlimit = 5;
const nlimit = 0;
const argv_silent = argv.silent;
const argv_verbose = !argv_silent;
const argv_date = argv.date;

console.log('report', report);
report.verbose(argv_verbose);
report.logFile('./report-nyc.txt');

const daily_file = '../nyc-data/repo/totals/data-by-modzcta.csv';

const store_dir = '../dashboard/public/c_data/nyc/';

const csv_out_dir = '../nyc-data/days/';

const data_file = './data/data-by-modzcta.csv';

const stats_init = { Cases: 0, Deaths: 0 };
let fromDate;
let toDate;

const start_time = Date.now();

function process_nyc() {
  // 2020-12-06T06:31:38.404Z
  // 1234567890
  //
  let filedate = argv_date;
  if (!filedate) filedate = new Date().toISOString().substring(0, 10);

  const sub_dict = process_file_csv(daily_file, filedate);

  process_summary(sub_dict);

  report.flush();
}

function process_summary(sub_dict) {
  const parse_time = Date.now() - start_time;
  report.log('parse sec ' + parse_time / 1000);
  report.log('-------------------------------------------');

  // Write meta for countries
  write_meta(store_dir, { sub_dict, report_n_subs: 1 });

  const lapse_time = Date.now() - start_time;
  report.log('-------------------------------------------');
  report.log('lapse sec ' + lapse_time / 1000);
}

function process_file_csv(csv_inpath, file_date) {
  console.log('csv_inpath', csv_inpath, 'file_date', file_date);
  if (!toDate) toDate = file_date;
  if (!fromDate) fromDate = file_date;
  if (toDate < file_date) toDate = file_date;
  if (fromDate > file_date) fromDate = file_date;

  const sums_total = Object.assign({}, stats_init);
  const sub_dict = {};

  const strIn = fs.readFileSync(csv_inpath);
  console.log('process_file_csv  strIn.length', strIn.length);

  // Write out csv to csv_out_dir
  fs.ensureDirSync(csv_out_dir);
  const cpath = path.resolve(csv_out_dir, file_date + '.csv');
  const strOut = (strIn + '').replace(/\r\n/g, '\n');
  fs.writeFileSync(cpath, strOut);
  fs.writeFileSync(data_file, strOut);

  const records = parse(strIn, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;

    // console.log('process_item', item);
    if (!hasValue(item)) {
      return;
    }

    const key1 = item.BOROUGH_GROUP;
    if (!key1) {
      const str = JSON.stringify(item);
      report.log('!!@ empty key1 ' + file_date + ' ' + str);
      return;
    }

    let cent = sub_dict[key1];
    if (!cent) {
      // stats_init = { Cases: 0, Deaths: 0 };
      const totals = Object.assign({}, stats_init);
      // if (key1 === 'United States') report.log('pop_ent', pop_ent);
      cent = {
        c_ref: key1,
        totals,
        states: {},
      };
      sub_dict[key1] = cent;
    }
    calc(cent.totals, item);
    calc(sums_total, item);

    let key2 = item.MODIFIED_ZCTA + ' ' + item.NEIGHBORHOOD_NAME;
    if (key2) {
      let sent = cent.states[key2];
      if (!sent) {
        const totals = Object.assign({}, stats_init);
        sent = {
          c_ref: key2,
          totals,
          states: {},
        };
        cent.states[key2] = sent;
      }
      calc(sent.totals, item);
    }
  }
  function hasValue(item) {
    let sum = 0;
    for (let prop in stats_init) {
      let val = item[prop];
      if (!val) val = 0;
      sum += parseFloat(val);
    }
    return sum;
  }
  function calc(sums, item) {
    for (let prop in stats_init) {
      let val = item[prop];
      if (!val) val = 0;
      sums[prop] += parseFloat(val);
    }
  }

  write_daily(sub_dict, file_date, store_dir);

  return sub_dict;
}

const prop_renames = {
  COVID_CASE_COUNT: 'Cases',
  COVID_DEATH_COUNT: 'Deaths',
};

function rename_item(item) {
  for (let prop in prop_renames) {
    const nprop = prop_renames[prop];
    const val = item[prop];
    if (val) item[nprop] = val;
  }
}

function write_subs(subs_dict, file_date, path_root) {
  for (let country in subs_dict) {
    const cent = subs_dict[country];
    // report.log('file_date', file_date, 'country', country, 'cent', cent);
    const ncountry = fileNameFromCountryName(country);
    cent.ncountry = ncountry;
    let cpath = path.resolve(path_root, 'c_subs', ncountry);
    const some = write_daily(cent.states, file_date, cpath);
    if (!some) {
      delete cent.ncountry;
    }
  }
}

function fileNameFromCountryName(country) {
  return country.replace(/ /g, '_').replace(/,/g, '');
}

function write_daily(sub_dict, file_date, path_root) {
  const keys = Object.keys(sub_dict).sort();
  const sums = keys.map(key => {
    const { c_ref, totals } = sub_dict[key];
    return { c_ref, totals };
  });
  if (sums.length > 0) {
    let cpath = path.resolve(path_root, 'c_days');
    fs.ensureDirSync(cpath);
    const fname = file_date + '.json';
    cpath = path.resolve(cpath, fname);
    fs.writeJsonSync(cpath, sums, { spaces: 2 });

    write_subs(sub_dict, file_date, path_root);
  } else {
    // report.log('write_daily empty', file_date, path_root);
  }
  return sums.length;
}

function write_meta(state_dir, { state_name, sub_dict, report_n_subs }) {
  // report.log('write_meta state_dir', state_dir);
  const key = 'c_ref';
  const c_dates = [];
  const days_path = path.resolve(state_dir, 'c_days');
  const summaryDict = {};
  if (!fs.existsSync(days_path)) {
    report.log('write_meta missing days_path ' + days_path);
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
      report.log('write_meta readJson failed ' + fpath);
    }
  }
  // Write out summary, remove last_date if current
  const ckeys = Object.keys(summaryDict).sort();
  const c_regions = ckeys.map(uname => {
    const ent = summaryDict[uname];
    if (ent.last_date === toDate) {
      delete ent.last_date;
    } else if (state_name) {
      report.log(state_name + '|' + uname + '| last_date ' + ent.last_date);
    }
    if (sub_dict) {
      const cent = sub_dict[uname];
      if (cent) {
        const n_subs = Object.keys(cent.states).length;
        if (n_subs) {
          ent.n_subs = n_subs;
          if (report_n_subs) {
            report.log(uname + '| n_subs ' + ent.n_subs);
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

  write_meta_subs(state_dir, { state_name, sub_dict, report_n_subs: 0 });

  return meta;
}

function write_meta_subs(path_root, { state_name, sub_dict, report_n_subs }) {
  // Write meta for states with in each country that has them
  const subs_path = path.resolve(path_root, 'c_subs');
  for (let country in sub_dict) {
    const cent = sub_dict[country];
    if (!cent.ncountry) {
      // report.log('skipping country', country);
      continue;
    }
    const state_dir = path.resolve(subs_path, cent.ncountry);
    // report.log('process_summary fpath', fpath);
    write_meta(state_dir, {
      state_name: (state_name ? state_name + ' ' : '') + cent.ncountry,
      sub_dict: cent.states,
      report_n_subs,
    });
  }
}

process_nyc();
