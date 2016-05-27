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

export function read() {
  return elapsedNS;
}
