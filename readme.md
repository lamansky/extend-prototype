# extend-prototype

* Extends one class with methods from another.
* Supports getters and setters.
* Can (optionally) make use of a whitelist.
* Can easily be added to a class as a static method.

Packaged as a [Node.js](https://nodejs.org/) module.

## Installation

```bash
npm install extend-prototype --save
```

The module exposes a single function.

## Function Parameters

* `target`: The object/class to extend.
* `sources`: An object/class (or an array of objects/classes) with methods to add to the target.
* `methodWhitelist`: An array of the names of methods to add. (If omitted, all methods are added.)
* `overwrite`: Whether or not to overwrite existing methods in the target.

## Function Signatures

The function can accept its arguments in a variety of combinations:

```javascript
extend(target, sources, methodWhitelist, {overwrite})
extend(target, sources, methodWhitelist)
extend(target, sources, {overwrite})
extend(target, sources)
source.extend(target, methodWhitelist, {overwrite})
source.extend(target, methodWhitelist)
source.extend(target, {overwrite})
source.extend(target)
```

## Usage Examples

### Basic Example

```javascript
const extend = require('extend-prototype')
class A {}
class B {
  test () {}
  get value () { return 'example' }
}
extend(A, B)
const a = new A()
a.test()
a.value // 'example'
```

### Static Method Example

Easily use `extend-prototype` as a static method on your mixin, like so:

```javascript
class Mixin {
  mixinMethod () {}
}
Mixin.extend = require('extend-prototype')

class Test {}
Mixin.extend(Test)

const test = new Test()
test.mixinMethod()
```

### Example with Arguments

The following example makes use of the `methodWhitelist` and `overwrite` parameters:

```javascript
const extend = require('extend-prototype')
class A {
  include () { return 'from A' }
}
class B {
  include () { return 'from B' }
  exclude () {}
}

// Only add the `include` method, and overwrite the existing one.
extend(A, B, ['include'], {overwrite: true})

const a = new A()
a.include() // 'from B'
typeof a.exclude // 'undefined'
```
