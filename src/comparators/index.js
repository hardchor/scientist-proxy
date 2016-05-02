const EventEmitter = require('events');

import RecordingTransformer from '../stream/RecordingTransformer';

class RootComparator extends EventEmitter {

  control = new RecordingTransformer('control');

  candidate = new RecordingTransformer('candidate');

  headerComparator;
  bodyComparator;
  statusCodeComparator;

  constructor(...args) {
    super(...args);

    this.bindStreamEvents();
  }

  bindStreamEvents() {
    this.control.on('header', () => this.onControlHeader());

    this.control.on('end', () => this.onStreamEnd());
    this.candidate.on('end', () => this.onStreamEnd());
  }

  onStreamEnd() {
    if (this.control.hasEnded && this.candidate.hasEnded) {
      this.checkEquality();
      this.emit('end');
    }
  }

  onControlHeader(name, value) {
    console.log('##### header', name, value);
    if (name === 'content-type') {
      // set body comparator
    }
  }
}

export default RootComparator ;
