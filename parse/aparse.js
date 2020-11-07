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
const argv_detail = argv.detail;
const argv_sort_deaths = argv.sort_deaths;

// const { rename_item, find_population } = require('./country');
const { rename_item } = require('./country');

const daily_dir =
  '../COVID-19-JHU/csse_covid_19_data/csse_covid_19_daily_reports/';
const store_dir = '../dashboard/public/cdata/';
const stats_init = { Cases: 0, Deaths: 0 };
let fromDate;
let toDate;

// fs.ensureDirSync(store_path_cdays);
// if (argv_detail) fs.ensureDirSync(store_path_uregion);
const start_time = Date.now();

process_dir();

function process_dir() {
  // process_init();
  const nfiles = fs.readdirSync(daily_dir);
  let index = 0;
  for (let nfile of nfiles) {
    const fparse = path.parse(nfile);
    if (fparse.ext != '.csv') continue;
    const cvs_path = path.resolve(daily_dir, nfile);
    process_cvs(cvs_path, fparse.name);
    index++;
    if (nlimit && index >= nlimit) break;
  }
  process_summary();
}

function process_summary() {
  console.log('Parsed fromDate=' + fromDate + ' toDate=' + toDate);
  const parse_time = Date.now() - start_time;
  console.log('parse sec', parse_time / 1000);

  write_summary(store_dir, 'Country_Region');

  const npath = path.resolve(store_dir, 'cstates');
  const dfiles = fs.readdirSync(npath);
  for (let dname of dfiles) {
    if (dname.substr(0, 1) === '.') continue;
    const fpath = path.resolve(npath, dname);
    // console.log('process_summary fpath', fpath);
    write_summary(fpath, 'Province_State', dname);
  }

  const lapse_time = Date.now() - start_time;
  console.log('lapse sec', lapse_time / 1000);
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
    let cpath = path.resolve(store_dir, 'cstates', ncountry);
    write_daily(ent, file_date, cpath);
  }
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
  let cpath = path.resolve(path_root, 'cdays');
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

function write_summary(root_path, key, dname) {
  const dates = [];
  const npath = path.resolve(root_path, 'cdays');
  const summaryDict = {};
  if (!fs.existsSync(npath)) {
    console.log('write_summary missing npath', npath);
    return;
  }
  let cdict = {};
  let prior_cdict;
  // file names are sorted to get prior stats
  const dfiles = fs.readdirSync(npath).sort();
  for (let dname of dfiles) {
    // eg. fname=2020-01-22.json
    if (!dname.endsWith('.json')) continue;
    const date = dname.substr(0, dname.length - 5);
    dates.push(date);
    const fpath = path.resolve(npath, dname);
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
      console.log('write_summary readJson failed', fpath);
    }
  }
  // Write out all dates seen
  const outpath_dates = path.resolve(root_path, 'cdates.json');
  fs.writeJsonSync(outpath_dates, dates, { spaces: 2 });

  // Write out summary, remove last_date if current
  const ckeys = Object.keys(summaryDict).sort();
  const csummary = ckeys.map(uname => {
    const ent = summaryDict[uname];
    if (ent.last_date === toDate) {
      delete ent.last_date;
    } else if (dname) {
      console.log(dname + '|' + uname + '|', 'last_date', ent.last_date);
    }
    return ent;
  });
  const outpath_names = path.resolve(root_path, 'cfirst.json');
  fs.writeJsonSync(outpath_names, csummary, { spaces: 2 });
}
