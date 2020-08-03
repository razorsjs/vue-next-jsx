import { compare, transformWithPlugin, vueCompiled } from './util';

/**
 * We don't know jsx relation, so add __children to tell plugin that I'm a child.
 */
describe('v-slot', () => {
  test('v-slot with default and header', () => {
    const jsxCode = `<layout>
                        {
                            {
                                header:()=><h1 __children>Here might be a page title</h1>,
                                default:()=><h1 __children>Here might be a page title</h1>
                            }
                        }
                     </layout>`
    const vueCode = '<layout><h1>Here might be a page title</h1><template v-slot:header><h1>Here might be a page title</h1></template></layout>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('default slot', () => {
    const jsxCode = `<layout>
                        {
                            () => <h1 __children>Here might be a page title</h1>
                        }
                     </layout>`
    const vueCode = '<layout><h1>Here might be a page title</h1></layout>'
    expect(transformWithPlugin(jsxCode)).toBe(vueCompiled(vueCode))
  })
  test('identifier slot', () => {
    const jsxCode = `<layout>{slot}</layout>`
    expect(transformWithPlugin(jsxCode)).toBe('_openBlock(),_createBlock(_component_layout,null,slot)')
  })
})
