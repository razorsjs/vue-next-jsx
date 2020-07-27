import { transformWithPlugin, vueCompiled } from './util';

// copied from @vue/compiler-dom
describe('vOn', () => {
  describe('vOn: core', ()=> {
    test('basic', () => {
      const jsxCode = '<div onClick={onClick}/>'
      const vueCode = '<div @click="onClick"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should wrap as function if expression is inline statement', () => {
      const jsxCode = '<div onClick={i++}/>'
      const vueCode = '<div @click="i++"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    // multiple in jsx is not supported, so use one function instead of it
    test('should handle multiple inline statement', () => {
      const jsxCode = '<div onClick={foo()}/>'
      const vueCode = '<div @click="foo()"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('inline statement w/ prefixIdentifiers: true', () => {
      const jsxCode = '<div onClick={foo($event)}/>'
      const vueCode = '<div @click="foo($event)"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should NOT wrap as function if expression is already function expression', () => {
      const jsxCode = '<div onClick={$event => foo($event)}/>'
      const vueCode = '<div @click="$event => foo($event)"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should NOT wrap as function if expression is complex member expression', () => {
      const jsxCode = `<div onClick={a['b' + c]}/>`
      const vueCode = `<div @click="a['b' + c]"/>`
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should NOT error if no expression but has modifier', () => {
      const jsxCode = `<div onClick={a['b' + c]}/>`
      const vueCode = `<div @click="a['b' + c]"/>`
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should NOT error if no expression but has modifier', () => {
      const jsxCode = `<div onVnodeMounted={onMount}/>`
      const vueCode = `<div v-on:vnode-mounted="onMount"/>`
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    // TODO: no exp cacheHandler <div v-on:click.prevent />
  })
  describe('vOn: dom', () => {
    test('should support multiple modifiers w/ prefixIdentifiers: true', () => {
      const jsxCode = '<div onClick={[test, ["stop", "prevent"]]}/>'
      const vueCode = '<div @click.stop.prevent="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should support multiple events and modifiers options w/ prefixIdentifiers: true', () => {
      const jsxCode = '<div onClick={[test,["stop"]]} onKeyup={[test,["enter"]]}/>'
      const vueCode = '<div @click.stop="test" @keyup.enter="test" />'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should support multiple modifiers and event options w/ prefixIdentifiers: true', () => {
      const jsxCode = '<div onClick={[test,["stop","capture", "once"]]}/>'
      const vueCode = '<div @click.stop.capture.once="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should support multiple modifiers and event options w/ prefixIdentifiers: true', () => {
      const jsxCode = '<div onKeydown={[test,["stop","capture", "ctrl", "a"]]}/>'
      const vueCode = '<div @keydown.stop.capture.ctrl.a="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should not wrap keys guard if no key modifier is present', () => {
      const jsxCode = '<div onKeyup={[test,["exact"]]}/>'
      const vueCode = '<div @keyup.exact="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should wrap keys guard for static key event w/ left/right modifiers', () => {
      const jsxCode = '<div onKeyup={[test,["left"]]}/>'
      const vueCode = '<div @keyup.left="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should wrap keys guard for static key event w/ left/right modifiers', () => {
      const jsxCode = '<div v-on={[e,test,["left"]]}/>'
      const vueCode = '<div @[e].left="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should wrap keys guard for static key event w/ left/right modifiers', () => {
      const jsxCode = '<div onKeyup={[test,["enter"]]}/>'
      const vueCode = '<div @keyup.enter="test"/>'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('should transform click.right', () => {
      const jsxCode1 = '<div onClick={[test,["right"]]}/>'
      const vueCode1 = '<div @click.right="test"/>'

      const jsxCode2 = '<div v-on={[event,test,["right"]]}/>'
      const vueCode2 = '<div @[event].right="test"/>'
      expect(transformWithPlugin(jsxCode1)).toBe(vueCompiled(vueCode1))
      expect(transformWithPlugin(jsxCode2)).toBe(vueCompiled(vueCode2))
    })
    test('should transform click.middle', () => {
      const jsxCode1 = '<div onClick={[test,["middle"]]}/>'
      const vueCode1 = '<div @click.middle="test"/>'

      const jsxCode2 = '<div v-on={[event,test,["middle"]]}/>'
      const vueCode2 = '<div @[event].middle="test"/>'
      expect(transformWithPlugin(jsxCode1)).toBe(vueCompiled(vueCode1))
      expect(transformWithPlugin(jsxCode2)).toBe(vueCompiled(vueCode2))
    })
    // TODO: cache handlers
  })
})
