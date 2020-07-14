import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-html', () => {
  test('Base dom component with v-html', () => {
    const jsxCode = '<div v-html={23}></div>'
    const vueCode = '<div v-html="23"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base dom component with v-html variable', () => {
    const jsxCode = '<div v-html={a}></div>'
    const vueCode = '<div v-html="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
