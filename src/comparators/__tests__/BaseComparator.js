import BaseComparator from '../BaseComparator';

jest.unmock('../BaseComparator');
jest.unmock('invariant');

describe('BaseComparator', () => {

  var subject;

  beforeEach(() => {
    subject = new BaseComparator();
  });

  describe('setControl', () => {
    it('throws if set more than once', () => {
      subject.setControl({});

      expect(() => {
        subject.setControl({});
      }).toThrow();
    });
  });

  describe('setControl', () => {
    it('throws if set more than once', () => {
      subject.setCandidate({});

      expect(() => {
        subject.setCandidate({});
      }).toThrow();
    });
  });
});
