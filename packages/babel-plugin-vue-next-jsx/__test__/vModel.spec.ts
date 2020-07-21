import { compare, transformWithPlugin, vueCompiled } from './util';
import {DOMErrorCodes} from '@vue/compiler-dom'

// copied from @vue/compiler-dom
describe('compiler: transform v-model', () => {
  test('simple expression', () => {
    const jsxCode = '<input v-model={model}/>'
    const vueCode = '<input v-model="model"/>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for input (text)', () => {
    const jsxCode = '<input type="text" v-model={model} />'
    const vueCode = '<input type="text" v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for input (radio)', () => {
    const jsxCode = '<input type="radio" v-model={model} />'
    const vueCode = '<input type="radio" v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for input (checkbox)', () => {
    const jsxCode = '<input type="checkbox" v-model={model} />'
    const vueCode = '<input type="checkbox" v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for input (dynamic type)', () => {
    const jsxCode = '<input type={foo} v-model={model} />'
    const vueCode = '<input :type="foo" v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  // TODO: v-bind
  test('input w/ dynamic v-bind', () => {
    const jsxCode = '<input type={foo} v-model={model} />'
    const vueCode = '<input v-bind="obj" v-model="model" />'
    // expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for select', () => {
    const jsxCode = '<select v-model={model} />'
    const vueCode = '<select v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('simple expression for textarea', () => {
    const jsxCode = '<textarea v-model={model} />'
    const vueCode = '<textarea v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('model on component', () => {
    const jsxCode = '<test v-model={model} />'
    const vueCode = '<test v-model="model" />'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })

  describe('errors', () => {
    test('invalid element', () => {
      const onError = jest.fn()
      transformWithPlugin('<span v-model={model} />', { onError })

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: DOMErrorCodes.X_V_MODEL_ON_INVALID_ELEMENT
        })
      )
    })
    test('should raise error if used file input element', () => {
      const onError = jest.fn()
      transformWithPlugin(`<input type="file" v-model="test"/>`, {
        onError
      })
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: DOMErrorCodes.X_V_MODEL_ON_FILE_INPUT_ELEMENT
        })
      )
    })
  })

  describe('modifiers', () => {
    test('.number', () => {
      const jsxCode = `<input v-model={[null,model,['number']]} />`
      const vueCode = '<input v-model.number="model" />'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('.trim', () => {
      const jsxCode = `<test v-model={[null,model,['trim']]} />`
      const vueCode = '<test v-model.trim="model" />'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
    test('.lazy', () => {
      const jsxCode = `<test v-model={['foo',model,['lazy']]} />`
      const vueCode = '<test v-model:foo.lazy="model" />'
      expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
    })
  })
})
