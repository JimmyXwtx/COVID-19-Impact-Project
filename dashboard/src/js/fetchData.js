//

// https://reactjs.org/docs/faq-ajax.html
// Note 1: it's important to handle errors here
// instead of a catch() block so that we don't swallow
// exceptions from actual bugs in components.

export default function fetchData(dpath, dataFunc) {
  // return;
  // console.log('fetchData dpath', dpath);
  // console.log('loc', window.location.href);
  // Need to get paths to work on server
  // Added slash after audit fixes
  const fpath = window.location.href + '/' + dpath;
  const start_time = Date.now();
  fetch(fpath)
    .then((response) => {
      // console.log('response', response);
      return response.json();
    })
    .then(
      (data) => {
        // console.log('dpath', dpath, 'data', data);
        const lapse = Date.now() - start_time;
        console.log('fetchData dpath', dpath, 'secs', lapse / 1000);
        dataFunc(data);
      },
      // Note 1
      (error) => {
        console.error('fetchData dpath', dpath, 'Error:', error);
        dataFunc(null);
      }
    );
  // .catch((error) => {
  //   console.error('fetchData dpath', dpath, 'Error:', error);
  // });
}
