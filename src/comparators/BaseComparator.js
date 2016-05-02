const EventEmitter = require('events');
const invariant = require('invariant');

class BaseComparator extends EventEmitter {

  /**
   * @type {stream.Readable}
   * @protected
   */
  _control = null

  /**
   * @type {stream.Readable}
   * @protected
   */
  _candidate = null

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

  /**
   * @param stream
   */
  setControl(stream) {
    invariant(this._control === null, "Control must not be set more than once");
    this._control = stream;
  }

  /**
   * @param stream
   */
  setCandidate(stream) {
    invariant(this._candidate === null, "Candidate must not be set more than once");
    this._candidate = stream;
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
}

export default BaseComparator;
