import { compare, transformWithPlugin, vueCompiled } from './util';

describe('compiler: style transform', () => {
  test('should transform into object', () => {
    const code = '<div style="color: red"/>'
    expect(transformWithPlugin(code)).toBe(vueCompiled(code))
  })
  test('should transform into object', () => {
    const jsxCode = `<div style={{color: 'green'}}></div>`
    const vueCode = `<div :style="{color: 'green'}"></div>`
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
