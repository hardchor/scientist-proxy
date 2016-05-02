/* eslint no-underscore-dangle:0 */

import RecordingTransformer from '../RecordingTransformer';

jest.unmock('../RecordingTransformer');

describe('RecordingTransformer', () => {

  let mockConsumer;
  let recordingTransformer;

  beforeEach(() => {
    mockConsumer = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
    recordingTransformer = new RecordingTransformer();
  });

  describe('pipe', () => {
    it('accepts a consuming stream', () => {
      expect(recordingTransformer.pipe(mockConsumer)).toEqual(mockConsumer);
    });
  });

  describe('setHeader', () => {
    it('records headers', () => {
      recordingTransformer.setHeader('some', 'header');
      expect(recordingTransformer.headers.some).toBeDefined();
      expect(recordingTransformer.headers.some).toEqual('header');
    });

    it('forwards headers to the consuming stream', () => {
      recordingTransformer.pipe(mockConsumer);
      recordingTransformer.setHeader('another', 'header');

      expect(mockConsumer.setHeader).toBeCalledWith('another', 'header');
    });
  });

  describe('_transform', () => {
    let chunk;
    let next;

    beforeEach(() => {
      chunk = {};
      next = jest.fn();
    });

    it('records chunks', () => {
      recordingTransformer._transform(chunk, '', next);
      expect(recordingTransformer.chunks).toContain(chunk);
      expect(next).toBeCalledWith(null, chunk);
    });

    it('forwards chunks to the consuming stream', () => {
      recordingTransformer.pipe(mockConsumer);
      recordingTransformer._transform(chunk, 'enc', next);

      expect(mockConsumer.write).toBeCalledWith(chunk, 'enc', next);
    });
  });

  describe('end', () => {
    pit('closes the stream', () => new Promise(resolve => {
      recordingTransformer.on('end', () => {
        resolve();
      });

      recordingTransformer.end();
      expect(recordingTransformer.hasEnded).toBeTruthy();
    }));

    it('ends the consuming stream', () => {
      recordingTransformer.pipe(mockConsumer);
      recordingTransformer.end();

      expect(mockConsumer.end).toBeCalled();
    });
  });

  describe('Symbol.iterator', () => {
    it('yields each byte in all chunks', () => {
      recordingTransformer.chunks = ['abc', 'defg', 'hi'];

      const itr = recordingTransformer[Symbol.iterator]();
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
