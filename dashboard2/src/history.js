import { createBrowserHistory } from 'history';

console.log('process.env.PUBLIC_URL', process.env.PUBLIC_URL);

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});
