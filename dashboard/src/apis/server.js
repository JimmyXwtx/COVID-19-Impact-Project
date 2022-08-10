import axios from 'axios';

const hostname = window && window.location && window.location.hostname;
// console.log('hostname', hostname);
let baseURL = '';
if (!hostname || hostname === 'localhost') {
  // apiBaseUrl = 'http://localhost:3000';
  baseURL = 'http://localhost:3002';
} else {
  baseURL = 'https://covid19-impact.net/covid19-express';
}

export default axios.create({ baseURL });
