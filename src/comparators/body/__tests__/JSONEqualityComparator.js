import JSONEqualityComparator from '../JSONEqualityComparator';
import RecordingTransformer from '../../../stream/RecordingTransformer';

const deepEqual = require('deep-equal');

jest.unmock('../JSONEqualityComparator');
jest.unmock('../BaseBufferedComparator');
jest.unmock('../../BaseComparator');
jest.unmock('../../../stream/RecordingTransformer');
jest.unmock('invariant');

describe('JSONEqualityComparator', () => {

  var subject;
  var controlRecorder;
  var candidateRecorder;

  beforeEach(() => {

    controlRecorder = new RecordingTransformer('controlRecorder')
    candidateRecorder = new RecordingTransformer('candidateRecorder')

    subject = new JSONEqualityComparator(
      controlRecorder,
      candidateRecorder
    );
  });

  var objectA = { object: 'A'};
  var objectB = { object: 'B' };

  function simulateResponse(control, candidate)
  {
    controlRecorder.chunks = [JSON.stringify(control)];
    controlRecorder.emit('end');
    candidateRecorder.chunks = [JSON.stringify(candidate)];
    candidateRecorder.emit('end');
  }

  describe('_checkEquality', () => {

    it('should call deepEqual once', () => {
      simulateResponse(objectA, objectB);

      expect(deepEqual.mock.calls.length).toBe(1);
    });

    it('should call deepEqual with the correct response objects', () => {
      simulateResponse(objectA, objectB);

      let callArgs = deepEqual.mock.calls[0];

      expect(callArgs[0]).toEqual(objectA);
      expect(callArgs[1]).toEqual(objectB);

    });

    it('should call deepEqual with the strict flag set', () => {
      simulateResponse(objectA, objectB);

      let callArgs = deepEqual.mock.calls[0];

      expect(callArgs[2]).toEqual({
        strict: true
      });

    });

  });

  describe('match property', () => {

    it("is true if deep equal returns true", () => {
      deepEqual.mockReturnValue(true);

      simulateResponse(objectA, objectB);

      expect(subject.match).toBe(true);
    });

    it("is false if deep equal returns false", () => {
      deepEqual.mockReturnValue(false);

      simulateResponse(objectA, objectB);

      expect(subject.match).toBe(false);
    });

  });

});
