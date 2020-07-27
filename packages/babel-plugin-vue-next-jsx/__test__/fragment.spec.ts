import { compare, transformWithPlugin, vueCompiled } from './util';

describe('fragment', () => {
  test('base use', () => {
    const jsxCode = '<><div>a</div><div>b</div></>'
    const vueCode = '<div>a</div><div>b</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('text between elements (static)', () => {
    const jsxCode = '<><div/>hello<div/></>'
    const vueCode = '<div/>hello<div/>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('text between elements (static)', () => {
    const jsxCode = '<><div/>{ foo } bar { baz }<div/></>'
    const vueCode = '<div/>{{ foo }} bar {{ baz }}<div/>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('consecutive text mixed with elements', () => {
    const jsxCode = '<><div/>{ foo } bar { baz }<div/>hello<div/></>'
    const vueCode = '<div/>{{ foo }} bar {{ baz }}<div/>hello<div/>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
