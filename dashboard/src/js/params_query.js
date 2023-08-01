// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

let params;

function params_query(query) {
  // eg. query='abc=foo&def=%5Basf%5D&xyz=5'
  console.log('params_query query', query);
  // params={abc: "foo", def: "[asf]", xyz: "5"}
  const urlParams = new URLSearchParams(query);
  const params = Object.fromEntries(urlParams);
  return params;
}

export default function query(param) {
  if (!params) {
    params = {};
    let q = window.location.search;
    if (q) {
      params = params_query(q.substring(1));
    }
  }
  return params[param];
}
