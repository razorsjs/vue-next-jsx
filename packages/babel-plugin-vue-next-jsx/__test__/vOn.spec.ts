import { transformWithPlugin, vueCompiled } from './util';

describe('Use jsx with event', () => {
  test('base event with dom', () => {
    const jsxCode = '<div onTest={onTest}>hello world</div>'
    const vueCode = '<div @test="onTest">hello world</div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  test('base event with component', () => {
    const jsxCode = '<test onTest={onTest}>hello world</test>'
    const vueCode = '<test @test="onTest">hello world</test>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
