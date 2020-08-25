//
// Create world-population/pop2018.json
// from world-population/world-population.json
//

const fs = require('fs-extra');

const path = './world-population/world-population.json';
const outpath = './world-population/pop2018.json';

// "country_name": "Afghanistan",
// "value": 37172386.0,

const input = fs.readJsonSync(path);
const out = [];
input.forEach(item => {
  if (item.fields.year == '2018') {
    const country_name = item.fields.country_name;
    const population = item.fields.value;
    out.push({ country_name, population });
  }
});
out.sort((item1, item2) =>
  item1.country_name.localeCompare(item2.country_name)
);
fs.writeJsonSync(outpath, out, { spaces: 2 });
console.log('outpath', outpath);
console.log('out.length', out.length);

// https://datahub.io/core/population#resource-population_zip
// population_json.json
// "Country Code": "USA",
// "Country Name": "United States",
// "Value": 326687501.0,
// "Year": 2018

// https://data.opendatasoft.com/explore/dataset/world-population%40kapsarc/export/?disjunctive.country_name&rows=500&refine.year=2018
// world-population-2018.json
// "country_name": "United States",
// "value": 327167434.0,
// "year": "2018"
