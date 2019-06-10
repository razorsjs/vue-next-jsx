"use strict";

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

var obj = {};

if ((0, _babelPluginSafeObject.safeGet)(obj, ["a", "b", "length"]) === 0) {
  (0, _babelPluginSafeObject.safeGet)(console, ["log"])('safeGet length');
}