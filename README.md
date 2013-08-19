# YA-Role (Yet Another dice Rolling module)

There are many excellent dice rolling modules out there.  You should probably
check them out.  I decided to write my own mainly to play around with building
a chainable API.

```javascript
var Roll = require('ya-roll');

var check = Roll(10).orAbove().onDice(3).withSides(6);

console.log("Probability of passing check: " + check.chance());

if (check.result()) {
  console.log("You pass!");
} else {
  console.log("You fail!");
}

var manyResults = check.results(10);
for (var i = 0; i < manyResults.length; ++i) {
  console.log("Check " + i + ": " + (manyResults[i] ? "passed" : "failed"));
}
```
