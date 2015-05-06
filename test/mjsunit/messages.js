// Copyright 2015 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --stack-size=100 --harmony --harmony-reflect --harmony-arrays
// Flags: --harmony-regexps

function test(f, expected, type) {
  try {
    f();
  } catch (e) {
    assertInstanceof(e, type);
    assertEquals(expected, e.message);
    return;
  }
  assertUnreachable("Exception expected");
}

// === Error ===

// kCyclicProto
test(function() {
  var o = {};
  o.__proto__ = o;
}, "Cyclic __proto__ value", Error);


// === TypeError ===

// kApplyNonFunction
test(function() {
  Function.prototype.apply.call(1, []);
}, "Function.prototype.apply was called on 1, which is a number " +
   "and not a function", TypeError);

// kArrayFunctionsOnFrozen
test(function() {
  var a = [1, 2];
  Object.freeze(a);
  a.splice(1, 1, [1]);
}, "Cannot modify frozen array elements", TypeError);

// kArrayFunctionsOnSealed
test(function() {
  var a = [1];
  Object.seal(a);
  a.shift();
}, "Cannot add/remove sealed array elements", TypeError);

// kCalledNonCallable
test(function() {
  [].forEach(1);
}, "1 is not a function", TypeError);

// kCalledOnNonObject
test(function() {
  Object.defineProperty(1, "x", {});
}, "Object.defineProperty called on non-object", TypeError);

// kCalledOnNullOrUndefined
test(function() {
  Array.prototype.shift.call(null);
}, "Array.prototype.shift called on null or undefined", TypeError);

// kCannotConvertToPrimitive
test(function() {
  [].join(Object(Symbol(1)));
}, "Cannot convert object to primitive value", TypeError);

// kConstructorNotFunction
test(function() {
  Uint16Array(1);
}, "Constructor Uint16Array requires 'new'", TypeError);

// kDataViewNotArrayBuffer
test(function() {
  new DataView(1);
}, "First argument to DataView constructor must be an ArrayBuffer", TypeError);

// kDateType
test(function() {
  Date.prototype.setYear.call({}, 1);
}, "this is not a Date object.", TypeError);

// kDefineDisallowed
test(function() {
  "use strict";
  var o = {};
  Object.preventExtensions(o);
  Object.defineProperty(o, "x", { value: 1 });
}, "Cannot define property:x, object is not extensible.", TypeError);

// kFirstArgumentNotRegExp
test(function() {
  "a".startsWith(/a/);
}, "First argument to String.prototype.startsWith " +
   "must not be a regular expression", TypeError);

// kFlagsGetterNonObject
test(function() {
  Object.getOwnPropertyDescriptor(RegExp.prototype, "flags").get.call(1);
}, "RegExp.prototype.flags getter called on non-object 1", TypeError);

// kFunctionBind
test(function() {
  Function.prototype.bind.call(1);
}, "Bind must be called on a function", TypeError);

// kGeneratorRunning
test(function() {
  var iter;
  function* generator() { yield iter.next(); }
  var iter = generator();
  iter.next();
}, "Generator is already running", TypeError);

// kIncompatibleMethodReceiver
test(function() {
  RegExp.prototype.compile.call(RegExp.prototype);
}, "Method RegExp.prototype.compile called on incompatible receiver " +
   "[object RegExp]", TypeError);

// kInstanceofFunctionExpected
test(function() {
  1 instanceof 1;
}, "Expecting a function in instanceof check, but got 1", TypeError);

// kInstanceofNonobjectProto
test(function() {
  function f() {}
  var o = new f();
  f.prototype = 1;
  o instanceof f;
}, "Function has non-object prototype '1' in instanceof check", TypeError);

// kInvalidInOperatorUse
test(function() {
  1 in 1;
}, "Cannot use 'in' operator to search for '1' in 1", TypeError);

// kIteratorResultNotAnObject
test(function() {
  var obj = {};
  obj[Symbol.iterator] = function() { return { next: function() { return 1 }}};
  Array.from(obj);
}, "Iterator result 1 is not an object", TypeError);

// kIteratorValueNotAnObject
test(function() {
  new Map([1]);
}, "Iterator value 1 is not an entry object", TypeError);

// kNotAPromise
test(function() {
  Promise.prototype.chain.call(1);
}, "1 is not a promise", TypeError);

// kNotConstructor
test(function() {
  new Symbol();
}, "Symbol is not a constructor", TypeError);

// kNotGeneric
test(function() {
  String.prototype.toString.call(1);
}, "String.prototype.toString is not generic", TypeError);

test(function() {
  String.prototype.valueOf.call(1);
}, "String.prototype.valueOf is not generic", TypeError);

test(function() {
  Boolean.prototype.toString.call(1);
}, "Boolean.prototype.toString is not generic", TypeError);

test(function() {
  Boolean.prototype.valueOf.call(1);
}, "Boolean.prototype.valueOf is not generic", TypeError);

test(function() {
  Number.prototype.toString.call({});
}, "Number.prototype.toString is not generic", TypeError);

test(function() {
  Number.prototype.valueOf.call({});
}, "Number.prototype.valueOf is not generic", TypeError);

test(function() {
  Function.prototype.toString.call(1);
}, "Function.prototype.toString is not generic", TypeError);

// kNotTypedArray
test(function() {
  Uint16Array.prototype.forEach.call(1);
}, "this is not a typed array.", TypeError);

// kObjectGetterExpectingFunction
test(function() {
  ({}).__defineGetter__("x", 0);
}, "Object.prototype.__defineGetter__: Expecting function", TypeError);

// kObjectGetterCallable
test(function() {
  Object.defineProperty({}, "x", { get: 1 });
}, "Getter must be a function: 1", TypeError);

// kObjectSetterExpectingFunction
test(function() {
  ({}).__defineSetter__("x", 0);
}, "Object.prototype.__defineSetter__: Expecting function", TypeError);

// kObjectSetterCallable
test(function() {
  Object.defineProperty({}, "x", { set: 1 });
}, "Setter must be a function: 1", TypeError);

// kPropertyDescObject
test(function() {
  Object.defineProperty({}, "x", 1);
}, "Property description must be an object: 1", TypeError);

// kPropertyNotFunction
test(function() {
  Set.prototype.add = 0;
  new Set(1);
}, "Property 'add' of object #<Set> is not a function", TypeError);

// kProtoObjectOrNull
test(function() {
  Object.setPrototypeOf({}, 1);
}, "Object prototype may only be an Object or null: 1", TypeError);

// kRedefineDisallowed
test(function() {
  "use strict";
  var o = {};
  Object.defineProperty(o, "x", { value: 1, configurable: false });
  Object.defineProperty(o, "x", { value: 2 });
}, "Cannot redefine property: x", TypeError);

// kReduceNoInitial
test(function() {
  [].reduce(function() {});
}, "Reduce of empty array with no initial value", TypeError);

// kResolverNotAFunction
test(function() {
  new Promise(1);
}, "Promise resolver 1 is not a function", TypeError);

// kSymbolToPrimitive
test(function() {
  1 + Object(Symbol());
}, "Cannot convert a Symbol wrapper object to a primitive value", TypeError);

// kSymbolToString
test(function() {
  "" + Symbol();
}, "Cannot convert a Symbol value to a string", TypeError);

// kSymbolToNumber
test(function() {
  1 + Symbol();
}, "Cannot convert a Symbol value to a number", TypeError);

// kUndefinedOrNullToObject
test(function() {
  Array.prototype.toString.call(null);
}, "Cannot convert undefined or null to object", TypeError);

// kValueAndAccessor
test(function() {
  Object.defineProperty({}, "x", { get: function(){}, value: 1});
}, "Invalid property.  A property cannot both have accessors and be " +
   "writable or have a value, #<Object>", TypeError);

// kWithExpression
test(function() {
  with (null) {}
}, "null has no properties", TypeError);

// kWrongArgs
test(function() {
  (function() {}).apply({}, 1);
}, "Function.prototype.apply: Arguments list has wrong type", TypeError);

test(function() {
  Reflect.apply(function() {}, {}, 1);
}, "Reflect.apply: Arguments list has wrong type", TypeError);

test(function() {
  Reflect.construct(function() {}, 1);
}, "Reflect.construct: Arguments list has wrong type", TypeError);


//=== SyntaxError ===

test(function() {
  new Function(")", "");
}, "Function arg string contains parenthesis", SyntaxError);


// === RangeError ===

// kArrayLengthOutOfRange
test(function() {
  "use strict";
  Object.defineProperty([], "length", { value: 1E100 });
}, "defineProperty() array length out of range", RangeError);

// kInvalidArrayBufferLength
test(function() {
  new ArrayBuffer(-1);
}, "Invalid array buffer length", RangeError);

// kInvalidArrayLength
test(function() {
  [].length = -1;
}, "Invalid array length", RangeError);

// kInvalidCodePoint
test(function() {
  String.fromCodePoint(-1);
}, "Invalid code point -1", RangeError);

// kInvalidCountValue
test(function() {
  "a".repeat(-1);
}, "Invalid count value", RangeError);

// kInvalidArrayBufferLength
test(function() {
  new Uint16Array(-1);
}, "Invalid typed array length", RangeError);

// kNormalizationForm
test(function() {
  "".normalize("ABC");
}, "The normalization form should be one of NFC, NFD, NFKC, NFKD.", RangeError);

// kNumberFormatRange
test(function() {
  Number(1).toFixed(100);
}, "toFixed() digits argument must be between 0 and 20", RangeError);

test(function() {
  Number(1).toExponential(100);
}, "toExponential() argument must be between 0 and 20", RangeError);

// kStackOverflow
test(function() {
  function f() { f(Array(1000)); }
  f();
}, "Maximum call stack size exceeded", RangeError);

// kToPrecisionFormatRange
test(function() {
  Number(1).toPrecision(100);
}, "toPrecision() argument must be between 1 and 21", RangeError);

// kToPrecisionFormatRange
test(function() {
  Number(1).toString(100);
}, "toString() radix argument must be between 2 and 36", RangeError);


// === URIError ===

// kURIMalformed
test(function() {
  decodeURI("%%");
}, "URI malformed", URIError);