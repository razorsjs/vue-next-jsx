import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-bind', () => {
  test('Base dom component with v-bind', () => {
    const jsxCode = '<div foo={23} bar={32}></div>'
    const vueCode = '<div :foo="23" :bar="32"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base dom component with spread', () => {
    const jsxCode = '<div a={123} b={test} c="123" {...d}></div>'
    // const vueCode = '<div :foo="23" :bar="32"></div>'
    expect(transformWithPlugin(jsxCode)).toBe('_openBlock(),_createBlock("div",_mergeProps({a:123},{b:test},{c:"123"},{...d}),null,8,["b"])')
  })
})
