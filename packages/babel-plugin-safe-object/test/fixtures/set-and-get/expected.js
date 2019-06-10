"use strict";

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

var obj = {};
(0, _babelPluginSafeObject.safeSet)(obj, ["a", "b"], 1);
var y = (0, _babelPluginSafeObject.safeGet)(obj, ["x", "y"]);
(0, _babelPluginSafeObject.safeSet)(a, ["b", "c"], (0, _babelPluginSafeObject.safeGet)(z, ["x", "c"]));