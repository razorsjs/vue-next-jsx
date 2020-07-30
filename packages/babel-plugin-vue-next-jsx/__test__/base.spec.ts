import { compare, transformWithPlugin, vueCompiled } from './util';

describe('Base jsx use', () => {
  test('Base jsx', () => {
    const code = '<div>hello world</div>'
    compare(code)
  })
  test('Base jsx with simple tag', () => {
    const code = '<div/>'
    compare(code)
  })
  test('Base jsx with variable text', () => {
    const jsxCode = '<div>{a}</div>'
    const vueCode = '<div>{{a}}</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base jsx with variable number', () => {
    const jsxCode = '<div>{1}</div>'
    const vueCode = '<div>{{1}}</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base jsx with one children', () => {
    const code = '<div><span>hello world</span></div>'
    compare(code)
  })
  test('Base jsx with mixed children', () => {
    const jsxCode = '<div><span>test</span>{a}</div>'
    const vueCode = '<div><span>test</span>{{a}}</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('<svg> should be forced into blocks', () => {
    const code = '<div><svg></svg></div>'
    compare(code)
  })
  test('element with dynamic keys should be forced into blocks', () => {
    const jsxCode = '<div><div key={foo} /></div>'
    const vueCode = '<div><div :key="foo" /></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
