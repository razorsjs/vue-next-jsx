import {compare, vueCompiled, transformWithPlugin} from './util'

describe('Base components use', () => {
  test('Base components', () => {
    const code = '<test></test>'
    compare(code)
  })
  test('Base components not camel', () => {
    const code = '<base-layout></base-layout>'
    expect(transformWithPlugin(code)).toBe('_openBlock(),_createBlock(BaseLayout)')
  })
  test('Base components with default slot', () => {
    const code = '<test>hello world</test>'
    compare(code)
  })
  test('Base components with dom children', () => {
    const code = '<test><div>hello world</div></test>'
    compare(code)
  })
  test('Nested components with default slot', () => {
    const code = '<test><test1><div>123</div></test1></test>'
    compare(code)
  })
  test('Base components with props and events', () => {
    const jsxCode = '<test testProps={test} onTestEvent={test}></test>'
    const vueCode = '<test :testProps="test" @testEvent="test"></test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
