"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

function f() {
  var obj = {};
  var undef = (0, _babelPluginSafeObject.safeGet)(obj, ["a", "b"]);
  var obj1 = {};
  var undef1 = (0, _babelPluginSafeObject.safeGet)(obj1, ["x", "y"]);
}