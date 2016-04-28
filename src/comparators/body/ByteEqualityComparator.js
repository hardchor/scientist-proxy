const EventEmitter = require('events');

import RecordingTransformer from '../../stream/RecordingTransformer';

class ByteEqualityComparator extends EventEmitter {

  control = new RecordingTransformer('control')

  candidate = new RecordingTransformer('candidate')

  constructor(...args) {
    super(...args);

    this.bindStreamEvents();
  }

  bindStreamEvents() {
    this.control.on('end', () => this.onStreamEnd());
    this.candidate.on('end', () => this.onStreamEnd());
  }

  onStreamEnd() {
    if (this.control.hasEnded && this.candidate.hasEnded) {
      this.checkEquality();
      this.emit('end');
    }
  }

  checkEquality() {
    const controlItr = this.control.eachByte();
    const candidateItr = this.candidate.eachByte();
    let missmatch = false;

    function compareNext() {
      const controlResult = controlItr.next();
      const candidateResult = candidateItr.next();

      missmatch = controlResult.value !== candidateResult.value;

      return missmatch || controlResult.done || candidateResult.done;
    }

    while (!compareNext());

    // TODO Do something with `missmatch`
  }
}

export default ByteEqualityComparator ;
