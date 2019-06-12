"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

var obj = {};

if ((0, _helper.safeGet)(obj, ["a", "b", "length"]) === 0) {
  console.log('safeGet length');
}

var arr = [];
(0, _helper.safeGet)(arr, [0, 1]);