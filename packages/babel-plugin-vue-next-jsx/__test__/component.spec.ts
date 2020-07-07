import {compare, vueCompiled, transformWithPlugin} from './util'

describe('Base components use', () => {
  test('Base components', () => {
    const code = '<test>hello world</test>'
    compare(code)
  })
  test('Base components with props', () => {
    const jsxCode = '<test testProps={test}>hello world</test>'
    const vueCode = '<test :testProps="test">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
