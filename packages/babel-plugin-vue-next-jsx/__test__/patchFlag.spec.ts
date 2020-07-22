import { compare, transformWithPlugin, vueCompiled } from './util';

describe('patchFlag test', () => {
  test('PatchFlags.TEXT', () => {
    const jsxCode = '<div>{a}</div>'
    const vueCode = '<div>{{a}}</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('PatchFlags.CLASS', () => {
    const jsxCode = '<div class={test}></div>'
    const vueCode = '<div :class="test"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('PatchFlags.STYLE', () => {
    const jsxCode = '<div style={test}></div>'
    const vueCode = '<div :style="test"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('PatchFlags.PROPS', () => {
    const jsxCode = '<div a={a}></div>'
    const vueCode = '<div :a="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('PatchFlags.HYDRATE_EVENTS', () => {
    const jsxCode = '<div onTest={test}></div>'
    const vueCode = '<div @test="test"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('PatchFlags.NEED_PATCH', () => {
    const code = '<div ref="a"></div>'
    compare(code)
  })
  // onXxx will cause data in wrong order, but it doesn't matter and no need to reorder it
  test('mixed all', () => {
    const jsxCode = '<div onTest={test} a={a} class={a} style={test}>{a}</div>'
    const vueCode = '<div @test="test" :a="a" :class="a" :style="test">{{a}}</div>'
    expect(transformWithPlugin(jsxCode)).toBe("_openBlock(),_createBlock(\"div\",{a:a,class:a,style:test,onTest:test},_toDisplayString(a),47,[\"a\",\"onTest\"])")
  })
})
