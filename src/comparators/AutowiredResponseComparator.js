import BaseComparator from './BaseComparator';

class AutowiredResponseComparator extends BaseComparator {

  statusCodeComparator; // = SomeDefaultComparator()
  headerComparator; // = SomeDefaultComparator()
  bodyComparator; // = SomeDefaultComparator()

  /**
   * @override
   * @param stream
   */
  setControl(stream, ...args) {
    super.setControl(stream, ...args);
    this._control.on('header', () => this.onControlHeader());
  }

  onControlHeader(name, value) {
    console.log('##### header', name, value);
    if (name === 'content-type') {
      // set body comparator
    }
  }
}

export default AutowiredResponseComparator;
