import BaseBufferedComparator from './BaseBufferedComparator';

class ByteEqualityComparator extends BaseBufferedComparator {

  /**
   * @protected
   * @override
   */
  _checkEquality() {
    const controlRecorderItr = this._controlRecorder[Symbol.iterator]();
    const candidateRecorderItr = this._candidateRecorder[Symbol.iterator]();
    let missMatch = false;

    function compareNext() {
      const controlRecorderResult = controlRecorderItr.next();
      const candidateRecorderResult = candidateRecorderItr.next();

      missMatch = controlRecorderResult.value !== candidateRecorderResult.value;

      return missMatch || controlRecorderResult.done || candidateRecorderResult.done;
    }

    while (!compareNext());

    this._match = !missMatch;
  }
}

export default ByteEqualityComparator ;
