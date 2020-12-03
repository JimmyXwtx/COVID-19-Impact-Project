// https://reedbarger.com/how-to-create-a-usewindowsize-react-hook/

import React from 'react';

export default function useWindowSize() {
  const isSSR = typeof window === 'undefined';
  const [windowSize, setWindowSize] = React.useState({
    width: isSSR ? 1024 : window.innerWidth,
    height: isSSR ? 768 : window.innerHeight,
  });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  // console.log('useWindowSize isSSR', isSSR);
  // console.log('useWindowSize windowSize', windowSize);

  return windowSize;
}
