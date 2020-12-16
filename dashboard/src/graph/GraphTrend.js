import React from 'react';
import { VictoryAxis, VictoryLabel, VictoryLine } from 'victory';

// class GraphTrend extends React.Component {
//   render(props) {
function GraphTrend(props) {
  console.log('GraphTrend props', props);
  const titles = props.titles;
  const data = props.data;
  const c_dates = props.c_dates;
  const data1 = data[0];
  const data2 = data[1];

  // const data1 = data[0].map((item, index) => {
  //   const y = item[propFocus] || 0;
  //   return { x: index, y };
  // });

  console.log('GraphTrend data1', data1);
  console.log('GraphTrend data2', data2);
  if (data1.length <= 0) return null;
  if (data2.length <= 0) return null;

  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let maxIndex = 0;
  for (let index = 0; index < data1.length; index++) {
    const item1 = data1[index];
    const item2 = data2[index];
    min = Math.min(min, item1.y, item2.y);
    if (max < item1.y) {
      maxIndex = index;
    }
    max = Math.max(max, item1.y, item2.y);
  }
  const ydomain = [min, max];
  const xdomain = [0, data1.length];
  console.log('GraphTrend ydomain', ydomain);
  console.log('GraphTrend xdomain', xdomain);
  console.log('maxIndex', maxIndex);
  console.log('c_dates[maxIndex]', c_dates[maxIndex]);

  const styles = getStyles();
  // const tickValues = getTickValues();

  return (
    // <svg style={styles.parent} viewBox="0 0 300 200">
    <svg style={styles.parent} viewBox="0 0 450 350">
      {/* <svg style={styles.parent} viewBox="0 0 400 300"> */}
      {/* Create stylistic elements */}
      {/* <rect x="0" y="0" width="10" height="30" fill="#f01616" />
        <rect x="420" y="10" width="20" height="20" fill="#458ca8" /> */}

      {/* Define labels */}
      {/* <VictoryLabel x={25} y={24} style={styles.title} text="An outlook" />
        <VictoryLabel x={430} y={20} style={styles.labelNumber} text="1" /> */}
      <VictoryLabel x={25} y={20} style={styles.labelOne} text={titles[0]} />
      {/* <VictoryLabel x={325} y={20} style={styles.labelTwo} text={titles[1]} /> */}
      <VictoryLabel x={425} y={20} style={styles.labelTwo} text={titles[1]} />

      <g transform={'translate(0, 40)'}>
        {/* <g> */}
        {/* Add shared independent axis */}
        {/* <VictoryAxis
          scale="time"
          standalone={false}
          style={styles.axisYears}
          tickValues={tickValues}
          tickFormat={(x) => {
            if (x.getFullYear() === 2000) {
              return x.getFullYear();
            }
            if (x.getFullYear() % 5 === 0) {
              return x.getFullYear().toString().slice(2);
            }
          }}
        /> */}
        {/*
            Add the dependent axis for the first data set.
            Note that all components plotted against this axis will have the same y domain
          */}
        {/* <VictoryAxis
          dependentAxis
          domain={[-10, 15]}
          offsetX={50}
          orientation="left"
          standalone={false}
          style={styles.axisOne}
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
        {/* <VictoryLine
          data={dataSetOne}
          domain={{
            x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
            y: [-10, 15],
          }}
          interpolation="monotoneX"
          scale={{ x: 'time', y: 'linear' }}
          standalone={false}
          style={styles.lineOne}
        /> */}
        {/*
            Add the dependent axis for the second data set.
            Note that all components plotted against this axis will have the same y domain
          */}
        {/* <VictoryAxis
          dependentAxis
          domain={[0, 50]}
          orientation="right"
          standalone={false}
          style={styles.axisTwo}
        /> */}
        {/* dataset two */}
        {/* <VictoryLine
          data={dataSetTwo}
          domain={{
            x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
            y: [0, 50],
          }}
          interpolation="monotoneX"
          scale={{ x: 'time', y: 'linear' }}
          standalone={false}
          style={styles.lineTwo}
        /> */}
      </g>
    </svg>
  );
}

function getStyles() {
  const BLUE_COLOR = '#00a3de';
  const RED_COLOR = '#7c270b';

  // console.log('GraphTrend getStyles this', this);

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
      ticks: { strokeWidth: 0 },
      tickLabels: {
        fill: BLUE_COLOR,
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
