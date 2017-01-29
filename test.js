'use strict'

const assert = require('assert')
const extend = require('.')

describe('extend()', function () {
  it('should extend a class with another class', function () {
    class A {}
    class B {
      test () {}
    }
    extend(A, B)
    const a = new A()
    assert.strictEqual(typeof a.test, 'function')
  })

  it('should extend a class with multiple classes', function () {
    class A {}
    class B {
      test1 () {}
    }
    class C {
      test2 () {}
    }
    extend(A, [B, C])
    const a = new A()
    assert.strictEqual(typeof a.test1, 'function')
    assert.strictEqual(typeof a.test2, 'function')
  })

  it('should extend an object with a class', function () {
    const a = {}
    class B {
      test () {}
    }
    extend(a, B)
    assert.strictEqual(typeof a.test, 'function')
  })

  it('should extend an object with another object', function () {
    const a = {}
    const b = {
      test () {},
    }
    extend(a, b)
    assert.strictEqual(typeof a.test, 'function')
  })

  it('should support getters', function () {
    class A {}
    class B {
      get test () { return 'test' }
    }
    extend(A, B)
    const a = new A()
    assert.strictEqual(a.test, 'test')
  })

  it('should support setters', function () {
    class A {}
    class B {
      set test (val) {}
    }
    extend(A, B)
    const a = new A()
    a.test = 'test'
  })

  it('should support a whitelist argument', function () {
    class A {}
    class B {
      include () {}
      exclude () {}
    }
    extend(A, B, ['include'])
    const a = new A()
    assert.strictEqual(typeof a.include, 'function')
    assert.strictEqual(typeof a.exclude, 'undefined')
  })

  it('should not overwrite by default', function () {
    class A {
      test () {}
    }
    class B {
      test () {}
    }
    extend(A, B)
    assert.notStrictEqual(A.prototype.test, B.prototype.test)
  })

  it('should overwrite if the overwrite argument is true', function () {
    class A {
      test () {}
    }
    class B {
      test () {}
    }
    extend(A, B, {overwrite: true})
    assert.strictEqual(A.prototype.test, B.prototype.test)
  })

  it('should silently fail to overwrite a non-configurable property', function () {
    class A {}
    Object.defineProperty(A.prototype, 'test', {
      value () {},
      enumerable: true,
      writable: false,
      configurable: false,
    })
    class B {
      test () {}
    }
    extend(A, B, {overwrite: true})
    assert.notStrictEqual(A.prototype.test, B.prototype.test)
  })

  it('should work as a static method', function () {
    class A {}

    class B {
      test () {}
    }
    B.extend = extend

    B.extend(A)
    const a = new A()
    assert.strictEqual(typeof a.test, 'function')
  })

  it('should support a whitelist argument when used as a static method', function () {
    class A {}

    class B {
      include () {}
      exclude () {}
    }
    B.extend = extend

    B.extend(A, ['include'])
    const a = new A()
    assert.strictEqual(typeof a.include, 'function')
    assert.strictEqual(typeof a.exclude, 'undefined')
  })

  it('should support an overwrite argument when used as a static method', function () {
    class A {
      test () {}
    }
    class B {
      test () {}
    }
    B.extend = extend
    B.extend(A, {overwrite: true})
    assert.strictEqual(A.prototype.test, B.prototype.test)
  })
})
