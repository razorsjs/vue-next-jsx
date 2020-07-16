import { compare, transformWithPlugin, vueCompiled } from './util';

describe('v-slot', () => {
  test('v-slot with default and header', () => {
    const jsxCode = '<layout>{{header:()=><h1>Here might be a page title</h1>,default:()=><h1>Here might be a page title</h1>}}</layout>'
    const vueCode = '<layout><h1>Here might be a page title</h1><template v-slot:header><h1>Here might be a page title</h1></template></layout>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
})
