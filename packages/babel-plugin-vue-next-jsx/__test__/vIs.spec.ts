import { transformWithPlugin, vueCompiled, compare } from './util';

describe('v-is (dynamic component)', () => {
  test('static binding', () => {
    const code = '<component is="foo" />'
    compare(code)
  })
  test('dynamic binding', () => {
    const jsxCode = '<component is={foo.value} />'
    const vueCode = '<component :is="foo.value" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('v-is', () => {
    const jsxCode = `<div v-is={'foo'} />`
    const vueCode = `<div v-is="'foo'" />`
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
