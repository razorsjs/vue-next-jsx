import { transformWithPlugin, vueCompiled } from './util';

describe('vOn', () => {
  test('normal use', () => {
    const jsxCode = '<div onTest={onTest}>hello world</div>'
    const vueCode = '<div @test="onTest">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('normal use with modifiers', () => {
    const jsxCode = '<div onTest={[onTest,["stop", "prevent"]]}>hello world</div>'
    const vueCode = '<div @test.stop.prevent="onTest">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('normal with component', () => {
    const jsxCode = '<test onTest={onTest}>hello world</test>'
    const vueCode = '<test @test="onTest">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('use v-on', () => {
    const jsxCode = '<test v-on={["click", onTest]}>hello world</test>'
    const vueCode = '<test v-on:click="onTest">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('use v-on with modifiers', () => {
    const jsxCode = '<test v-on={["click", onTest, ["stop", "prevent"]]}>hello world</test>'
    const vueCode = '<test v-on:click.stop.prevent="onTest">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
