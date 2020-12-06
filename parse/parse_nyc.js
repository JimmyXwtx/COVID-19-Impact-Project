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

const daily_file = '../nyc-data/repo/totals/data-by-modzcta.csv';

const store_dir = '../dashboard/public/c_nyc/';

const stats_init = { Cases: 0, Deaths: 0 };

const start_time = Date.now();
const report_lines = [];

process_nyc();

function process_nyc() {
  // 2020-12-06T06:31:38.404Z
  // 1234567890
  //
  const today = new Date().toISOString().substring(0, 10);

  const country_dict = process_file_csv(daily_file, today);

  process_summary(country_dict);

  report_write();
}

function report_write() {
  fs.writeFileSync('./report.txt', report_lines.join('\n'));
}

function report_log(aline) {
  report_lines.push(aline);
  if (argv_verbose) console.log(aline);
}

function process_summary(country_dict) {
  const parse_time = Date.now() - start_time;
  report_log('parse sec ' + parse_time / 1000);
  report_log('-------------------------------------------');

  // Write meta for countries
  write_meta(store_dir, { country_dict, report_n_states: 1 });

  const lapse_time = Date.now() - start_time;
  report_log('-------------------------------------------');
  report_log('lapse sec ' + lapse_time / 1000);
}

function process_file_csv(csv_inpath, file_date) {
  const sums_total = Object.assign({}, stats_init);
  const country_dict = {};

  const input = fs.readFileSync(csv_inpath);
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;

    if (!hasValue(item)) {
      return;
    }

    const Country_Region = item.BOROUGH_GROUP;
    if (!Country_Region) {
      const str = JSON.stringify(item);
      report_log('!!@ empty Country_Region ' + file_date + ' ' + str);
      return;
    }

    let cent = country_dict[Country_Region];
    if (!cent) {
      // stats_init = { Cases: 0, Deaths: 0 };
      const totals = Object.assign({}, stats_init);
      // if (Country_Region === 'United States') report_log('pop_ent', pop_ent);
      cent = {
        c_ref: Country_Region,
        totals,
        pop_ent,
        states: {},
      };
      country_dict[Country_Region] = cent;
    }
    calc(cent.totals, item);
    calc(sums_total, item);

    let Province_State = item.MODIFIED_ZCTA;
    if (Province_State) {
      let sent = cent.states[Province_State];
      if (!sent) {
        const totals = Object.assign({}, stats_init);
        sent = {
          c_ref: Province_State,
          totals,
          states: {},
        };
        cent.states[Province_State] = sent;
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

  write_daily(country_dict, file_date, store_dir);

  return country_dict;
}

function write_subs(subs_dict, file_date, path_root) {
  for (let country in subs_dict) {
    const cent = subs_dict[country];
    // report_log('file_date', file_date, 'country', country, 'cent', cent);
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

function write_daily(country_dict, file_date, path_root) {
  const keys = Object.keys(country_dict).sort();
  const sums = keys.map(key => {
    const { c_ref, totals } = country_dict[key];
    return { c_ref, totals };
  });
  if (sums.length > 0) {
    let cpath = path.resolve(path_root, 'c_days');
    fs.ensureDirSync(cpath);
    const fname = file_date + '.json';
    cpath = path.resolve(cpath, fname);
    fs.writeJsonSync(cpath, sums, { spaces: 2 });

    write_subs(country_dict, file_date, path_root);
  } else {
    // report_log('write_daily empty', file_date, path_root);
  }
  return sums.length;
}

function write_meta(state_dir, { state_name, country_dict, report_n_states }) {
  // report_log('write_meta state_dir', state_dir);
  const key = 'c_ref';
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
      report_log('write_meta readJson failed ' + fpath);
    }
  }
  // Write out summary, remove last_date if current
  const ckeys = Object.keys(summaryDict).sort();
  const c_regions = ckeys.map(uname => {
    const ent = summaryDict[uname];
    if (ent.last_date === toDate) {
      delete ent.last_date;
    } else if (state_name) {
      report_log(state_name + '|' + uname + '| last_date ' + ent.last_date);
    }
    if (country_dict) {
      const cent = country_dict[uname];
      if (cent) {
        const n_states = Object.keys(cent.states).length;
        if (n_states) {
          ent.n_states = n_states;
          if (report_n_states) {
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

  write_meta_subs(state_dir, { state_name, country_dict, report_n_states: 0 });

  return meta;
}

function write_meta_subs(
  path_root,
  { state_name, country_dict, report_n_states }
) {
  // Write meta for states with in each country that has them
  const subs_path = path.resolve(path_root, 'c_subs');
  for (let country in country_dict) {
    const cent = country_dict[country];
    if (!cent.ncountry) {
      // report_log('skipping country', country);
      continue;
    }
    const state_dir = path.resolve(subs_path, cent.ncountry);
    // report_log('process_summary fpath', fpath);
    write_meta(state_dir, {
      state_name: (state_name ? state_name + ' ' : '') + cent.ncountry,
      country_dict: cent.states,
      report_n_states,
    });
  }
}

function dump(records, sums_total, sums, csv_inpath, outpath_country) {
  report_log('records[0] ' + records[0]);
  report_log('sums_total ' + sums_total);
  report_log('sums.length ' + sums.length);
  const ndump = 1;
  for (let index = 0; index < ndump; index++) {
    report_log('sums[' + index + '] ' + JSON.stringify(sums[index]));
  }
  report_log(csv_inpath);
  report_log(outpath_country + '\n');
}
