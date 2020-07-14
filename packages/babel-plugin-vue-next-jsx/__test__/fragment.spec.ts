import { compare, transformWithPlugin, vueCompiled } from './util';

describe('fragment test', () => {
  test('base use', () => {
    const jsxCode = '<><div>a</div><div>b</div></>'
    const vueCode = '<div>a</div><div>b</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  // test('base use with array', () => {
  //   const jsxCode = '[<div>a</div>, <div>b</div>]'
  //   const vueCode = '<div>a</div><div>b</div>'
  //   expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  // })
})
