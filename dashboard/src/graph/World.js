import React from 'react';
import { VictoryBar, VictoryPie } from 'victory';
import { colorfor, colors, orderColors_pie } from './colors';
import material from './material';

// const x = item.c_ref;
// const y = item.Deaths;
// const label = x + '\n' + item.Deaths;
// pie_data.push({ x, y, label });

const World = ({ pie_data, opacity, stacked }) => {
  const pieslices = pie_data[0].slices;
  const barslices = pie_data[1].slices.concat().reverse();
  orderColors_pie(pieslices);
  // console.log('World barslices pie_data[1]', pie_data[1]);
  let other = '';
  if (barslices.length > 0 && pie_data[1].overFlow) {
    const ent = barslices[0];
    const label = ent.x.substring(0, 1);
    other =
      label + ' Total for the ' + ent.count + ' regions not shown on graph';
  }
  let style_parent = { parent: { maxWidth: '50%' } };
  if (stacked) style_parent = {};
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          opacity,
        }}
      >
        <VictoryPie
          style={{
            ...style_parent,
            pointerEvents: 'auto',
            touchAction: 'auto',
            userSelect: 'auto',
          }}
          colorScale={colors}
          theme={material}
          data={pieslices}
        />
        <VictoryBar
          horizontal
          style={{
            ...style_parent,
            pointerEvents: 'auto',
            touchAction: 'auto',
            userSelect: 'auto',
            data: {
              fill: ({ _x }) => colorfor(barslices.length - _x),
            },
          }}
          theme={material}
          data={barslices}
        />
        <p style={{ marginBottom: 8 }}>{other}</p>
      </div>
    </div>
  );
};

export default World;
