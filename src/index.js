let startTime;

function toNS(hrtimeDiff) {
  return hrtimeDiff[0] * 1e9 + hrtimeDiff[1];
}

export function start() {
  startTime = process.hrtime();
}

export function stop() {
  const hrtimeDiff = process.hrtime(startTime);
  return toNS(hrtimeDiff);
}
