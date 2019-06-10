// https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/global.js
const O = 'object';
const check = function (it: any) {
  return it && it.Math == Math && it;
};

export default
  check(typeof globalThis == O && globalThis) ||
  check(typeof window == O && window) ||
  check(typeof self == O && self) ||
  check(typeof global == O && global) ||
  Function('return this')();
