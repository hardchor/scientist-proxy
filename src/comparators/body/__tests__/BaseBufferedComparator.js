import BaseBufferedComparator from '../BaseBufferedComparator';
import RecordingTransformer from '../../../stream/RecordingTransformer';

jest.unmock('../BaseBufferedComparator');
jest.unmock('../../BaseComparator');
jest.unmock('../../../stream/RecordingTransformer');
jest.unmock('invariant');

describe('BaseBufferedComparator', () => {

  let subject;
  let controlRecorder;
  let candidateRecorder;
  let checkEqualityStub;

  beforeEach(() => {

    controlRecorder = new RecordingTransformer('controlRecorder')
    candidateRecorder = new RecordingTransformer('candidateRecorder')

    checkEqualityStub = jest.fn();

    class BaseBufferedComparatorImpl extends BaseBufferedComparator {
      _checkEquality = checkEqualityStub
    }

    subject = new BaseBufferedComparatorImpl(
      controlRecorder,
      candidateRecorder
    );
  });

  describe('finalised property', () => {

    it('is false by default', () => {
      expect(subject.finalized).toBe(false);
    });

    it('is false after only one', () => {
      controlRecorder.emit('end');
      expect(subject.finalized).toBe(false);
    });

    it('is false after only one', () => {
      controlRecorder.emit('end');
      candidateRecorder.emit('end');
      expect(subject.finalized).toBe(true);
    });

  });

  describe('match property', () => {

    it('throws if comparator is not finalized', () => {
      expect(() => {
        subject.match;
      }).toThrow();
    });

  });

  describe('end event', () => {

    it('is dispatched on completion of comparison', () => {
      let spy = jest.fn();
      subject.on('end', spy);

      controlRecorder.emit('end');
      expect(spy).not.toBeCalled();

      candidateRecorder.emit('end');
      expect(spy).toBeCalled();

    });

  });

  describe('_checkEquality', () => {

    it('should be called once both stream end', () => {
      expect(checkEqualityStub).not.toBeCalled();

      controlRecorder.emit('end');
      candidateRecorder.emit('end');

      expect(checkEqualityStub).toBeCalled();
    });

    it('should be not be called if only the control stream had ended', () => {
      expect(checkEqualityStub).not.toBeCalled();

      controlRecorder.emit('end');

      expect(checkEqualityStub).not.toBeCalled();
    });

    it('should be not be called if only the candidate stream had ended', () => {
      expect(checkEqualityStub).not.toBeCalled();

      candidateRecorder.emit('end');

      expect(checkEqualityStub).not.toBeCalled();
    });

  });

});
