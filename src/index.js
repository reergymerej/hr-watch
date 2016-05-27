const S = 's';
const MS = 'ms';
const NS = 'ns';

let startTime;
let elapsedNS = 0;

function toNS(hrtimeDiff) {
  return hrtimeDiff[0] * 1e9 + hrtimeDiff[1];
}

function toMS(hrtimeDiff) {
  return toNS(hrtimeDiff) / 1e6;
}

function toSeconds(hrtimeDiff) {
  return toNS(hrtimeDiff) / 1e9;
}

export function start() {
  startTime = process.hrtime();
}

export function stop(unit = NS) {
  const hrtimeDiff = process.hrtime(startTime);
  const ns = toNS(hrtimeDiff);
  elapsedNS += ns;

  switch (unit) {
    case MS:
      return toMS(hrtimeDiff);
    case S:
      return toSeconds(hrtimeDiff);
    case NS:
    default:
      return ns;
  }
}

export function clear() {
  elapsedNS = 0;
}

export function read(unit = NS) {
  switch (unit) {
    case MS:
      return elapsedNS / 1e6;
    case S:
      // 1s = 1000ms
      // 1s = 1000000000ns
      return elapsedNS / 1e9;
    case NS:
    default:
      return elapsedNS;
  }
}
