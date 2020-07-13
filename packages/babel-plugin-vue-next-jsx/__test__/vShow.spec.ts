import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-show test', () => {
  test('Base dom component with v-show', () => {
    const jsxCode = '<div v-show={a}></div>'
    const vueCode = '<div v-show="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
