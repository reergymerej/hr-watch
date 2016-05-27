import willy, { will } from 'willy';
import * as app from '../src';

willy.loadDefinitions({
  beNsOfMs: {
    fn: function beNsOfMs() {
      const min = 1e6 * this.expected;
      const max = 1e6 * (this.expected * 1.5);

      return this.actual >= min
      && this.actual <= max;
    },
    explanation: 'be nanosecond approximate of ms:',
  },

  beAbout: {
    fn: function beAbout() {
      const min = this.expected * 0.5;
      const max = this.expected * 1.5;
      return this.actual >= min
        && this.actual <= max;
    },
  }
});


function msToNs(ms) {
  return ms * 1e6;
}

describe('start/stop', () => {
  it('should return the elapsed time in ns', (done) => {
    const wait = 10;
    app.start();

    setTimeout(() => {
      const result = app.stop();
      will(result).beAbout(msToNs(wait));
      done();
    }, wait);
  });

  it('should return time in ms', (done) => {
    const wait = 10;
    app.start();

    setTimeout(() => {
      const result = app.stop('ms');
      will(result).beAbout(wait);
      done();
    }, wait);
  });

  it('should return time in seconds', (done) => {
    const wait = 10;
    app.start();

    setTimeout(() => {
      const result = app.stop('s');
      will(result).beAbout(wait / 1000);
      done();
    }, wait);
  });
});
