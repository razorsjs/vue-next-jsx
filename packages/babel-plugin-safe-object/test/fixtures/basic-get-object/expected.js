"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

var obj = {};
var undef = (0, _helper.safeGet)(obj, ["a", "b"]);