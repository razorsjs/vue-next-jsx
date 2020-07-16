// not real v-for...

import { compare, transformWithPlugin, vueCompiled } from './util';

describe('Base jsx use', () => {
  test('Base jsx with variable', () => {
    const jsxCode = '<div><span>1</span><span>2</span></div>'
    const _jsxCode = '<div>{[<span>1</span>, <span>2</span>]}</div>'
    expect(transformWithPlugin(_jsxCode)).toBe(transformWithPlugin(jsxCode))
  })
})
