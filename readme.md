# @valentech/circular-stringify

A utility for circular JSON stringify and parse.

## Installation

```sh
npm install @valentech/circular-stringify
```

## Usage

```javascript
const Circular = require('@valentech/circular-stringify')

const circularObj = { name: 'Alice' }
circularObj.self = circularObj

const jsonString = Circular.stringify(circularObj, null, 2)
console.log('Serialized:', jsonString)

const restoredObj = Circular.parse(jsonString)
console.log('Restored:', restoredObj)
console.log(
  'Is circular (restoredObj.self === restoredObj):',
  restoredObj.self === restoredObj
)
```
