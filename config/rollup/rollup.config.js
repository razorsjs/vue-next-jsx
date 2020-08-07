const rollupConfigure = require('@razors/build-rollup')
const VueNextJsx = require('../../packages/babel-plugin-vue-next-jsx/package.json')
const VueNextUnwrapRef = require('../../packages/babel-plugin-vue-next-unwrap-ref/package.json')

const external = ['@vue/shared', '@vue/compiler-dom', '@vue/compiler-core']

export default [
  rollupConfigure(VueNextJsx, {
    target: 'cjs',
    external
  }),
  rollupConfigure(VueNextJsx, {
    input: 'runtime/index.ts',
    output: 'runtime.js',
    target: 'es',
    external: ['@vue/runtime-core']
  }),
  rollupConfigure(VueNextUnwrapRef, {
    target: 'cjs',
    external
  })
]
