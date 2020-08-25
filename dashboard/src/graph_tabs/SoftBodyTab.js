import React, { useRef } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import useLocalStorage from '../hooks/useLocalStorage';
// import Sketch from '../../node_modules/react-p5';
// import Sketch from '../react-p5';
import Sketch from '../p5js/Sketch.js';
import SoftBody from './SoftBody';

// Adapted from
// https://p5js.org/examples/simulate-soft-body.html

const fullWindowStyle = {
  zIndex: 10,
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};
const init_height = 400;
const split_ratio = 1 / Math.sqrt(2);
const smallnum = 0.5;
const nnodes = 50;
const filled = 1;
const min_radius = 5 * 2;
const ui = { min_radius, smallnum, split_ratio };

const SoftBodyTab = (props) => {
  // console.log('SoftBodyTab render props=', props);
  const { pie_data } = props;
  const [softView, setSoftView] = useLocalStorage('key-view', 'div');
  const [split, setSplit] = useLocalStorage('key-split', false);

  const p5Ref = useRef();

  if (p5Ref.current) {
    p5Ref.current.soft_bods = null;
    p5Ref.current.soft_pie_data = pie_data;
    p5Ref.current.soft_split = split;
    if (softView === 'window') {
      p5Ref.current.soft_rect.height = window.innerHeight;
    } else {
      p5Ref.current.soft_rect.height = init_height;
    }
    p5Ref.current.soft_rmax = p5Ref.current.soft_rect.height;
  }

  const setup = (p5, canvasParentRef) => {
    // const elem = document.getElementById('softbody_div');
    // const rect = elem.getBoundingClientRect();
    // console.log('softbody_div rect', rect);
    const { innerWidth, innerHeight } = window;
    p5.soft_rect = {};
    p5.soft_rect.width = innerWidth;
    p5.soft_rect.height = init_height;
    p5.soft_rect.top = 0;
    p5.soft_rect.left = 0;
    p5.createCanvas(innerWidth, innerHeight).parent(canvasParentRef);
    // use parent to render canvas in this ref
    // (without that p5 render this canvas outside your component)
    p5.noStroke();
    p5.frameRate(30);
    p5.soft_rmax = init_height;
    p5Ref.current = p5;
  };

  const draw = (p5) => {
    // NOTE: Do not use setState in draw function
    // or in functions that is executed in draw function...
    // pls use normal variables or class properties for this purposes
    let nbods = p5.soft_bods;
    if (!nbods) {
      // nbods = init_bods(p5, pieRef.current);
      if (p5.soft_pie_data) {
        nbods = init_bods(p5, p5.soft_pie_data);
      } else {
        nbods = [];
      }
    }
    if (filled) {
      // p5.fill(210, 255);
      // p5.rect(0, 0, p5.width, p5.height);
      p5.clear();
    }
    const split_bods = [];
    nbods.forEach((bod) => {
      bod.drawShape(p5);
      bod.moveShape(p5);
      if (p5.soft_split) {
        bod.checkSplit(p5, split_bods);
      }
    });
    if (split_bods.length > 0) {
      // console.log('split_bods.length', split_bods.length);
      nbods = nbods.concat(split_bods);
    }
    if (nbods !== p5.soft_bods) {
      p5.soft_bods = nbods;
    }
  };

  const init_bods = (p5, pie_data) => {
    console.log('SoftBodyTab init_bods pie_data', pie_data);
    // console.log('SoftBodyTab init_bods p5', p5);
    const nbods = [];
    const specs = make_specs(p5, pie_data);
    specs.forEach((spec) => nbods.push(new SoftBody(p5, ui, spec)));
    return nbods;
  };

  const make_specs = (p5, pie_data) => {
    const total = pie_data.ostats_total;
    const specs = pie_data.slices.map((item) => {
      const fill_color = item.color + 'D0';
      const radius = p5.soft_rmax * (item.y / total);
      // const nnodes = nnodes;
      return { fill_color, nnodes, radius };
    });
    return specs;
  };

  const selectWindow = () => {
    if (softView === 'window') setSoftView('div');
    else setSoftView('window');
  };

  const selectSplit = () => {
    setSplit(!split);
  };

  return (
    <StyledDiv>
      <div id="softbody_div">
        <p>Example of using p5js to visualize data.</p>
        <blockquote>
          "&hellip;p5.js is a JavaScript library for creative coding, with a
          focus on making coding accessible and inclusive for artists,
          designers, educators, beginners &hellip;"
        </blockquote>
        <p>
          <a
            href="https://p5js.org/examples/simulate-soft-body.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://p5js.org/examples/simulate-soft-body.html
          </a>
        </p>
        <Grid>
          <Grid.Row style={{ paddingLeft: 16 }}>
            <Button
              size="mini"
              onClick={selectWindow}
              active={softView === 'window'}
            >
              Fill
            </Button>
            <Button size="mini" onClick={selectSplit} active={split}>
              Split
            </Button>
          </Grid.Row>
        </Grid>
        <div style={fullWindowStyle}>
          <Sketch setup={setup} draw={draw} />
        </div>
      </div>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  max-width: 75ch;
  padding: 1.5rem;

  blockquote {
    font-style: italic;
    color: dark-gray;
    margin-left: 0;
    margin-right: 0;
  }
`;

export default SoftBodyTab;
