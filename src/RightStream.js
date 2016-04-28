import { Transform } from 'stream';

class RightStream extends Transform {
  statusCode = 200

  headers = {}

  chunks = []

  constructor(...args) {
    super(...args);
  }

  setHeader(name, value) {
    console.log('##### setHeader', name, value);
    this.headers[name] = value;
    this.dest.setHeader(name, value);
  }

  _transform(chunk, encoding, next) {
    console.log('##### transform');
    this.chunks.push(chunk);

    next(null, chunk);
  }

  pipe(dest, opts) {
    console.log('##### pipe');
    // dest is the server response
    this.dest = dest;

    return dest;
  }

  end(chunk) {
    console.log('##### end');
    this.emit('end', chunk);
    this.emit('close');
  }
}

export default RightStream;
