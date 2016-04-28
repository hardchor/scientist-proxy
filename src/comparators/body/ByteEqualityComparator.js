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
    let leftItr = this.left.eachByte();
    let rightItr = this.right.eachByte();
    let missmatch = false;

    function compareNext()
    {
      let leftResult = leftItr.next();
      let rightResult = rightItr.next();

      missmatch = leftResult.value !== rightResult.value;

      return missmatch || leftResult.done || rightResult.done;
    }

    while (!compareNext());

    // TODO Do something with `missmatch`
  }
}

export default ByteEqualityComparator ;
