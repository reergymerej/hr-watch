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

// TODO: module idea?
function runSchedule(schedule, interval) {
  return new Promise(resolve => {
    const results = [];
    let i = 0;

    const intervalObject = setInterval(() => {
      results.push(schedule[++i]());

      if (i === schedule.length - 1) {
        clearInterval(intervalObject);
        resolve(results);
      }
    }, interval);

    results.push(schedule[i]());
  });
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

  describe('lap()', () => {
    beforeEach(() => {
      app.reset();
    });

    it('should return an array of all the laps recorded', (done) => {
      const schedule = [
        () => { return app.start() },
        () => { return app.lap() },
        () => { return app.lap() },
      ];

      const timer = 5;

      runSchedule(schedule, timer).then((results) => {
        const [, lap1, lap2] = results;
        will(lap1).beAn(Array);
        will(lap1.length).be(1);
        will(lap1[0]).beAbout(msToNs(timer));
        will(lap2).beAn(Array);
        will(lap2.length).be(2);
        done();
      }).catch(done);
    });
  });

  describe('read', () => {
    describe('when not running laps', () => {
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

    xdescribe('when running laps', () => {

    });
  });
});
