"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

var obj = {};
(0, _helper.safeSet)(obj, ["a", "b"], 1);
var y = (0, _helper.safeGet)(obj, ["x", "y"]);
(0, _helper.safeSet)(a, ["b", "c"], (0, _helper.safeGet)(z, ["x", "c"]));