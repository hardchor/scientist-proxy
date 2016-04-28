/* eslint no-param-reassign: 0 */
import http from 'http';
import request from 'request';
import config from '../config';
import debug from 'debug';
import RightStream from './RightStream';

const log = debug('app');
const { oldApiEndpoint, newApiEndpoint } = config;

const server = http.createServer((req, res) => {
  const right = new RightStream();
  // const left = new LeftStream();

  //   // TODO: add X-Forwarded-For headers etc.
  //   // TODO: forward to old api
  //   // TODO: return old response
  //   // TODO: forward to new API
  // left
  req
    .pipe(request(oldApiEndpoint + req.url))
    .on('response', (response) => {
      // response is a https://nodejs.org/api/http.html#http_class_http_incomingmessage
      log(`Status code: ${response.statusCode}`);
      log('Headers:', response.headers);

      response.on('data', (chunk) => {
        log('Data', chunk.toString());
      });
      response.on('end', () => {
        log('There will be no more data.');
      });
    })
    .on('error', (err) => {
      log(err);
    })
    // .pipe(right)
    .pipe(res)
  ;

  // right
  // req
  //   .pipe(request(newApiEndpoint + req.url))
  //   .pipe(right)
  // ;
});

const port = process.env.PORT || 3000;
log(`Listening on ${port}`);
server.listen(port);

// gracefull shut down
function shutdown() {
  log('Shutting down');
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGUSR2', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
