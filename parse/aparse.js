//
// COVID stats parse from csv to json
//
/* eslint-disable max-len */
//

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const silent = argv.silent;
const argv_detail = argv.detail;

// const { rename_item, find_population } = require('./country');
const { rename_item } = require('./country');

const daily_dir =
  '../COVID-19-JHU/csse_covid_19_data/csse_covid_19_daily_reports/';
const store_dir = '../dashboard/public/stats/';
const store_path_country = path.resolve(store_dir, 'cdaily');
const store_path_detail = path.resolve(store_dir, 'uregion');
const stats_init = { Cases: 0, Deaths: 0, Recovered: 0 };
let fromDate;
let toDate;

fs.ensureDirSync(store_path_country);
if (argv_detail) fs.ensureDirSync(store_path_detail);

process_dir();

function process_dir() {
  process_init();
  const nfiles = fs.readdirSync(daily_dir);
  for (let nfile of nfiles) {
    const fparse = path.parse(nfile);
    if (fparse.ext != '.csv') continue;
    const cvs_path = path.resolve(daily_dir, nfile);
    process_cvs(cvs_path, fparse.name);
  }
  process_summary();
}

function process_summary() {
  console.log('Parsed fromDate=' + fromDate + ' toDate=' + toDate);
  write_summary();
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

  const fname = file_date + '.json';
  const outpath_country = path.resolve(store_path_country, fname);
  const outpath_detail = path.resolve(store_path_detail, fname);

  const sums_country = {};
  const sums_total = Object.assign({}, stats_init);

  const input = fs.readFileSync(cvs_inpath);
  const records = parse(input, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;
    let stats = sums_country[item.Country_Region];
    if (!stats) {
      stats = Object.assign({}, stats_init);
      const Country_Region = item.Country_Region;
      sums_country[Country_Region] = { Country_Region, totals: stats };
      // console.log('process_item silent', silent);
      // stats.population = find_population(item, silent);
    } else {
      stats = stats.totals;
    }
    calc(stats, item);
    calc(sums_total, item);
  }
  if (!silent) {
    console.log('records[0]', records[0]);
    console.log('sums_total', sums_total);
  }

  const sums = Object.values(sums_country);
  sums.sort((item1, item2) => item2.totals.Deaths - item1.totals.Deaths);
  if (!silent) {
    console.log('sums.length', sums.length);
    const ndump = 1;
    for (let index = 0; index < ndump; index++) {
      console.log('sums[' + index + ']', JSON.stringify(sums[index]));
    }
    console.log(cvs_inpath);
    console.log(outpath_country, '\n');
  }

  fs.writeJsonSync(outpath_country, sums, { spaces: 2 });
  if (argv_detail) {
    fs.writeJsonSync(outpath_detail, records, { spaces: 2 });
  }
}

function process_init() {}

function calc(sums, item) {
  for (let prop in stats_init) {
    let val = item[prop];
    if (!val) val = 0;
    sums[prop] += parseInt(val);
  }
}

function write_summary() {
  const dates = [];
  const npath = path.resolve(store_dir, 'cdaily');
  const summaryDict = {};
  if (fs.existsSync(npath)) {
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
          const { Country_Region } = citem;
          cdict[Country_Region] = citem;
          let ent = summaryDict[Country_Region];
          if (!ent) {
            ent = { Country_Region, first_date: {} };
            summaryDict[Country_Region] = ent;
          }
          let { Cases, Deaths } = citem.totals;
          if (Cases && !ent.first_date.Cases) {
            ent.first_date.Cases = date;
          }
          if (Deaths && !ent.first_date.Deaths) {
            ent.first_date.Deaths = date;
          }
          // Daily is difference between now and prior
          const cprior = prior_cdict[Country_Region];
          if (cprior) {
            Cases -= cprior.totals.Cases;
            Deaths -= cprior.totals.Deaths;
          }
          citem.daily = { Cases, Deaths };
        });
        // Write out updated daily
        fs.writeJsonSync(fpath, fitem, { spaces: 2 });
      } else {
        console.log('write_summary readJson failed', fpath);
      }
    }
  } else {
    console.log('write_summary missing npath=' + npath);
  }

  const outpath_dates = path.resolve(store_dir, 'cdates.json');
  fs.writeJsonSync(outpath_dates, dates, { spaces: 2 });

  const ckeys = Object.keys(summaryDict).sort();
  const csum = ckeys.map(uname => summaryDict[uname]);
  const outpath_names = path.resolve(store_dir, 'cfirst.json');
  fs.writeJsonSync(outpath_names, csum, { spaces: 2 });
}
