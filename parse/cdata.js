// write operations for c_data json

const fs = require('fs-extra');
const path = require('path');

const report = require('./report');

const stats_init = { Cases: 0, Deaths: 0 };

// Write json to c_days and to any sub divisions
//
function write_daily(sub_dict, file_date, path_root) {
  // console.log(
  //   'write_daily sub_dict:' +
  //     sub_dict +
  //     ' file_date:' +
  //     file_date +
  //     ' path_root:' +
  //     path_root
  // );
  // console.log('sub_dict:' + JSON.stringify(sub_dict, null, 2));
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

function write_subs(sub_dict, file_date, path_root) {
  // console.log(
  //   'write_subs sub_dict:' +
  //     sub_dict +
  //     ' file_date:' +
  //     file_date +
  //     ' path_root:' +
  //     path_root
  // );
  for (let sub in sub_dict) {
    const cent = sub_dict[sub];
    // report.log('write_subs file_date', file_date, 'sub', sub, 'cent', cent);
    const nsubs = fileNameForSub(sub);
    cent.nsubs = nsubs;
    let cpath = path.resolve(path_root, 'c_subs', nsubs);
    const some = write_daily(cent.subs, file_date, cpath);
    if (!some) {
      delete cent.nsubs;
    }
  }
}

function fileNameForSub(nsub) {
  return nsub.replace(/ /g, '_').replace(/,/g, '');
}

// Write jons to c_meta.json and any sub divisions
//
function write_meta(
  sub_dir,
  {
    sub_label,
    sub_dict,
    report_n_subs,
    to_date,
    c_title,
    c_sub_titles,
    c_sub_captions,
  }
) {
  // report.log('write_meta sub_dir ' + sub_dir);
  // console.log('write_meta to_date ', to_date, 'sub_dict', sub_dict);
  const c_dates = [];
  const days_path = path.resolve(sub_dir, 'c_days');
  const summaryDict = {};
  if (!fs.existsSync(days_path)) {
    report.log('write_meta missing days_path ' + days_path);
    return null;
  }
  let c_series = {};
  // c_series[c_ref] --> "United States": {
  //      '2020-02-28': { "Cases": 1,  "Deaths": 0 }
  //      ,,,
  //      '2020-12-14': { "Cases": 9999,  "Deaths": 999 }
  //
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
        const c_ref = citem.c_ref;
        let sitem = c_series[c_ref];
        if (!sitem) {
          sitem = {};
          c_series[c_ref] = sitem;
        }
        sitem[date] = citem.totals;
        cdict[c_ref] = citem;
        let ent = summaryDict[c_ref];
        if (!ent) {
          ent = { c_ref: c_ref, c_first: {} };
          // ent[key] = c_ref;
          // ent.c_first = {};
          summaryDict[c_ref] = ent;
        }
        let { Cases, Deaths } = citem.totals;
        if (Cases && !ent.c_first.Cases) {
          ent.c_first.Cases = date;
        }
        if (Deaths && !ent.c_first.Deaths) {
          ent.c_first.Deaths = date;
        }
        // Daily is difference between now and prior
        const cprior = prior_cdict[c_ref];
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
    if (ent.last_date === to_date) {
      delete ent.last_date;
    } else if (sub_label) {
      report.log(sub_label + '|' + uname + '| last_date ' + ent.last_date);
    }
    if (sub_dict) {
      const cent = sub_dict[uname];
      if (cent) {
        const n_subs = Object.keys(cent.subs).length;
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
  const outpath_meta = path.resolve(sub_dir, 'c_meta.json');

  const c_sub_title = c_sub_titles.length > 0 ? c_sub_titles[0] : undefined;

  // console.log('sub_dir', sub_dir);
  // console.log('c_series', JSON.stringify(c_series, null, 2));
  write_cseries_sub(sub_dir, sub_dict, c_dates, c_series);

  // console.log(
  //   'write_meta sub_dict',
  //   sub_dict,
  //   'c_sub_captions',
  //   c_sub_captions
  // );

  const meta = { c_title, c_sub_title, c_sub_captions, c_regions, c_dates };
  fs.writeJsonSync(outpath_meta, meta, { spaces: 2 });

  c_sub_titles = c_sub_titles.slice(1);

  write_meta_subs(sub_dir, {
    sub_label,
    sub_dict,
    report_n_subs: 0,
    to_date,
    c_sub_titles,
  });

  return meta;
}

// Write out stats as date series eg.
// date stat entries are in same order as c_dates
// c_data/world/c_subs/United_States/c_series.json
//  [ {
//    { "Cases": 1,  "Deaths": 0 },
//    ...
//    { "Cases": 9999,  "Deaths": 99 }
//  } ]
//
function write_cseries_sub(sub_dir, sub_dict, c_dates, c_series) {
  // console.log('write_cseries_sub sub_dir', sub_dir);
  // const keys = Object.keys(c_series).sort();
  // console.log('c_series keys', keys);
  const cpath = path.resolve(sub_dir, 'c_subs');
  for (let sub_name in sub_dict) {
    const cent = sub_dict[sub_name];
    if (!cent.nsubs) {
      // console.log('write_cseries_sub skipping sub_name ' + sub_name);
      continue;
    }
    let spath = path.resolve(cpath, cent.nsubs);
    fs.ensureDirSync(spath);
    spath = path.resolve(spath, 'c_series.json');
    const dent = c_series[sub_name];
    if (!dent) {
      console.log('!!@ write_cseries_sub missing sub_name ' + sub_name);
      continue;
    }
    const dates = [];
    for (const adate of c_dates) {
      let ent = dent[adate];
      if (!ent) ent = {};
      dates.push(ent);
    }
    // fs.writeJsonSync(spath, dates, { spaces: 2 });
    // stats by dates no spaces
    fs.writeJsonSync(spath, dates);
  }
}

function write_meta_subs(
  path_root,
  { sub_label, sub_dict, report_n_subs, to_date, c_sub_titles }
) {
  // Write meta for states with in each country that has them
  const subs_path = path.resolve(path_root, 'c_subs');
  for (let country in sub_dict) {
    const cent = sub_dict[country];
    if (!cent.nsubs) {
      // report.log('skipping country', country);
      continue;
    }
    const sub_dir = path.resolve(subs_path, cent.nsubs);
    // report.log('process_summary fpath', fpath);
    write_meta(sub_dir, {
      sub_label: (sub_label ? sub_label + ' ' : '') + cent.nsubs,
      sub_dict: cent.subs,
      report_n_subs,
      to_date,
      c_sub_titles,
      c_sub_captions: cent.c_sub_captions,
    });
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

function empty() {
  return Object.assign({}, stats_init);
}

module.exports = {
  write_daily,
  write_meta,
  hasValue,
  calc,
  empty,
};
