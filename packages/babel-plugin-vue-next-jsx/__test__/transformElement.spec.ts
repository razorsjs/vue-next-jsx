import { compare, transformWithPlugin, vueCompiled } from './util';

describe('compiler: element transform', () => {
  test('props merging: style', () => {
    const jsxCode = `<div style="color: green" style={ {color: 'red' }} />`
    const vueCode = `<div style="color: green" :style="{ color: 'red' }" />`
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('props merging: class', () => {
    const jsxCode = `<div class="foo" class={{ bar: isBar }} />`
    const vueCode = `<div class="foo" :class="{ bar: isBar }" />`
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('props not merging: event handlers', () => {
    const jsxCode = '<div onClick={[a, ["stop"]]}  onClick={[b, ["prevent"]]}/>'
    const vueCode = '<div @click.stop="a" @click.prevent="b" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('props merging: event handlers', () => {
    const jsxCode = '<div onClick={[a, ["foo"]]}  onClick={[b, ["bar"]]}/>'
    const vueCode = '<div @click.foo="a" @click.bar="b" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
