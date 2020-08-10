/**
 * Vue use fragment(by renderSlot) to implement slot, but we not. So the [] in slot is removed.
 */

import {compare, vueCompiled, transformWithPlugin} from './util'

describe('Base components use', () => {
  test('Base components', () => {
    const code = '<test></test>'
    compare(code)
  })
  test('Base components not camel', () => {
    const code = '<base-layout></base-layout>'
    compare(code)
  })
  test('Base components with default slot', () => {
    const code = '<test>hello world</test>'
    expect(transformWithPlugin(code)).toBe(`_openBlock(),_createBlock(_component_test,null,{default:()=>_createTextVNode("helloworld"),_:1})`)
  })
  test('Base components with dom children', () => {
    const code = '<test><div>hello world</div></test>'
    expect(transformWithPlugin(code)).toBe(`_openBlock(),_createBlock(_component_test,null,{default:()=>_createVNode("div",null,"helloworld"),_:1})`)
  })
  test('Nested components with default slot', () => {
    const code = '<test><test1><div>123</div></test1></test>'
    expect(transformWithPlugin(code)).toBe(`_openBlock(),_createBlock(_component_test,null,{default:()=>_createVNode(_component_test1,null,{default:()=>_createVNode("div",null,"123"),_:1}),_:1})`)
  })
  test('Base components with props and events', () => {
    const jsxCode = '<test testProps={test} onTestEvent={test}></test>'
    const vueCode = '<test :testProps="test" @testEvent="test"></test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
