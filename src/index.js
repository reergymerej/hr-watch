const S = 's';
const MS = 'ms';
const NS = 'ns';

let startTime;
let elapsedNS = 0;
let laps = [];

function toNS(hrtimeDiff) {
  return hrtimeDiff[0] * 1e9 + hrtimeDiff[1];
}

export function start() {
  startTime = process.hrtime();
}

export function clear() {
  startTime = null;
  elapsedNS = 0;
  laps = [];
}

export function read(unit = NS) {
  if (startTime) {
    const hrtimeDiff = process.hrtime(startTime);
    const ns = toNS(hrtimeDiff);
    let result;

    switch (unit) {
      case MS:
        result = ns / 1e6;
        break;
      case S:
        result = ns / 1e9;
        break;
      case NS:
      default:
        result = ns;
    }

    if (laps.length) {
      return [...laps.slice(), result];
    } else {
      return result;
    }
    
  } else {
    return 0;
  }
}

export function stop(unit = NS) {
  const ns = read();
  elapsedNS += ns;

  switch (unit) {
    case MS:
      return ns / 1e6;
    case S:
      return ns / 1e9;
    case NS:
    default:
      return ns;
  }
}

export function reset() {
  clear();
}

export function lap(unit = NS) {
  laps.push(read(unit));
  return laps.slice();
}
