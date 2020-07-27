import { transformWithPlugin, vueCompiled } from './util';

describe('Use jsx with custom directive', () => {
  test('base directives with dom', () => {
    const jsxCode = '<div v-a={onTest}>hello world</div>'
    const vueCode = '<div v-a="onTest">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('base directives with camel case', () => {
    const jsxCode = '<div vA={onTest}>hello world</div>'
    const vueCode = '<div v-a="onTest">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('runtime directives', () => {
    const jsxCode = `<div v-foo v-bar={x} v-baz={[arg,y,['mod','mad']]}/>`
    const vueCode = '<div v-foo v-bar="x" v-baz:[arg].mod.mad="y" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
