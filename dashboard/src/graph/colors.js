const blueDark = '#003f5c';
const green = '#488f31';
const purple = '#665191';
const fuschia = '#a05195';
const pink = '#d45087';
const red = '#f95d6a';
const orange = '#ff7c43';
const yellow = '#ffa600';
const gray = '#80d0d0';

export const colors = [
  blueDark,
  green,
  purple,
  fuschia,
  pink,
  red,
  orange,
  yellow,
  gray,
];

// const lower_label = '▼'; // 'Less'; ▼

const assigned = [];

const prefered = {
  'United States': { color: blueDark, xval: 'United States' },
  China: { color: yellow, xval: 'China' },
  Jamaica: { color: pink, xval: 'Jamaica' },
  // [lower_label]: { color: blue, xval: lower_label },
};

export function colorfor(index) {
  return colors[index % colors.length];
}

// slices = [ { x, y, label } ... ]
//  { x: "US", y: 1069424, label: "US\n32.8%" }
export function orderColors_pie(slices) {
  // Select next to last to do swapping
  let clast = colors.length - 2;
  if (clast > slices.length - 1) clast = slices.length - 1;
  const cswap = clast;
  for (let index = 0; index < clast; index++) {
    const nitem = slices[index];
    const nxval = nitem.x;
    // console.log('index', index, 'nxval', nxval);
    let aitem = prefered[nxval];
    if (!aitem) {
      aitem = assigned.find((item) => item.xval === nxval);
    }
    const ocolor = colors[index];
    if (aitem) {
      if (aitem.color === ocolor) continue;
      const aindex = colors.findIndex((color) => color === aitem.color);
      colors[index] = aitem.color;
      colors[aindex] = ocolor;
    } else {
      // First look at this xval, take last color
      colors[index] = colors[cswap];
      colors[cswap] = ocolor;
    }
  }
  // console.log('clast', clast, slices[clast]);
  // console.log('clast+1', clast + 1, slices[clast + 1]);
  // { "x": "▼", "y": 140, "oy": 140, "label": "[135] ▼ 2.4%", "count": 135 }
  for (let index = 0; index <= clast; index++) {
    const color = colors[index];
    const item = slices[index];
    const xval = item.x;
    assigned[index] = { color, xval };
    item.color = color; // For export to p5js
  }
  // For export to p5js
  if (clast + 1 < slices.length) {
    const item = slices[clast + 1];
    item.color = colors[clast + 1];
  }
}
