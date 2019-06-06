"use strict";

var _dist = require("../../../dist");

var obj = {};
(0, _dist.safeSet)(obj, ["a", "b"], 1);
var y = (0, _dist.safeGet)(obj, ["x", "y"]);