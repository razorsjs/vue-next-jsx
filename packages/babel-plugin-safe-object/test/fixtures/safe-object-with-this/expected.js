"use strict";

var _helper = require("@razors/babel-plugin-safe-object/dist/helper");

function f() {
  this.n.z;
  this.a.b++;
  var m = (0, _helper.safeGet)(x, ["y", "z"]);
  m++;
}