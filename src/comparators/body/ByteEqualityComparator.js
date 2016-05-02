const EventEmitter = require('events');
const invariant = require('invariant');

import RecordingTransformer from '../../stream/RecordingTransformer';

class ByteEqualityComparator extends EventEmitter {

  /**
   * @type {RecordingTransformer}
   */
  control = new RecordingTransformer('control')

  /**
   * @type {RecordingTransformer}
   */
  candidate = new RecordingTransformer('candidate')

  /**
   * @type {Set}
   * @private
   */
  _completedStreams = new Set()

  /**
   * @type {boolean}
   * @protected
   */
  _finalized = false

  /**
   * @type {boolean}
   * @protected
   */
  _match = false

  constructor(...args) {
    super(...args);

    this.bindStreamEvents();
  }

  bindStreamEvents() {
    this.control.on('end', () => this.onStreamEnd(this.control));
    this.candidate.on('end', () => this.onStreamEnd(this.candidate));
  }

  onStreamEnd(stream) {
    this._completedStreams.add(stream);

    if (this._completedStreams.size === 2) {

      invariant(!this._finalized, "Must not be called after finalization");
      this._finalized = true;

      this._checkEquality();

      this.emit('end');
    }
  }

  /**
   * @returns {boolean}
   */
  get finalized() {
    return this._finalized;
  }

  /**
   * @returns {boolean}
   */
  get match() {
    invariant(this._finalized, "Must be called post finalization");
    return this._match;
  }

  /**
   * @protected
   */
  _checkEquality() {
    const controlItr = this.control[Symbol.iterator]();
    const candidateItr = this.candidate[Symbol.iterator]();
    let missmatch = false;

    function compareNext() {
      const controlResult = controlItr.next();
      const candidateResult = candidateItr.next();

      missmatch = controlResult.value !== candidateResult.value;

      return missmatch || controlResult.done || candidateResult.done;
    }

    while (!compareNext());

    this._match = !missmatch;
  }
}

export default ByteEqualityComparator ;
