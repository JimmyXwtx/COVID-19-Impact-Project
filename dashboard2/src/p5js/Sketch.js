//
// Adaped from https://github.com/Gherciu/react-p5
// react-p5 fails in react-script build
// load p5.min.js from cdnjs instead
//
import React, { useState, useRef, useEffect } from 'react';
import fetchScript from '../js/fetchScript';

const src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js';

const Sketch = (props) => {
  //
  const canvasParentRef = useRef(null);
  const [sketch, setSketch] = useState();

  useEffect(() => {
    if (!sketch) {
      fetchScript(src, (err) => {
        if (err || !window.p5) {
          if (err) {
            console.log('Sketch fetchScript failed! err', err, '', window.p5);
          }
          return;
        }
        setSketch(
          new window.p5((p5) => {
            p5.setup = () => {
              console.log('Sketch p5.setup', canvasParentRef.current);
              props.setup(p5, canvasParentRef.current);
            };
            const p5Events = [
              'draw',
              'windowResized',
              'preload',
              'mouseClicked',
              'doubleClicked',
              'mouseMoved',
              'mousePressed',
              'mouseWheel',
              'mouseDragged',
              'mouseReleased',
              'keyPressed',
              'keyReleased',
              'keyTyped',
              'touchStarted',
              'touchMoved',
              'touchEnded',
              'deviceMoved',
              'deviceTurned',
              'deviceShaken',
            ];
            p5Events.forEach((event) => {
              if (props[event]) {
                p5[event] = () => {
                  props[event](p5);
                };
              }
            });
            // Called to tear down
            return () => {
              console.log('Sketch remove sketch', sketch);
              if (sketch) {
                sketch.remove();
              }
            };
          })
        );
      });
    }
  }, [sketch, props]);

  // console.log('Sketch loaded', loaded, 'error', error);
  console.log('Sketch window.p5', !!window.p5);

  return (
    <div
      ref={canvasParentRef}
      className={props.className || 'react-p5'}
      style={props.style || {}}
    />
  );
};

export default Sketch;
