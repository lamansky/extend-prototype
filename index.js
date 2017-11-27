'use strict'

const getPrototype = require('get-prototype')
const hasProperty = require('has-property')
const isPlainObject = require('is-plain-object')

/**
 * Extends an object/class with methods from another.
 * @param {function|object} target An object, object prototype,
 *   or class, to which new methods should be attached.
 * @param {array|function|object} sources An object, object prototype,
 *   or class, which has methods to attach to the `target`. Or, an array of such
 *   objects/classes. If the function is called with a `this` context, this
 *   argument is omitted entirely and replaced with `methodWhitelist` or
 *   `options`.
 * @param {?array|object} methodWhitelist If provided, the only methods that
 *   will be added to the `target` are those whose names are in this array. This
 *   argument may be omitted entirely and replaced with an `options` object.
 * @param {?object} options
 * @param {?object} [options.bindTo] An object to which to bind the target’s new methods.
 * @param {bool} [options.overwrite=false] Whether or not to overwrite existing methods
 *   in the `target`.
 * @return {function|object} The `target` argument.
 */
module.exports = function extend (target, sources, methodWhitelist, options) {
  // Omit `sources` argument if `this` is set
  if (this && this !== global) {
    [target, methodWhitelist, options] = arguments
    sources = [this]
  }
  // Allow `methodWhitelist` argument to be omitted and replaced with `options`
  if (isPlainObject(methodWhitelist) && !isPlainObject(options)) {
    options = methodWhitelist
  }
  const {bindTo, overwrite = false} = options || {}

  const targetPrototype = getPrototype(target)
  if (!Array.isArray(sources)) sources = [sources]
  for (const source of sources) {
    const sourcePrototype = getPrototype(source)
    for (const [name, desc] of Object.entries(Object.getOwnPropertyDescriptors(sourcePrototype))) {
      if (name === 'constructor') continue
      if (typeof desc.value !== 'function' && typeof desc.get !== 'function' && typeof desc.set !== 'function') continue
      if (Array.isArray(methodWhitelist) && !methodWhitelist.includes(name)) continue
      if (hasProperty(targetPrototype, name)) {
        if (!overwrite) continue
        if (targetPrototype.hasOwnProperty(name) && !Object.getOwnPropertyDescriptor(targetPrototype, name).configurable) continue
      }
      if (bindTo) {
        for (const func of ['value', 'get', 'set']) {
          if (typeof desc[func] === 'function') {
            desc[func] = desc[func].bind(bindTo)
          }
        }
      }
      Object.defineProperty(targetPrototype, name, desc)
    }
  }

  return target
}
