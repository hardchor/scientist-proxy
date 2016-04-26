import { doSomething, doSomethingAsync } from '../someModule';

jest.unmock('../someModule');

describe('someModule', () => {
  describe('doSomething', () => {
    it('appends "and more" to the input', () => {
      expect(doSomething('proxies')).toEqual('proxies and more');
    });
  });

  describe('doSomethingAsync', () => {
    pit('appends "and more" to the input', () => {
      const func = doSomethingAsync('proxies');

      jest.runAllTimers();

      return func.then(result => {
        expect(result).toEqual('async proxies and more');
      });
    });
  });
});
