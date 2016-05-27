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

  describe('clear', () => {
    it('should reset the elapsed time', (done) => {
      app.start();
      setTimeout(() => {
        app.stop();
        will(app.read()).beGreaterThan(0);
        app.clear();
        will(app.read()).be(0);
        done();
      }, 10);
    });
  });

  describe('read', () => {
    let timer;

    beforeEach((done) => {
      app.start();
      setTimeout(() => {
        app.stop();
        done();
      }, timer = 10);
    });

    describe('()', () => {
      it('should return elapsed time in ns', () => {
        const result = app.read();
        const expected = msToNs(timer);
        will(result).beAbout(expected);
      });
    });

    describe('(ns)', () => {
      it('should return elapsed time in ns', () => {
        const result = app.read();
        const expected = msToNs(timer);
        will(result).beAbout(expected);
      });
    });

    describe('(ms)', () => {
      it('should return elapsed time in ms', () => {
        const result = app.read('ms');
        const expected = timer;
        will(result).beAbout(expected);
      });
    });

    describe('(s)', () => {
      it('should return elapsed time in s', () => {
        const result = app.read('s');
        const expected = timer / 1e3;
        will(result).beAbout(expected);
      });
    });
  });
});
