//
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import { useEffect, useRef } from 'react';

let lastTime;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const now = Date.now();
      const diff = now - lastTime;
      lastTime = now;
      console.log('in useInterval tick delay', delay, 'diff', diff);
      savedCallback.current();
    }
    if (delay !== null) {
      lastTime = Date.now();
      const id = setInterval(tick, delay);
      return () => {
        console.log('in useInterval clearInterval id', id);
        clearInterval(id);
      };
    }
  }, [delay]);

  // if (delay) {
  //   console.log(
  //     'in useInterval lastTime',
  //     Date.now() - (lastTime || Date.now()),
  //     'delay',
  //     delay
  //   );
  // }
}

export default useInterval;
