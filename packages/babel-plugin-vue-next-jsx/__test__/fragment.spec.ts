import { compare, transformWithPlugin, vueCompiled } from './util';

describe('fragment', () => {
  test('base use', () => {
    const jsxCode = '<><div>a</div><div>b</div></>'
    const vueCode = '<div>a</div><div>b</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('fragment mix', () => {
    const jsxCode = '<>{d}<div>a</div>s</>'
    const vueCode = '{{d}}<div>a</div>s'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
