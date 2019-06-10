"use strict";

var _babelPluginSafeObject = require("@razors/babel-plugin-safe-object");

function SuperClass() {
  (0, _babelPluginSafeObject.safeSet)(this, ["x"], {});
}

var undef = (0, _babelPluginSafeObject.safeGet)(new SuperClass(), ["x", "y"]);
var undef1 = (0, _babelPluginSafeObject.safeGet)(new Map(), ["x", "y"]);