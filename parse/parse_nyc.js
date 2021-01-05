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
//  ./nyc-data/days
//      2020-12-04.csv
//

// dev:
// rm -rf ../dashboard/public/c_data/nyc/
// rm -rf ../parsed-data/c_data/nyc/
// build single day
// node parse_nyc --date 2020-12-03
// -- rebuild all days
// node parse_nyc --days

const parse = require('csv-parse/lib/sync');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs').argv;

const report = require('./report');
const cdata = require('./cdata');

// const nlimit = 5;
const nlimit = 0;
const argv_silent = argv.silent;
const argv_verbose = !argv_silent;
const argv_date = argv.date;
const argv_days = argv.days;

report.verbose(argv_verbose);
report.logFile('./report-nyc.txt');

const daily_file = '../nyc-data/repo/totals/data-by-modzcta.csv';

// const store_dir = '../dashboard/public/c_data/nyc/';
const store_dir = '../parsed-data/c_data/nyc/';

const csv_days_dir = '../nyc-data/days/';

const save_to_file = './data/data-by-modzcta.csv';

let from_date;
let to_date;

const start_time = Date.now();

function process_nyc() {
  let sub_dict;
  if (argv_days) {
    sub_dict = process_days();
  } else {
    // If no date is provided, use current date
    // 2020-12-06T06:31:38.404Z
    // 1234567890
    let filedate = argv_date;
    if (!filedate) filedate = new Date().toISOString().substring(0, 10);
    const doSave = 1;
    sub_dict = process_file_csv(daily_file, filedate, { doSave });
  }
  process_summary(sub_dict);

  report.flush();
}

function process_days() {
  const nfiles = fs.readdirSync(csv_days_dir);
  let index = 0;
  let sub_dict;
  for (let nfile of nfiles) {
    const fparse = path.parse(nfile);
    if (fparse.ext != '.csv') continue;
    const csv_path = path.resolve(csv_days_dir, nfile);
    sub_dict = process_file_csv(csv_path, fparse.name, {});
    index++;
    if (nlimit && index >= nlimit) break;
  }
  return sub_dict;
}

function process_summary(sub_dict) {
  const parse_time = Date.now() - start_time;
  report.log('parse sec ' + parse_time / 1000);
  report.log('-------------------------------------------');
  // Write meta for countries
  // console.log('process_summary to_date ' + to_date);
  cdata.write_meta(store_dir, {
    sub_dict,
    report_n_subs: 1,
    to_date,
    c_title: 'New York City',
    c_sub_titles: ['Borough', 'Zipcode'],
  });
  const lapse_time = Date.now() - start_time;
  report.log('-------------------------------------------');
  report.log('lapse sec ' + lapse_time / 1000);
}

function process_file_csv(csv_inpath, file_date, { doSave }) {
  // console.log('csv_inpath', csv_inpath, 'file_date', file_date);
  if (!to_date) to_date = file_date;
  if (!from_date) from_date = file_date;
  if (to_date < file_date) to_date = file_date;
  if (from_date > file_date) from_date = file_date;

  const sums_total = cdata.empty();
  const sub_dict = {};

  const strIn = fs.readFileSync(csv_inpath);
  // console.log('process_file_csv  strIn.length', strIn.length);

  if (doSave) {
    // Write out csv to csv_days_dir
    fs.ensureDirSync(csv_days_dir);
    const cpath = path.resolve(csv_days_dir, file_date + '.csv');
    const strOut = (strIn + '').replace(/\r\n/g, '\n');
    fs.writeFileSync(cpath, strOut);
    fs.writeFileSync(save_to_file, strOut);
  }

  const records = parse(strIn, {
    columns: true,
    skip_empty_lines: true,
  });
  records.forEach(process_item);

  function process_item(item, index) {
    rename_item(item);
    item.source_index = index;

    // console.log('process_item', item);
    if (!cdata.hasValue(item)) {
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
      //  { Cases: 0, Deaths: 0 };
      const totals = cdata.empty();
      cent = {
        c_ref: key1,
        totals,
        subs: {},
        c_sub_captions: {},
      };
      sub_dict[key1] = cent;
    }
    cdata.calc(cent.totals, item);
    cdata.calc(sums_total, item);

    let key2 = item.MODIFIED_ZCTA;
    if (key2) {
      let sent = cent.subs[key2];
      if (!sent) {
        const totals = cdata.empty();
        sent = {
          c_ref: key2,
          totals,
          subs: {},
        };
        cent.subs[key2] = sent;
        cent.c_sub_captions[key2] = item.NEIGHBORHOOD_NAME;
      }
      cdata.calc(sent.totals, item);
    }
  }

  cdata.write_daily(sub_dict, file_date, store_dir);

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

process_nyc();
