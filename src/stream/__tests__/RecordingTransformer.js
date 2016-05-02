import RecordingTransformer from '../RecordingTransformer';

jest.unmock('../RecordingTransformer');

describe('RecordingTransformer', () => {

  var subject;

  beforeEach(() => {
    subject = new RecordingTransformer();
  });

  describe('Symbol.iterator', () => {

    it('yields each byte in all chunks', () => {
      subject.chunks = ['abc', 'defg', 'hi'];

      const itr = subject[Symbol.iterator]();
      let results = [];
      let item;

      while (true) {
        item = itr.next();
        if (item.done) {
          break;
        }
        else {
          results.push(item.value);
        }
      }

      expect(results).toEqual([ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i' ]);

    });

  });

});
