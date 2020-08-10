(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[5],{

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/dist??ref--12-0!./site/pages/benchmark/jsx.vue?vue&type=script&lang=jsx

var arr = [];

for (var i = 0; i < 100000; i++) {
  arr.push(i);
}

/* harmony default export */ var jsxvue_type_script_lang_jsx = ({
  name: "index",
  setup: function setup() {
    var data = Object(reactivity_esm_bundler["k" /* reactive */])(arr);
    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */

    function _shuffle(a) {
      for (var _i = a.length - 1; _i > 0; _i--) {
        var j = Math.floor(Math.random() * (_i + 1));
        var _ref = [a[j], a[_i]];
        a[_i] = _ref[0];
        a[j] = _ref[1];
      }

      return a;
    }

    var shuffle = function shuffle() {
      return _shuffle(data);
    };

    return function () {
      return [Object(runtime_core_esm_bundler["v" /* createVNode */])("button", {
        onClick: shuffle
      }, "click", 8, ["onClick"]), data.map(function (item) {
        return Object(runtime_core_esm_bundler["Y" /* openBlock */])(), Object(runtime_core_esm_bundler["o" /* createBlock */])("div", null, Object(shared_esm_bundler["G" /* toDisplayString */])(item), 1);
      })];
    };
  }
});
// CONCATENATED MODULE: ./site/pages/benchmark/jsx.vue?vue&type=script&lang=jsx
 
// CONCATENATED MODULE: ./site/pages/benchmark/jsx.vue



/* harmony default export */ var jsx = __webpack_exports__["default"] = (jsxvue_type_script_lang_jsx);

/***/ })

}]);