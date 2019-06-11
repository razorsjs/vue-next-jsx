"use strict";

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

var obj = {};

if ((0, _babelPluginSafeObject.safeGet)(obj, ["a", "b", "length"]) === 0) {
  console.log('safeGet length');
}

var arr = [];
(0, _babelPluginSafeObject.safeGet)(arr, [0, 1]);