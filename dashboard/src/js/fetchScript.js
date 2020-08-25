//
let cachedScripts = [];
// let cachedScriptsDict = {};

export default function fetchScript(src, doneFunc) {
  //
  // If cachedScripts array already includes src that means another instance
  // already loaded this script.
  //
  if (cachedScripts.includes(src)) {
    doneFunc(0);
    return;
  } else {
    cachedScripts.push(src);

    // Create script
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Script event listener callbacks for load and error
    const onScriptLoad = () => {
      doneFunc(0);
    };

    const onScriptError = (event) => {
      // Remove from cachedScripts
      console.log('fetchScript onScriptError event', event);
      const index = cachedScripts.indexOf(src);
      if (index >= 0) cachedScripts.splice(index, 1);
      script.remove();
      doneFunc(event.message || 1);
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.body.appendChild(script);

    // Remove event listeners on cleanup
    // return () => {
    //   script.removeEventListener('load', onScriptLoad);
    //   script.removeEventListener('error', onScriptError);
    // };
  }
}
