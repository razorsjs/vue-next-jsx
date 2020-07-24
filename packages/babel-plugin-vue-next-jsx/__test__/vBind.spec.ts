import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-bind', () => {
  test('Base dom component with v-bind', () => {
    const jsxCode = '<div foo={23} bar={32}></div>'
    const vueCode = '<div :foo="23" :bar="32"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('Base dom component with spread', () => {
    const jsxCode = '<div a={123} b={test} c="123" {...d}></div>'
    // const vueCode = '<div :foo="23" :bar="32"></div>'
    expect(transformWithPlugin(jsxCode)).toBe('_openBlock(),_createBlock("div",_mergeProps({a:123},{b:test},{c:"123"},{...d}),null,8,["b"])')
  })
  test('dynamic key ', () => {
    const jsxCode = `<div v-bind={[dynamic, a]}></div>`
    const vueCode = '<div :[dynamic]="a"></div>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('v-bind="obj" after static prop ', () => {
    const jsxCode = `<div id="foo" v-bind={obj} />`
    const vueCode = '<div id="foo" v-bind="obj" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('v-bind="obj" before static prop ', () => {
    const jsxCode = `<div v-bind={obj} id="foo" />`
    const vueCode = '<div v-bind="obj" id="foo" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('v-bind="obj" between static props ', () => {
    const jsxCode = `<div id="foo" v-bind={obj} class="bar" />`
    const vueCode = '<div id="foo" v-bind="obj" class="bar" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
