// Write log to console and report.txt file
//
const fs = require('fs-extra');

const report_lines = [];
let verbose;

function report_flush() {
  fs.writeFileSync('./report.txt', report_lines.join('\n'));
}

function report_log(aline) {
  report_lines.push(aline);
  if (verbose) console.log(aline);
}

function report_verbose(state) {
  verbose = state;
}

module.exports = {
  flush: report_flush,
  log: report_log,
  verbose: report_verbose,
};
