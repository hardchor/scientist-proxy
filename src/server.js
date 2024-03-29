/* eslint no-param-reassign: 0 */
import http from 'http';
import request from 'request';
import config from '../config';
import debug from 'debug';
import ResponseComparator from './comparators/AutowiredResponseComparator';
import RecordingTransformer from './stream/RecordingTransformer';

const log = debug('app');
const { oldApiEndpoint, newApiEndpoint } = config;

const server = http.createServer((req, res) => {
  const controlRecorder = new RecordingTransformer('control');
  const candidateRecorder = new RecordingTransformer('candidate');
  const comparator = new ResponseComparator(controlRecorder, candidateRecorder);

  // TODO: add X-Forwarded-For headers etc.
  // control
  req
    .pipe(request(oldApiEndpoint + req.url))
    .pipe(controlRecorder)
    .pipe(res)
  ;

  // candidate
  req
    .pipe(request(newApiEndpoint + req.url))
    .pipe(candidateRecorder)
  ;
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
