import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-show test', () => {
  test('Base dom component with v-show', () => {
    const jsxCode = '<div v-show={a}></div>'
    const vueCode = '<div v-show="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base component with v-show', () => {
    const jsxCode = '<test v-show={a}></test>'
    const vueCode = '<test v-show="a"></test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
