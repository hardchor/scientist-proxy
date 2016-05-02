const EventEmitter = require('events');

import RecordingTransformer from '../stream/RecordingTransformer';

class ResponseComparator extends EventEmitter {

  control = new RecordingTransformer('control');

  candidate = new RecordingTransformer('candidate');

  statusCodeComparator; // = SomeDefaultComparator()
  headerComparator; // = SomeDefaultComparator()
  bodyComparator; // = SomeDefaultComparator()

  constructor(...args) {
    super(...args);

    this.bindStreamEvents();
  }

  bindStreamEvents() {
    this.control.on('header', () => this.onControlHeader());
  }

  onControlHeader(name, value) {
    console.log('##### header', name, value);
    if (name === 'content-type') {
      // set body comparator
    }
  }
}

export default ResponseComparator;
