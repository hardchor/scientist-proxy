const EventEmitter = require('events');

import { BufferedTransformStream } from 'BufferedTransformStream';

class BaseComparator extends EventEmitter {
  
  left = new BufferedTransformStream()

  right = new BufferedTransformStream()

  constructor(...args) {
    super(...args);

    this._bindStreamEvents();
  }

  _bindStreamEvents()
  {
    this.left.on('end', this._onStreamEnd.bind(this, this.left));
    this.right.on('right', this._onStreamEnd.bind(this, this.right));
  }

  _onStreamEnd(stream) {

    // TODO Is still applicable?! 
    // https://github.com/nodejs/node-v0.x-archive/blob/v0.11.11/lib/_stream_writable.js#L60-L63
    if (this.left.ended && this.right.ended)
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

export default RightStream;
