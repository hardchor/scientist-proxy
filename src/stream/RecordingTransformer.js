import { Transform } from 'stream';
import debug from 'debug';

/**
 * Passthrough stream that records headers, status and chunks
 * Needs to essentially implement https://nodejs.org/api/http.html#http_class_http_serverresponse
 */
class RecordingTransformer extends Transform {
  statusCode = 200;

  headers = {};

  chunks = [];

  hasEnded = false;

  constructor(name = 'record', ...args) {
    super(...args);
    this.log = debug(`app:stream:${name}`);
  }

  /**
   * Receive the next stream
   * @param  {http.ServerResponse} dest
   * @param  {object} opts
   * @return {http.ServerResponse}
   */
  pipe(dest, opts) {
    this.log('pipe', opts);
    // dest is the server response
    this.dest = dest;

    return dest;
  }

  setHeader(name, value) {
    this.log('setHeader', name, value);
    this.emit('header', name, value);
    // TODO: could just throw an event - does the comparator want to record headers itself?
    this.headers[name] = value;

    this.dest && this.dest.setHeader(name, value);
  }

  _transform(chunk, encoding, next) {
    this.log('transform');
    // TODO: could just throw an event - does the comparator want to record chunks itself?
    this.chunks.push(chunk);

    if (this.dest) {
      this.dest.write(chunk, encoding, next);
    } else {
      next(null, chunk);
    }
  }

  end(chunk) {
    this.log('end');

    this.hasEnded = true;
    this.emit('end', chunk);

    this.dest && this.dest.end();
  }
}

export default RecordingTransformer;
