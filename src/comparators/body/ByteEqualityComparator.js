const EventEmitter = require('events');

import { BufferedTransformStream } from 'BufferedTransformStream';

class ByteEqualityComparator extends EventEmitter {
  
  left = new BufferedTransformStream()

  right = new BufferedTransformStream()

  constructor(...args) {
    super(...args);

    this._bindStreamEvents();
  }

  _bindStreamEvents() {
    this.left.on('end', this._onStreamEnd.bind(this, this.left));
    this.right.on('end', this._onStreamEnd.bind(this, this.right));
  }

  _onStreamEnd(stream) {
    if (this.left.hasEnded && this.right.hasEnded)
    {
      this._checkEquality();
      this.emit('end');
    }
  }

  _checkEquality()
  {
    // TODO Extend this guy
    // TODO Now we deal in chucks str1 === str2 no longer works. Iterate chunks to check for equality
  }
}

export default ByteEqualityComparator ;
