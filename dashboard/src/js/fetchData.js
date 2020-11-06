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
  dpath = window.location.href + '/' + dpath;
  fetch(dpath)
    .then((response) => {
      // console.log('response', response);
      return response.json();
    })
    .then(
      (data) => {
        // console.log('dpath', dpath, 'data', data);
        dataFunc(data);
      },
      // Note 1
      (error) => {
        console.error('fetchData dpath', dpath, 'Error:', error);
        dataFunc([]);
      }
    );
  // .catch((error) => {
  //   console.error('fetchData dpath', dpath, 'Error:', error);
  // });
}
