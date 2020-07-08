import { compare, transformWithPlugin, vueCompiled } from './util';

describe('Use jsx with variable', () => {
  test('jsx with dynamic class', () => {
    const jsxCode = '<test class={test}>hello world</test>'
    const vueCode = '<test :class="test">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('jsx with static class', () => {
    const jsxCode = '<test class={"test"}>hello world</test>'
    const vueCode = '<test class="test">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
