"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

function SuperClass() {
  (0, _helper.safeSet)(new SuperClass(), ["x", "y", "x"], {});
}

var undef = new SuperClass().x.y;
var undef1 = (0, _helper.safeGet)(new Map(), ["x", "y"]);