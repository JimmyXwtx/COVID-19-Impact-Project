//
//
// import getCountryCode from '../js/getCountryCode';

// const upper_label = '▲'; // ('Greater'); ▲
// const lower_label = '▼'; // 'Less'; ▼

// Need two distinct labesl
const upper_label = '✱▲'; // ('Greater'); ▲
const lower_label = '✱▼'; // 'Less'; ▼

// const upper_label = '✱'; // ('Greater'); ▲
// const lower_label = '✱'; // 'Less'; ▼

function percentFormat(val, stats_total) {
  if (!stats_total) return '';
  let num = val / stats_total;
  // num = Math.round((val / stats_total) * 1000) / 10;
  let ndigits = 1;
  if (num < 0.01) ndigits = 3;
  return Number(num).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: ndigits,
    maximumFractionDigits: ndigits,
  });
}

function countFormat(val) {
  return Number(val).toLocaleString();
}

export default function extract_slices(
  items,
  spec,
  nslice,
  formatPercent,
  slideIndex
) {
  // console.log('extract_slices spec', spec);
  // console.log('extract_slices items[0]', items[0]);
  const sumFocus = spec.sumFocus;
  const yprop = spec.propFocus;
  let stats_total = 0;
  let other_stat = 0;
  let other_count = 0;
  let upper_stat = 0;
  let upper_count = 0;
  let slices = [];
  items.forEach((item, index) => {
    let yvalue = item[sumFocus][yprop];
    // if (yvalue < 0) {
    // !!@ 2020-08-17 United Kingdom -5,337
    // yvalue = 0;
    // }
    let nyvalue = yvalue < 0 ? 0 : yvalue;
    stats_total += nyvalue;
    if (index < slideIndex) {
      upper_stat += nyvalue;
      upper_count += 1;
    } else if (index < slideIndex + nslice) {
      const x = item.c_ref;
      const y = yvalue;
      const label = x + '\n' + countFormat(y);
      slices.push({ x, y, label });
    } else {
      other_stat += nyvalue;
      other_count += 1;
    }
  });
  if (upper_count > 0) {
    const x = upper_label;
    const y = upper_stat;
    // const label = '[' + upper_count + '] ' + x + '\n' + countFormat(y);
    const label = x + '\n' + countFormat(y);
    slices.splice(0, 0, {
      x,
      y: 0,
      oy: y,
      label,
      count: upper_count + other_count,
    });
  }
  if (other_count > 0) {
    const x = lower_label;
    const y = other_stat;
    // const label = '[' + other_count + '] ' + x + '\n' + countFormat(y);
    const label = x + '\n' + countFormat(y);
    slices.push({ x, y: y, label, count: upper_count + other_count });
  }
  if (formatPercent) {
    slices.forEach((item) => {
      let oy = item.oy;
      if (!oy) oy = item.y;
      // const shortc = getCountryCode(item.x);
      const str = percentFormat(oy, stats_total);
      if (item.x === lower_label || item.x === upper_label) {
        // item.label = '[' + item.count + '] ' + item.x + ' ' + str;
        // item.label = str + item.x + '[' + item.count + ']';
        item.label = item.x + ' ' + str;
      } else {
        // item.label = shortc + ' ' + str;
        // item.label = str + ' ' + shortc;
        item.label = str;
      }
    });
  }
  const ostats_total = stats_total;
  stats_total = Number(stats_total).toLocaleString();
  return {
    slices,
    stats_total,
    ostats_total,
    yprop,
    overFlow: slices.length < items.length,
  };
}
