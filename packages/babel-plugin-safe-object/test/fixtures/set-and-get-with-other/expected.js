"use strict";

var _dist = require("../../../dist");

function SuperClass() {
  (0, _dist.safeSet)(this, ["x"], {});
}

var undef = (0, _dist.safeGet)(new SuperClass(), ["x", "y"]);
var undef1 = (0, _dist.safeGet)(new Map(), ["x", "y"]);
