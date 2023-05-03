import { useState, useEffect } from 'react';

let cachedScripts = [];
let cachedScriptsDict = {};

function useScript(src, globalRef) {
  //
  // Keep track of script loading and error state
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });
  // console.log('useScript src', src, 'state', state);

  useEffect(() => {
    /**
     * If cachedScripts array already includes src that means another instance
     * of this hook already loaded this script.
     */
    // console.log('useScript useEffect cachedScripts', cachedScripts);

    if (cachedScripts.includes(src)) {
      setState({
        loaded: true,
        error: false,
      });
    } else {
      cachedScripts.push(src);

      // Create script
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      // Script event listener callbacks for load and error
      const onScriptLoad = () => {
        // console.log(
        //   'useScript onScriptLoad src',
        //   src,
        //   'g_meta_info',
        //   g_meta_info
        // );
        setState({ loaded: true, error: false });
        if (globalRef) cachedScriptsDict[src] = window[globalRef];
      };

      const onScriptError = () => {
        // Remove from cachedScripts and attempt reload
        const index = cachedScripts.indexOf(src);
        if (index >= 0) cachedScripts.splice(index, 1);
        script.remove();
        setState({ loaded: true, error: true });
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      // Remove event listeners on cleanup
      return () => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
  }, [src, globalRef]);

  return [state.loaded, state.error, cachedScriptsDict[src]];
}

// https://usehooks.com/useScript/
export default useScript;
