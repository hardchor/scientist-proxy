import ByteEqualityComparator from '../ByteEqualityComparator';
import RecordingTransformer from '../../../stream/RecordingTransformer';

jest.unmock('../ByteEqualityComparator');
jest.unmock('../../BaseComparator');
jest.unmock('../../../stream/RecordingTransformer');
jest.unmock('invariant');

describe('ByteEqualityComparator', () => {

  var subject;
  var controlRecorder;
  var candidateRecorder;

  beforeEach(() => {

    controlRecorder = new RecordingTransformer('controlRecorder')
    candidateRecorder = new RecordingTransformer('candidateRecorder')

    subject = new ByteEqualityComparator(
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

    it('is true if the subject streams match', () => {
      controlRecorder.chunks = ['abc', 'defg'];
      controlRecorder.emit('end');
      candidateRecorder.chunks = ['abc', 'defg'];
      candidateRecorder.emit('end');

      expect(subject.match).toBe(true);
    });

    it('is false if the subject streams match', () => {
      controlRecorder.chunks = ['abc', 'defg'];
      controlRecorder.emit('end');
      candidateRecorder.chunks = ['cba', 'defg'];
      candidateRecorder.emit('end');

      expect(subject.match).toBe(false);
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

});
