/* eslint no-param-reassign: 0 */
import http from 'http';
import request from 'request';
import config from '../config';
import debug from 'debug';

const log = debug('app');
const { oldApiEndpoint, newApiEndpoint } = config;

const server = http.createServer((req, res) => {
  //   // TODO: add X-Forwarded-For headers etc.
  //   // TODO: forward to old api
  //   // TODO: return old response
  //   // TODO: forward to new API
  log('##### request', oldApiEndpoint, newApiEndpoint, req.url);
  req.pipe(request(oldApiEndpoint + req.url)).pipe(res);
  req.pipe(request(newApiEndpoint + req.url));
});

const port = process.env.PORT || 3000;
log(`Listening on ${port}`);
server.listen(port);
