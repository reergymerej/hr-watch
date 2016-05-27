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

describe('o-clock', () => {
  beforeEach(() => {
    app.clear();
  });

  describe('start/stop', () => {
    describe('returned value', () => {
      it('should be elapsed ns', (done) => {
        const wait = 10;
        app.start();

        setTimeout(() => {
          const result = app.stop();
          will(result).beAbout(msToNs(wait));
          done();
        }, wait);
      });

      it('should be elapsed ms when specified', (done) => {
        const wait = 10;
        app.start();

        setTimeout(() => {
          const result = app.stop('ms');
          will(result).beAbout(wait);
          done();
        }, wait);
      });

      it('should be elapsed s when specified', (done) => {
        const wait = 10;
        app.start();

        setTimeout(() => {
          const result = app.stop('s');
          will(result).beAbout(wait / 1000);
          done();
        }, wait);
      });
    });

    describe('start/stop/start/stop', () => {
      it('should returned the total elapsed time', (done) => {
        const wait = 10;
        app.start();

        setTimeout(() => {
          app.stop('s');

          setTimeout(() => {
            app.start();

            setTimeout(() => {
              const result = app.stop('ms');
              will(result).beAbout(wait * 2);
              done();
            }, wait);
          }, wait);
        }, wait);
      });
    });
  });
});
