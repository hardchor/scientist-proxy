import ByteEqualityComparator from '../ByteEqualityComparator';

jest.unmock('../ByteEqualityComparator');
jest.unmock('../../../stream/RecordingTransformer');
jest.unmock('invariant');

describe('ByteEqualityComparator', () => {

  var subject;

  beforeEach(() => {
    subject = new ByteEqualityComparator();
  });

  describe('finalised property', () => {

    it('is false by default', () => {
      expect(subject.finalized).toBe(false);
    });

    it('is false after only one', () => {
      subject.control.emit('end');
      expect(subject.finalized).toBe(false);
    });

    it('is false after only one', () => {
      subject.control.emit('end');
      subject.candidate.emit('end');
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
      subject.control.chunks = ['abc', 'defg'];
      subject.control.emit('end');
      subject.candidate.chunks = ['abc', 'defg'];
      subject.candidate.emit('end');

      expect(subject.match).toBe(true);
    });

    it('is false if the subject streams match', () => {
      subject.control.chunks = ['abc', 'defg'];
      subject.control.emit('end');
      subject.candidate.chunks = ['cba', 'defg'];
      subject.candidate.emit('end');

      expect(subject.match).toBe(false);
    });

  });

  describe('end event', () => {
    
    it('is dispatched on completion of comparison', () => {
      let spy = jest.fn();
      subject.on('end', spy);

      subject.control.emit('end');
      expect(spy).not.toBeCalled();

      subject.candidate.emit('end');
      expect(spy).toBeCalled();

    });

  });

});
