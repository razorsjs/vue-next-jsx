"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _dist = require("../../../dist");

function f() {
  var obj = {};
  var undef = (0, _dist.safeGet)(obj, ["a", "b"]);
  var obj1 = {};
  var undef1 = (0, _dist.safeGet)(obj1, ["x", "y"]);
}