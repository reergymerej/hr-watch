# o-clock

A high-resoultion stopwatch for Node.

## API

start - starts/restarts timer  
stop(unit) - stops timer, returns elapsed time (unit)
lap - marks a lap, starts a new lap timer, returns previous lap time (unit)
read([unit]) - gets current timer
- when running laps, returns an array of laps
- when not running laps, returns the current elapsed time
- specify unit
clear - clears out timer

unit - sets returned unit (ns, ms, s), by default this is ns







---
kickstarted by [npm-boom][npm-boom]

[npm-boom]: https://github.com/reergymerej/npm-boom
