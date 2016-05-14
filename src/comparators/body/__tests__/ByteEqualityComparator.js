import ByteEqualityComparator from '../ByteEqualityComparator';
import RecordingTransformer from '../../../stream/RecordingTransformer';

jest.unmock('../ByteEqualityComparator');
jest.unmock('../BaseBufferedComparator');
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

  describe('match property', () => {

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

    it('is false if the streams are different lengths', () => {
      controlRecorder.chunks = ['abc', 'defg'];
      controlRecorder.emit('end');
      candidateRecorder.chunks = ['abc', 'def'];
      candidateRecorder.emit('end');

      expect(subject.match).toBe(false);
    });

  });

});
