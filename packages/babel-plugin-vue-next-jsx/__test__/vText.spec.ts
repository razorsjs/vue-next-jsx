import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-test test', () => {
  test('Base dom component with v-text', () => {
    const jsxCode = '<div v-text={23}></div>'
    const vueCode = '<div v-text="23"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base dom component with v-text variable', () => {
    const jsxCode = '<div v-text={a}></div>'
    const vueCode = '<div v-text="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
