import { transformWithPlugin, vueCompiled, compare } from './util';

describe('v-is', () => {
  test('base event with dom', () => {
    const jsxCode = '<div v-is={a}>hello world</div>'
    const vueCode = '<div v-is="a">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('base event with dom', () => {
    const jsxCode = '<component is={a}>hello world</component>'
    const vueCode = '<component :is="a">hello world</component>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
