const invariant = require('invariant');

import BaseComparator from '../BaseComparator';
import RecordingTransformer from '../../stream/RecordingTransformer';

class ByteEqualityComparator extends BaseComparator {

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
   * @type {Set}
   * @private
   */
  _completedStreams = new Set()

  constructor(controlRecorder, candidateRecorder, ...args) {
    super(...args);

    this._controlRecorder = controlRecorder || new RecordingTransformer('controlRecorder');
    this._candidateRecorder = candidateRecorder || new RecordingTransformer('candidateRecorder');

    this._bindStreamEvents();
  }

  /**
   * @override
   * @param stream
   */
  setControl(stream, ...args) {
    super.setControl(stream, ...args);
    this._control.pipe(this._controlRecorder);
  }

  /**
   * @override
   * @param stream
   */
  setCandidate(stream, ...args) {
  super.setCandidate(stream, ...args);
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
