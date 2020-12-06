// write operations for c_data json

const fs = require('fs-extra');
const path = require('path');

const report = require('./report');

// Write json to c_days and to any sub divisions
//
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

function write_subs(subs_dict, file_date, path_root) {
  for (let sub in subs_dict) {
    const cent = subs_dict[sub];
    // report.log('file_date', file_date, 'sub', sub, 'cent', cent);
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
function write_meta(sub_dir, { sub_label, sub_dict, report_n_subs, to_date }) {
  // report.log('write_meta sub_dir ' + sub_dir);
  // report.log('write_meta to_date ' + to_date);
  const c_dates = [];
  const days_path = path.resolve(sub_dir, 'c_days');
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
        const c_ref = citem.c_ref;
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
  const meta = { c_regions, c_dates };
  fs.writeJsonSync(outpath_meta, meta, { spaces: 2 });

  write_meta_subs(sub_dir, { sub_label, sub_dict, report_n_subs: 0, to_date });

  return meta;
}

function write_meta_subs(
  path_root,
  { sub_label, sub_dict, report_n_subs, to_date }
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
    });
  }
}

function hasValue(item, stats_init) {
  let sum = 0;
  for (let prop in stats_init) {
    let val = item[prop];
    if (!val) val = 0;
    sum += parseFloat(val);
  }
  return sum;
}
function calc(sums, item, stats_init) {
  for (let prop in stats_init) {
    let val = item[prop];
    if (!val) val = 0;
    sums[prop] += parseFloat(val);
  }
}

module.exports = {
  write_daily,
  write_meta,
  hasValue,
  calc,
};
