const EventEmitter = require('events');
const invariant = require('invariant');

import RecordingTransformer from '../../stream/RecordingTransformer';

class ByteEqualityComparator extends EventEmitter {

  /**
   * @type {RecordingTransformer}
   * @protected
   */
  _controlRecorder = null

  /**
   * @type {RecordingTransformer}
   * @protected
   */
  _candidateRecorder = null

  /**
   * @type {stream.Readable}
   * @private
   */
  _control = null

  /**
   * @type {stream.Readable}
   * @private
   */
  _candidate = null

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

  constructor(controlRecorder, candidateRecorder, ...args) {
    super(...args);

    this._controlRecorder = controlRecorder || new RecordingTransformer('controlRecorder');
    this._candidateRecorder = candidateRecorder || new RecordingTransformer('candidateRecorder');

    this._bindStreamEvents();
  }

  /**
   * @param stream
   */
  setControl(stream) {
    invariant(this._control === null, "Control must not be set more than once");
    this._control = stream;
    this._control.pipe(this._controlRecorder);
  }

  /**
   * @param stream
   */
  setCandidate(stream) {
    invariant(this._control === null, "Candidate must not be set more than once");
    this._candidate = stream;
    this._candidate.pipe(this._candidateRecorder);
  }
  
  _bindStreamEvents() {
    this._controlRecorder.on('end', () => this._onStreamEnd(this._controlRecorder));
    this._candidateRecorder.on('end', () => this._onStreamEnd(this._candidateRecorder));
  }

  _onStreamEnd(stream) {
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
    const _controlRecorderItr = this._controlRecorder[Symbol.iterator]();
    const _candidateRecorderItr = this._candidateRecorder[Symbol.iterator]();
    let missmatch = false;

    function compareNext() {
      const _controlRecorderResult = _controlRecorderItr.next();
      const _candidateRecorderResult = _candidateRecorderItr.next();

      missmatch = _controlRecorderResult.value !== _candidateRecorderResult.value;

      return missmatch || _controlRecorderResult.done || _candidateRecorderResult.done;
    }

    while (!compareNext());

    this._match = !missmatch;
  }
}

export default ByteEqualityComparator ;
