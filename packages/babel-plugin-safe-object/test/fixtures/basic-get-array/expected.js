"use strict";

var _dist = require("../../../dist");

var obj = {};

if ((0, _dist.safeGet)(obj, ["a", "b", "length"]) === 0) {
  (0, _dist.safeGet)(console, ["log"])('safeGet length');
}