import React from 'react';
import { VictoryAxis, VictoryLabel, VictoryLine } from 'victory';

// class GraphTrend extends React.Component {
//   render(props) {
function GraphTrend(props) {
  // console.log('GraphTrend props', props);
  const titles = props.titles;
  const data = props.data;
  const c_dates = props.c_dates;
  const data1 = data[0];
  const data2 = data[1];

  // console.log('GraphTrend c_dates', c_dates);
  // console.log('GraphTrend data1', data1);
  // console.log('GraphTrend data2', data2);
  if (data1.length <= 0) return null;
  if (data2.length <= 0) return null;

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  // let maxIndex = 0;
  for (let index = 0; index < data1.length; index++) {
    const item1 = data1[index];
    const item2 = data2[index];
    min = Math.min(min, item1.y, item2.y);
    // if (max < item1.y) {
    //   maxIndex = index;
    // }
    max = Math.max(max, item1.y, item2.y);
  }
  const ydomain = [min, max];
  const xdomain = [0, data1.length];
  // console.log('GraphTrend ydomain', ydomain);
  // console.log('GraphTrend xdomain', xdomain);
  // console.log('maxIndex', maxIndex);
  // console.log('c_dates[maxIndex]', c_dates[maxIndex]);

  const styles = getStyles();
  // const tickValues = getTickValues();
  // const yearLabel = '2020-xx-xx to 2020-xx-xx';
  const yearLabel = c_dates[0] + ' to ' + c_dates[c_dates.length - 1];

  return (
    // <svg style={styles.parent} viewBox="0 0 300 200">
    <svg style={styles.parent} viewBox="0 0 450 350">
      {/* <svg style={styles.parent} viewBox="0 0 400 300"> */}

      {/* Define labels */}
      <VictoryLabel x={25} y={20} style={styles.labelOne} text={titles[0]} />
      <VictoryLabel x={425} y={20} style={styles.labelTwo} text={titles[1]} />
      <VictoryLabel x={50} y={320} text={yearLabel} />

      <g transform={'translate(0, 40)'}>
        {/* <g> */}
        {/* Add shared independent axis */}
        {/* <VictoryAxis
          scale="time"
          standalone={false}
          style={styles_axisYears()}
          tickValues={getTickValues(c_dates)}
          tickFormat={(x) => {
            return c_dates[0];
            // if (x === c_dates[0]) return x;
            // else return '';
          }}
        /> */}
        {/*
            Add the dependent axis for the first data set.
            Note that all components plotted against this axis will have the same y domain
          */}
        /> */}
        <VictoryAxis
          dependentAxis
          domain={ydomain}
          offsetX={50}
          orientation="left"
          standalone={false}
          style={styles.axisOne}
        />
        {/* dataset data1 */}
        <VictoryLine
          data={data1}
          domain={{
            x: xdomain,
            y: ydomain,
          }}
          standalone={false}
          style={styles.lineOne}
        />
        {/* dataset data2 */}
        <VictoryLine
          data={data2}
          domain={{
            x: xdomain,
            y: ydomain,
          }}
          standalone={false}
          style={styles.lineTwo}
        />
      </g>
    </svg>
  );
}

// function getTickValues(c_dates) {
//   return [0];
//   // return c_dates.map((item, index) => c_dates[index]);
// }

// function styles_axisYears() {
//   return {
//     axis: { stroke: 'black', strokeWidth: 1 },
//     ticks: {
//       size: ({ tick }) => {
//         // const tickSize = tick.getFullYear() % 5 === 0 ? 10 : 5;
//         const tickSize = 5;
//         return tickSize;
//       },
//       stroke: 'black',
//       strokeWidth: 1,
//     },
//     tickLabels: {
//       fill: 'black',
//       fontFamily: 'inherit',
//       fontSize: 16,
//     },
//   };
// }

function getStyles() {
  const BLUE_COLOR = '#00a3de';
  const RED_COLOR = '#7c270b';
  return {
    parent: {
      background: '#ccdee8',
      boxSizing: 'border-box',
      display: 'inline',
      padding: 0,
      fontFamily: "'Fira Sans', sans-serif",
    },
    title: {
      textAnchor: 'start',
      verticalAnchor: 'end',
      fill: '#000000',
      fontFamily: 'inherit',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    labelNumber: {
      textAnchor: 'middle',
      fill: '#ffffff',
      fontFamily: 'inherit',
      fontSize: '14px',
    },

    // INDEPENDENT AXIS
    axisYears: {
      axis: { stroke: 'black', strokeWidth: 1 },
      ticks: {
        size: ({ tick }) => {
          const tickSize = tick.getFullYear() % 5 === 0 ? 10 : 5;
          return tickSize;
        },
        stroke: 'black',
        strokeWidth: 1,
      },
      tickLabels: {
        fill: 'black',
        fontFamily: 'inherit',
        fontSize: 16,
      },
    },

    // DATA SET ONE
    axisOne: {
      grid: {
        stroke: ({ tick }) => (tick === -10 ? 'transparent' : '#ffffff'),
        strokeWidth: 2,
      },
      axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
      // axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
      ticks: { strokeWidth: 0 },
      tickLabels: {
        // fill: BLUE_COLOR,
        fill: 'black',
        fontFamily: 'inherit',
        fontSize: 6,
      },
    },
    labelOne: {
      fill: BLUE_COLOR,
      fontFamily: 'inherit',
      fontSize: 12,
      fontStyle: 'italic',
    },
    lineOne: {
      data: { stroke: BLUE_COLOR, strokeWidth: 1 },
      // data: { stroke: BLUE_COLOR, strokeWidth: 4.5 },
    },
    axisOneCustomLabel: {
      fill: BLUE_COLOR,
      fontFamily: 'inherit',
      fontWeight: 300,
      fontSize: 21,
    },

    // DATA SET TWO
    axisTwo: {
      axis: { stroke: RED_COLOR, strokeWidth: 0 },
      tickLabels: {
        fill: RED_COLOR,
        fontFamily: 'inherit',
        fontSize: 16,
      },
    },
    labelTwo: {
      textAnchor: 'end',
      fill: RED_COLOR,
      fontFamily: 'inherit',
      fontSize: 12,
      fontStyle: 'italic',
    },
    lineTwo: {
      data: { stroke: RED_COLOR, strokeWidth: 1 },
      // data: { stroke: RED_COLOR, strokeWidth: 4.5 },
    },

    // HORIZONTAL LINE
    lineThree: {
      data: { stroke: '#e95f46', strokeWidth: 2 },
    },
  };
}

export default GraphTrend;

// https://formidable.com/open-source/victory/guides/custom-charts
