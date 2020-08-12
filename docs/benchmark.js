(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/dist/templateLoader.js??ref--6!./node_modules/vue-loader/dist??ref--12-0!./site/pages/benchmark/index.vue?vue&type=template&id=42337e53

function render(_ctx, _cache) {
  return Object(runtime_core_esm_bundler["r" /* openBlock */])(), Object(runtime_core_esm_bundler["e" /* createBlock */])(runtime_core_esm_bundler["b" /* Fragment */], null, [Object(runtime_core_esm_bundler["i" /* createVNode */])("button", {
    onClick: _cache[1] || (_cache[1] = function () {
      return _ctx.shuffle.apply(_ctx, arguments);
    })
  }, "click"), (Object(runtime_core_esm_bundler["r" /* openBlock */])(true), Object(runtime_core_esm_bundler["e" /* createBlock */])(runtime_core_esm_bundler["b" /* Fragment */], null, Object(runtime_core_esm_bundler["t" /* renderList */])(_ctx.data, function (item) {
    return Object(runtime_core_esm_bundler["r" /* openBlock */])(), Object(runtime_core_esm_bundler["e" /* createBlock */])("div", null, Object(shared_esm_bundler["G" /* toDisplayString */])(item), 1
    /* TEXT */
    );
  }), 256
  /* UNKEYED_FRAGMENT */
  ))], 64
  /* STABLE_FRAGMENT */
  );
}
// CONCATENATED MODULE: ./site/pages/benchmark/index.vue?vue&type=template&id=42337e53

// EXTERNAL MODULE: ./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var reactivity_esm_bundler = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/dist??ref--12-0!./site/pages/benchmark/index.vue?vue&type=script&lang=js

var arr = [];

for (var i = 0; i < 100000; i++) {
  arr.push(i);
}

/* harmony default export */ var benchmarkvue_type_script_lang_js = ({
  name: "index",
  setup: function setup() {
    var data = Object(reactivity_esm_bundler["h" /* reactive */])(arr);
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

    return {
      data: data,
      shuffle: shuffle
    };
  }
});
// CONCATENATED MODULE: ./site/pages/benchmark/index.vue?vue&type=script&lang=js
 
// CONCATENATED MODULE: ./site/pages/benchmark/index.vue



benchmarkvue_type_script_lang_js.render = render

/* harmony default export */ var benchmark = __webpack_exports__["default"] = (benchmarkvue_type_script_lang_js);

/***/ })

}]);