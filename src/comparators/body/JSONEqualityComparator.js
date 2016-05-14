const deepEqual = require('deep-equal')

import BaseBufferedComparator from './BaseBufferedComparator';

class JSONEqualityComparator extends BaseBufferedComparator {

  /**
   * @protected
   * @override
   */
  _checkEquality() {
    const controlObj = JSON.parse(this._controlRecorder.toString());
    const candidateObj = JSON.parse(this._candidateRecorder.toString());

    this._match = deepEqual(
      controlObj,
      candidateObj,
      {
        strict: true
      }
    );
  }
}

export default JSONEqualityComparator;
