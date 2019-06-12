"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

function SuperClass() {
  this.x = {};
}

var undef = (0, _helper.safeGet)(new SuperClass(), ["x", "y"]);
var undef1 = (0, _helper.safeGet)(new Map(), ["x", "y"]);