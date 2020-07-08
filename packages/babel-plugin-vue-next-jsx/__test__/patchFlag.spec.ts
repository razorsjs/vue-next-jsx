import { compare, transformWithPlugin, vueCompiled } from './util';

describe('Use jsx with variable', () => {
  test('jsx with dynamic class', () => {
    const jsxCode = '<test class={test}>hello world</test>'
    const vueCode = '<test :class="test">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('jsx with dynamic style', () => {
    const jsxCode = '<test style={test}>hello world</test>'
    const vueCode = '<test :style="test">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('jsx with dynamic text', () => {
    const jsxCode = '<test>{test}</test>'
    const vueCode = '<test>{{test}}</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
