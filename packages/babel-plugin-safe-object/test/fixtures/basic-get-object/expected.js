"use strict";

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

var obj = {};
var undef = (0, _babelPluginSafeObject.safeGet)(obj, ["a", "b"]);